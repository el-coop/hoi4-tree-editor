<template>
  <div class="tree-view mx-auto">
    <template v-if="! focuses">
      <div v-html="treeContent"/>
    </template>
    <template v-else>
      <Focus v-for="focus in focuses" :focus="focus" :key="focus.id[0]" :style="calcFocusStyle(focus)"
             :gfx-files="gfxFiles"/>
    </template>
  </div>
</template>

<script>
import Focus from "@/components/Tree/Focus";

export default {
  name: 'TreeView',
  components: {Focus},

  props: {
    tree: {
      type: Object,
    },
    gfxFiles: {
      type: Object,
      required: true
    },

  },

  data() {
    return {
      focuses: null,
      focusSize: 150,
    }
  },

  watch: {
    tree() {
      if (!this.tree || typeof this.tree.content === 'string') {
        return;
      }

      this.focuses = this.tree.content.focus_tree[0].focus;
    }
  },

  methods: {
    calcFocusPosition(focus) {
      let x = parseInt(focus.x[0]);
      let y = parseInt(focus.y[0]);
      if (focus.relative_position_id) {
        const relativeFocus = this.findFocusById(focus.relative_position_id[0]);
        const relativeFocusPosition = this.calcFocusPosition(relativeFocus);
        x = relativeFocusPosition.x + x;
        y = relativeFocusPosition.y + y;
      }
      return {
        x,
        y,
      }
    },

    calcFocusStyle(focus) {
      const {x, y} = this.calcFocusPosition(focus);
      const left = x * this.focusSize;
      const top = y * this.focusSize;
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${this.focusSize}px`,
        height: `${this.focusSize}px`,
      }
    },

    findFocusById(id) {
      return this.focuses.find((focus) => {
        return focus.id[0] == id;
      });
    }
  },

  computed: {
    treeContent() {
      if (!this.tree) {
        return '';
      }

      return this.tree.content;
    },
  }
}
</script>

<style lang="scss">
.tree-view {
  background-color: #2a5687;
  overflow: auto;
  max-height: 100%;
  position: relative;
}
</style>
