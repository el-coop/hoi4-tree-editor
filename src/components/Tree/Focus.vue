<template>
  <div class="focus" :style="style">
    <dds-viewer v-if="iconType == 'dds'" :file="icon" :name="focus.icon[0]"/>

  </div>
</template>

<script>
import ddsViewer from "@/components/Tree/ddsViewer";

export default {
  name: "Focus",
  components: {ddsViewer},
  props: {
    gfxFiles: {
      type: Object,
      required: true
    },
    focus: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      iconType: null,
      icon: null
    };
  },

  mounted() {
    this.showIcon();
    this.$events.$on('gfx-updated', this.showIcon);
  },

  beforeDestroy() {
    this.$events.$off('gfx-updated');
  },

  watch: {
    focus: {
      handler() {
        this.showIcon();
      },
      deep: true
    },
  },

  methods: {
    showIcon() {
      let iconFileName = this.focus.icon[0];
      if (iconFileName.indexOf('GFX_focus_') > -1) {
        iconFileName = iconFileName.substr(4);
      }

      const file = this.gfxFiles[iconFileName] || false;

      if (file) {
        this.icon = file.content;
        if (file.file.name.endsWith('.dds')) {
          this.iconType = 'dds';
        }
      }
    }

  },

  computed: {
    style() {
      return {}
    }
  }
}
</script>

<style scoped>
.focus {
  position: absolute;
  padding: 5px;
  /*overflow: hidden;*/
}
</style>