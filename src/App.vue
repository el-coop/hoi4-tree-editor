<template>
  <div id="app">
    <General @tree-chosen="parseTree"/>
    <TreeView :tree="tree"/>
  </div>
</template>

<script>
import General from './components/General.vue'
import TreeView from './components/TreeView.vue'
import FocusTree from "@/classes/FocusTree";

export default {
  name: 'App',
  components: {
    General,
    TreeView
  },
  data(){
    return {
      tree: null,
    }
  },
  methods: {
    async parseTree(content) {
      this.tree = await (new FocusTree(content)).parseContent();
    }
  }
}
</script>

<style lang="scss">
body, html {
  margin: 0;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
  display: grid;
  overflow: hidden;
  grid-template-columns: 20% auto;
  grid-template-rows: 100%;
}
</style>
