<template>
  <div class="tree-view mx-auto">
    <div v-html="treeContent"/>
  </div>
</template>

<script>
export default {
  name: 'TreeView',

  props: {
    tree: {
      type: Object,
    }
  },

  computed: {
    treeContent() {
      if (!this.tree) {
        return '';
      }
      //
      // if (typeof this.tree.content  === 'string'){
      //   return this.tree.content.replace(/,/g,',<br>').replace(/{/g,'{<br>');
      // }

      return this.tree.content;
    }
  }
}
</script>

<style lang="scss">
.tree-view {
  background-color: aqua;
  overflow: auto;
  max-height: 100%;
}
</style>
