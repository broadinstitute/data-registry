<template>
  <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
    Top rows tutorial
  </a>
  <div class="row dr-builder-ui">
    <div class="col-md-6 col">
      <div class="label">
        Select rows
      </div>
      <FieldCheckboxes v-model="selectedFields"></FieldCheckboxes>
    </div>
    <div class="col-md-6 col">
      <div class="label">
        Set order
      </div>
      <tbody class="dr-byor-data-columns">
        <tr v-for="(field, index) in selectedFields" class="arrow-button-list" :key="index">
          {{ field }}
          <td class="arrow-button-holder">
            <button
              class="btn btn-primary arrow-button arrow-button-up"
              :disabled="index === 0"
              @click="moveUpDown(index)"
            >
              &uarr;
            </button>
          </td>
          <td class="arrow-button-holder">
            <button
              class="btn btn-primary arrow-button"
              :disabled="index === selectedFields.length - 1"
              @click="moveUpDown(index, true)"
            >
              &darr;
            </button>
          </td>
        </tr>
      </tbody>
    </div>
  </div>
</template>
<script setup>
  import FieldCheckboxes from './FieldCheckboxes.vue';
  const emit = defineEmits(["topRowsChanged"]);
  const selectedFields = ref([]);
  function moveUpDown (index, down = false) {
    if (down) { index++; }
    const risingItem = selectedFields.value[index];
    selectedFields.value.splice(index, 1);
    selectedFields.value.splice(index - 1, 0, risingItem);
  }
  watch(selectedFields, () => emit("topRowsChanged", selectedFields.value));
</script>
