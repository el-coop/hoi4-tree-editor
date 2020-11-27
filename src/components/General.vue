<template>
  <div class="general">
    <FileField label="Choose national tree file" @input="treeChosen"/>
    <FileField label="Choose gfx files" @input="gfxFiles" accept=".dds, .tga" :multiple="true" :text-file="false"/>
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
    },
    gfxFiles(files){
      this.$emit('gfx-files', files);
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
