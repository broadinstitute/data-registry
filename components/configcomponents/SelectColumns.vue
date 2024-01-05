<template>
  Select fields to build page
  <sup class="optional">Edit default field names to set new names</sup>
  <div class="row">
    <table class="col-md-10">
      <tr v-if="rawFields.length > 0">
        <th>
          <input
            v-model="selectAllBox"
            class="form-check-input"
            type="checkbox"
            @change="toggleSelectAll()"
          >
        </th>
        <th>Field</th>
        <th>New field name</th>
      </tr>
      <tr v-for="(rawField, index) in rawFields" :key="index">
        <td>
          <input
            id="flexCheckDefault"
            v-model="selectedColumns"
            class="form-check-input"
            type="checkbox"
            :value="rawField"
            @change="toggleBox(index)"
          >
        </td>
        <td>{{ rawField }}</td>
        <td>
          <input
            :id="`field_${index}`"
            class="column-select form-control input-default"
            :disabled="!selectedColumns.includes(rawField)"
            type="text"
            @change="event => setColumnName(index, event.target.value)"
          >
          <sup :id="`warning_${index}`" hidden>Field names must be unique</sup>
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

const store = useConfigBuilderStore();
const rawFields = computed(() => store.rawFields);
const selectedColumns = ref([]);
const selectAllBox = ref(false);
function toggleBox (index) {
  const rawField = rawFields.value[index];
  if (selectedColumns.value.includes(rawField)) {
    store.addSelectedColumn(rawField);
    setDisplayName(index, rawField);
    return;
  }
  setDisplayName(index, "");
  store.deleteSelectedColumn(rawField);
}
function setColumnName (index, newName) {
  const warning = document.querySelector(`#warning_${index}`);
  warning.hidden = true;
  const rawField = rawFields.value[index];
  if (newName === "") {
    restoreDefaultColumnName(index);
    return;
  }
  if (store.selectedColumns.map(column => column["raw field"]).includes(newName)) {
    warning.hidden = false;
    restoreDefaultColumnName(index);
    return;
  }
  store.renameColumn(rawField, newName);
}
function restoreDefaultColumnName (index) {
  const rawField = rawFields.value[index];
  setDisplayName(index, rawField);
  store.renameColumn(rawField, rawField);
  // What happens if the original column data has an empty string in it?
}

function setDisplayName (index, newName) {
  const inputField = document.querySelector(`input#field_${index}`);
  inputField.value = newName;
}
function toggleSelectAll () {
  selectedColumns.value = selectAllBox.value ? rawFields.value : [];
  for (let i = 0; i < rawFields.value.length; i++) {
    toggleBox(i);
  }
}
watch(rawFields, (newFields, oldFields) => {
  oldFields.forEach((oldField) => {
    if (!newFields.includes(oldField)) {
      selectedColumns.value = selectedColumns.value.filter(column => column !== oldField);
      store.deleteSelectedColumn(oldField);
    }
  });
});
</script>
