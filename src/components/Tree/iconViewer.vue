<template>
  <canvas class="focus-icon" :class="{'focus-icon--flipped': rotateImage}"/>
</template>

<script>
import * as THREE from "three";
import {DDSLoader} from "@/classes/DDSLoader";
import {TGALoader} from "@/classes/TGALoader";

export default {
  name: "iconViewer",
  props: {
    file: {
      required: true,
    },
    name: {
      type: String
    }
  },
  data() {
    return {
      rotateImage: true
    }
  },
  mounted() {
    this.showImage(this.file);
  },
  watch: {
    file: {
      handler() {
        this.showImage(this.file);
      }
    },
  },
  methods: {
    async showImage(file) {
      if (!file) {
        return;
      }
      const canvas = this.$el;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
      });

      const fov = 75;
      const aspect = 1;
      const near = 0.1;
      const far = 10;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      // renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      camera.position.z = 1;

      const scene = new THREE.Scene();


      const map = await this.loadTexture(file.content);

      const material = new THREE.MeshBasicMaterial({
        map,
        transparent: true
      });

      const boxWidth = 1;
      const boxHeight = map.image.height / map.image.width;
      const geometry = new THREE.PlaneGeometry(boxWidth, boxHeight);

      const plane = new THREE.Mesh(geometry, material);

      scene.add(plane);

      renderer.render(scene, camera);

      if (map.flipY) {
        this.rotateImage = false;
      }

    },
    loadTexture(content) {
      return new Promise((resolve, reject) => {
        let loader;
        if(this.file.file.name.endsWith('.dds')){
          loader = new DDSLoader();
        } else {
          loader = new TGALoader();
        }

        loader.load(content, (texture) => {
          if (this.name === 'GFX_focus_ALO_DKB' || this.name === 'GFX_focus_ALO_sun') {
          }
          resolve(texture);
        });
      });
    }
  }
}
</script>


<style lang="scss" scoped>
.focus-icon {
  height: 100%;
  width: 100%;

  &--flipped {
    transform: rotate(180deg);
  }
}
</style>