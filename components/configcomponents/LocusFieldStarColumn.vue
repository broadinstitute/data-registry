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
      <select v-model="locus" class="form-control">
        <option value="">
          None
        </option>
        <option v-for="field in availableFields" :value="field" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-6 col text-center">
      <div class="label">
        Star column
      </div>
      <select v-model="star" class="form-control">
        <option value="">
          None
        </option>
        <option v-for="field in availableFields" :value="field" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

const store = useConfigBuilderStore();
const emit = defineEmits(["locusChanged", "starChanged"]);
const availableFields = computed(() => store.allFields);
const fieldNameOld = computed(() => store.latestFieldRename[0]);
const fieldNameNew = computed(() => store.latestFieldRename[1]);
const locus = ref("");
const star = ref("");
watch([availableFields, fieldNameOld], () => {
  // Handle name changes first
  if (locus.value === fieldNameOld.value) {
    locus.value = fieldNameNew.value;
  }
  if (star.value === fieldNameOld.value) {
    star.value = fieldNameNew.value;
  }

  // Then handle deletions
  if (!availableFields.value.includes(locus.value)) {
    locus.value = "";
  }
  if (!availableFields.value.includes(star.value)) {
    star.value = "";
  }
});
watch(locus, () => { emit("locusChanged", locus.value); });
watch(star, () => { emit("starChanged", star.value); });
</script>
