<template>
  <div class="general">
    <FileField label="Choose national tree file" @input="treeChosen"/>
  </div>
</template>

<script>
import FileField from "@/components/Form/FileField";
export default {
  name: 'General',
  components: {FileField},
  methods: {
    treeChosen({content}){
      this.$emit('tree-chosen',content);
    }
  }
}
</script>

<style lang="scss">
.general{
  background-color: #1e1e2f;
  padding: 20px 10px;
}
</style>
