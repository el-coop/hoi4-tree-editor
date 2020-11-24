<template>
  <div id="app">
    <General/>
    <TreeView/>
  </div>
</template>

<script>
import General from './components/General.vue'
import TreeView from './components/TreeView.vue'

export default {
  name: 'App',
  components: {
    General,
    TreeView
  }
}
</script>

<style lang="scss">
body, html {
  margin: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 20% auto;
  grid-template-rows: 100%;
}
</style>
