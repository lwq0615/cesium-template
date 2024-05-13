<template>
  <div
    class="point_info"
    v-show="open"
    :style="{left: position?.x + 'px', top: position?.y + 'px'}"
  >123</div>
</template>

<script setup>
import { ref, defineExpose } from "vue";

const open = ref(false);
const position = ref();

function show(screenPosition) {
  open.value = true;
  position.value = {
    ...screenPosition
  };
}

function hide() {
  open.value = false;
}

defineExpose({
  position,
  show,
  hide
});
</script>

<style lang="scss" scoped>
.point_info {
  background-color: red;
  position: absolute;
  z-index: 99;
  transform: translate(10px, -50%);
}
</style>