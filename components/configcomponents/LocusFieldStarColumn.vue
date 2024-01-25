<template>
  <a href="https://hugeampkpncms.org/node/71" target="_blank" class="tutorial-link">
    Locus field tutorial
  </a> |
  <a href="https://hugeampkpncms.org/node/114" target="_blank" class="tutorial-link">
    Star column tutorial
  </a>
  <div class="row dr-builder-ui">
    <div class=" col-md-6 col text-center">
      <div class="label">
        Locus field
      </div>
      <FieldSelect v-model="locus" :noneOption="true"></FieldSelect>
    </div>
    <div class="col-md-6 col text-center">
      <div class="label">
        Star column
      </div>
      <FieldSelect v-model="star" :noneOption="true"></FieldSelect>
    </div>
  </div>
</template>
<script setup>
import FieldSelect from './FieldSelect.vue';
const emit = defineEmits(["locusChanged", "starChanged"]);
const locus = ref("");
const star = ref("");
watch(locus, () => { emit("locusChanged", locus.value); });
watch(star, () => { emit("starChanged", star.value); });
</script>
