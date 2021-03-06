const clarinet = require("clarinet");
const ARRAYABLE_PROPERTIES = ['"traits":', '"search_filters":', '"prioritize":', '"remove_ideas":', '"add_ideas":', '"nationalities":', '"generator":'];

function endsWithAny(string, suffixes) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}

function parseContent(content) {

    const lines = content.split('\n');
    let result = '{';
    let takeAsArray = false;
    let log = false;

    lines.forEach((line, i) => {

        line = (line.split('#')[0]).trim();
        let expectingKey = true;
        let stringStarted = false;
        let lastChar = '';
        let takeAll = false;
        let takeAllStart = 0;
        let ignoreRest = false;
        line = line.replace(/\t/g, ' ');
        [...line].forEach((char, index) => {
            if (line === '}if = {') {
                log = true;
            } else {
                log = false;
            }

            if (ignoreRest) {
                return;
            }

            if (takeAll) {
                result += char;
                if ((char === '"' && !result.endsWith('\\"')) || index === (line.length - 1)) {
                    if (!result.endsWith('"')) {
                        result += '"';
                    }

                    if (! endsWithAny(result.slice(-(index - takeAllStart + 2)).substr(0, 1),[',','{'])) {
                        result += ',';
                        expectingKey = true;
                    }
                    takeAll = false;
                }

            } else if (char === '=') {
                if (result.endsWith(',')) {
                    result = result.slice(0, -2);
                    takeAll = true;
                    takeAllStart = index;
                    result += ' =';
                } else {
                    if (!result.endsWith('"')) {
                        result += '"';
                    }
                    result += ':';
                }
                expectingKey = false;
                stringStarted = false;
                if (result.endsWith('log":') && line[index + 2] !== '"') {
                    result += '"';
                    takeAll = true;
                    takeAllStart = index;
                }
            } else if (char === '"') {
                result += '"';
                takeAll = true;
                takeAllStart = index;
            } else if (char === '>' || char === '<') {
                result += `: "${char} `;
                expectingKey = false;
                stringStarted = true;
            } else if (char === '}') {
                if (result.endsWith(',"')) {
                    result = result.slice(0, -1);
                }

                if (result.endsWith(',')) {
                    result = result.slice(0, -1);
                } else if (!endsWithAny(result, ['"', '{'])) {
                    result += '"';
                }
                if (takeAsArray) {
                    if (result.endsWith('["')) {
                        result = result.slice(0, -1);
                    }
                    result += "],";
                    takeAsArray = false;
                } else {
                    result += '},';
                    expectingKey = true;
                }

            } else if (char === '{') {

                if (endsWithAny(result, ARRAYABLE_PROPERTIES)) {
                    takeAsArray = true;
                    result += '[';
                } else {
                    if (!result.endsWith(':')) {
                        if (!result.endsWith('"')) {
                            result += '"';
                        }
                        result += ':';
                    }
                    result += '{';
                    stringStarted = false;
                    expectingKey = true;
                }

            } else if (char !== ' ') {
                if ((lastChar === ' ' || lastChar === '' || lastChar === '{' || lastChar === '=' ||  lastChar === '}') && !stringStarted) {
                    if (!endsWithAny(result, [':', '{', ',', '['])) {
                        result += ":{"
                        ignoreRest = true;
                        return;
                    } else {
                        result += '"';
                        stringStarted = true;
                    }
                }
                result += char;

                if ((index == (line.length - 1) && stringStarted)) {
                    result += '"';
                    stringStarted = false;
                    if (!expectingKey || takeAsArray) {
                        result += ',';
                        expectingKey = true;
                    }

                }
            } else if ((lastChar !== ' ' && stringStarted)) {
                result += '"';
                stringStarted = false;
                if (!expectingKey || takeAsArray) {
                    result += ',';
                    expectingKey = true;
                }

            }

            if (char === '>' || char === '<') {
                lastChar = ' ';
            } else {
                lastChar = char;
            }
        });
    });

    if (!result.endsWith('}')) {
        if (result.endsWith(',')) {
            result = result.slice(0, -1);
        }
        if (!result.endsWith('}')) {
            result += '}';
        }
    }

    return result + '}';
}

function parseJsonContent(content) {

    return new Promise((resolve, reject) => {
        const parser = clarinet.parser();
        const keys = [];
        const pointers = [];
        let result = {};
        let index = 0;
        let currentKey = null;

        parser.onopenobject = function (key) {
            if (keys.length) {
                const resultKey = keys[keys.length - 1];

                pointers.push(result);
                if (Array.isArray(result[resultKey])) {
                    result[resultKey].push({});
                } else {
                    result[resultKey] = [{}];
                }
                result = result[resultKey][result[resultKey].length - 1];
            }

            keys.push(key);
            result[key] = {};
        }

        parser.oncloseobject = function () {
            if (pointers.length) {
                result = pointers.pop();
            }
            keys.pop();
        };

        parser.onkey = function (key) {
            if (keys[keys.length - 1] !== key) {
                keys.push(key);
            }
            if (!result[key]) {
                result[key] = [];
            }

        };
        parser.onvalue = function (value) {
            try {
                const key = keys.pop();

                if (result[key]) {
                    if (Array.isArray(result[key])) {
                        result[key].push(value);
                    } else {
                        result[key] = [value];
                    }
                } else {
                    result[key] = value;
                }

            } catch (error) {
                console.log(error);
                resolve(pointers[0]);
            }
        };

        parser.onend = function () {
            resolve(result);
        };


        parser.write(content).close();
    });
}


class FocusTree {
    constructor(content) {
        this.content = parseContent(content);
    }

    async parseContent() {
        try {
            this.content = await parseJsonContent(this.content);
        } catch (error) {
            console.log(error);
        }
        return this;
    }
}

export default FocusTree;