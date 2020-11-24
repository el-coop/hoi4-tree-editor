<template>
  <div class="file has-name is-boxed">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" accept=".txt" @change="processFile">
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
    }
  },

  data() {
    return {
      fileName: null
    };
  },

  methods: {
    async processFile(event) {
      const file = event.target.files[0];
      this.fileName = file.name;
      const content = await this.processFileContent(file);
      this.$emit('input', {
        file,
        content
      });
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

        reader.readAsText(file);

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