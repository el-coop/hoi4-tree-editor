<template>
  <div id="app">
    <General @tree-chosen="parseTree" @gfx-files="addGfxFiles"/>
    <TreeView :tree="tree" :gfx-files="gfxFiles"/>
  </div>
</template>

<script>
import General from './components/General.vue'
import TreeView from './components/TreeView.vue'
import FocusTree from "@/classes/FocusTree";
import {DDSLoader} from '@/classes/DDSLoader';
import * as THREE from 'three';

export default {
  name: 'App',
  components: {
    General,
    TreeView
  },
  data() {
    return {
      tree: null,
      gfxFiles: {}
    }
  },
  methods: {
    loadFile(file, canvasId = 'canvas', parse = false) {


    },
    async parseTree(content) {
      this.tree = await (new FocusTree(content)).parseContent();
    },
    addGfxFiles(files) {
      files.forEach(({file, content}, index) => {
        if (index == 0) {
          this.loadFile(content, 'canvas1', true);
        }
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        this.gfxFiles[name] = {
          content,
          file
        }
      });
      this.$events.$emit('gfx-updated');
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
