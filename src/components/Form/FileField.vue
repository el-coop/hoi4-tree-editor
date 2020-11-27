<template>
  <div class="file has-name is-boxed">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" :accept="accept" @change="processFiles" :multiple="multiple">
      <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label" v-text="label"/>
    </span>
      <span v-if="fileName" class="file-name" v-text="fileName"/>
    </label>
  </div>
</template>

<script>
export default {
  name: "FileField",

  props: {
    label: {
      type: String,
      default: 'Choose a file'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.txt'
    },
    textFile: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      fileName: null
    };
  },

  methods: {
    async processFile(file) {
      this.fileName = file.name;
      const content = await this.processFileContent(file);
      return content;

    },

    async processFiles(event) {
      let result = [];
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const content = await this.processFile(file);
        result.push({
          file,
          content
        });
      }
      if (!this.multiple) {
        result = result[0];
      }
      this.$emit('input', result)
    },

    processFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('abort', (error) => {
          reject(error);
        });
        reader.addEventListener('error', (error) => {
          reject(error);
        });
        reader.addEventListener('loadend', async (event) => {
          resolve(reader.result);
        });

        if (this.textFile) {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }

      });
    }
  },

}
</script>

<style scoped>
.file-name {
  color: white;
}
</style>