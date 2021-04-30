<template>
  <div class="focus" :style="style">
    <div class="focus__icon-wrapper">
      <icon-viewer :file="icon" :name="focus.icon[0]"/>
    </div>
    <div class="focus__description">

    </div>
  </div>
</template>

<script>
import iconViewer from "@/components/Tree/iconViewer";

export default {
  name: "Focus",
  components: {iconViewer},
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
      icon: null,
      iconName: ''
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
      if (iconFileName.indexOf('GFX_') > -1) {
        iconFileName = iconFileName.substr(4);
      }
      let file = this.gfxFiles[iconFileName] || false;

      if (!file) {
        if (iconFileName.indexOf('focus_') > -1) {
          iconFileName = iconFileName.substr(6);
        } else if (iconFileName.indexOf('goal_') > -1) {
          iconFileName = iconFileName.substr(5);
        }
      }

      file = this.gfxFiles[iconFileName] || false;

      this.iconName = iconFileName;

      if (file) {
        this.icon = file;
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

<style scoped lang="scss">
.focus {
  position: absolute;
  padding: 5px;

  &__icon-wrapper {
    height: 140px;
    width: 150px;
  }

  &__description {
    color: white;
    border: 1px solid #1e1e2f;
    width: 100%;
    min-height: 10px;
  }
}
</style>