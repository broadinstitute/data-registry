<template>
  <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
    Top rows tutorial
  </a>
  <div class="row dr-builder-ui">
    <div class="col-md-6 col">
      <div class="label">
        Select rows
      </div>
      <tbody>
        <tr>
          <th>
            <input
              v-model="selectAll"
              class="form-check-input"
              type="checkbox"
              @change="toggleSelectAll()"
            >
          </th>
          <th>
            <div class="label">
              Select top rows
            </div>
          </th>
        </tr>
        <FieldCheckboxes v-model="selectedFields"></FieldCheckboxes>
      </tbody>
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
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import FieldCheckboxes from './FieldCheckboxes.vue';
const store = useConfigBuilderStore();
const emit = defineEmits(["topRowsChanged"]);
const availableFields = computed(() => store.allFields);
const selectedFields = ref([]);
const selectAll = ref(false);
const fieldNameOld = computed(() => store.latestFieldRename[0]);
const fieldNameNew = computed(() => store.latestFieldRename[1]);
watch([availableFields, fieldNameOld], (newValues, oldValues) => {
  if (selectedFields.value.includes(fieldNameOld.value) && !selectedFields.value.includes(fieldNameNew.value)) {
    const index = selectedFields.value.indexOf(fieldNameOld.value);
    selectedFields.value[index] = fieldNameNew.value;
  }
  const oldFields = oldValues[0];
  const newFields = newValues[0];
  oldFields.forEach((oldField) => {
    if (!newFields.includes(oldField)) {
      selectedFields.value =
                    selectedFields.value.filter(field => field !== oldField);
    }
  });
});
function moveUpDown (index, down = false) {
  if (down) { index++; }
  const risingItem = selectedFields.value[index];
  selectedFields.value.splice(index, 1);
  selectedFields.value.splice(index - 1, 0, risingItem);
}
function toggleSelectAll () {
  selectedFields.value = selectAll.value ? availableFields.value.slice() : []; // Deep copy
}
watch(selectedFields, () => emit("topRowsChanged", selectedFields.value));
</script>
