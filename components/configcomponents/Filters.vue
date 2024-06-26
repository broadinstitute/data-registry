<template>
  <h4>
    Filters
  </h4>
  <a href="https://hugeampkpncms.org/node/53" target="_blank" class="tutorial-link">
    Filter tutorial
  </a>
  <div class="row">
    <div class="col-md-12 col">
      <div>
        <div title="Builder">
          <div class="row">
            <div class="col-md-7">
              <div class="row dr-builder-ui">
                <div class="col-md-3 col">
                  <div class="label">
                    Select field
                  </div>
                  <FieldSelect v-model="selectedField"></FieldSelect>
                </div>
                <div class="col-md-3 col">
                  <div class="label">
                    Filter type
                  </div>
                  <select v-model="selectedFilterType" class="form-control">
                    <option v-for="item in Object.keys(filterTypeOptions)" :value="item" :key="item">
                      {{ filterTypeOptions[item] }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3 col">
                  <div class="label">
                    Label
                  </div>
                  <input v-model="filterLabel" type="text" class="form-control input-default">
                  <input
                    id="flexCheckDefault"
                    v-model="labelInBubble"
                    class="form-check-input"
                    type="checkbox"
                  >
                  <span class="form-check-label" for="flexCheckDefault"> Label in bubble</span>
                </div>
                <div class="col-md-3 col">
                  <button class="btn btn-primary btn-sm" type="button" @click="saveFilter()">
                    Save
                  </button>
                  <button class="btn btn-warning btn-sm" type="button" @click="clearAll()">
                    Cancel
                  </button>
                  <button class="btn btn-danger btn-sm" type="button" @click="deleteFilter()">
                    Delete
                  </button>
                  <div class="failed-save">
                    {{ message }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="row dr-builder-ui">
                <div class="col-md-12 col">
                  <div class="label">
                    Filter order
                  </div>
                  <tbody class="dr-byor-data-columns">
                    <tr v-for="(filter, index) in allFilters" class="arrow-button-list filter-row" :key="index">
                      <td>
                        {{ filter.label }}
                      </td>
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
                          :disabled="index === allFilters.length - 1"
                          @click="moveUpDown(index, true)"
                        >
                          &darr;
                        </button>
                      </td>
                      <td>
                        <span v-if="editingFilterIndex === index" class="editing-large">Editing</span>
                        <a v-else @click="editFilter(index)"><span class="edit-large">Edit</span></a>
                      </td>
                    </tr>
                  </tbody>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card-body dr-form">
    <h5>Filter format output</h5>
    <div class="row dr-builder-ui">
      <div class="col-md-10">
        <pre class="output">{{ JSON.stringify(allFilters) }}</pre>
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary btn-sm" type="button" @click="copyFilterConfig">
          Copy configuration
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import FieldSelect from './FieldSelect.vue';
const store = useConfigBuilderStore();
const fieldNameOld = computed(() => store.latestFieldRename[0]);
const fieldNameNew = computed(() => store.latestFieldRename[1]);
const message = ref("");
const editingFilterIndex = ref(-1);
const selectedField = ref("");
const selectedFilterType = ref(null);
const labelInBubble = ref(false);
const filterLabel = ref("");
const singleFilterConfig = ref({
  field: null,
  label: "",
  type: null,
  "label in bubble": "false"
});
const filterTypeOptions = {
  search: "Search",
  "search greater than": "Search greater than",
  "search lower than": "Search less than",
  "search or": "Search or",
  "search and": "Search and",
  dropdown: "Dropdown"
};
const allFilters = ref([]);
watch(fieldNameOld, () => {
  if (selectedField.value === fieldNameOld.value) {
    selectedField.value = fieldNameNew.value;
  }
  allFilters.value.forEach((item) => {
    if (item.field === fieldNameOld.value) {
      item.field = fieldNameNew.value;
    }
  });
});
watch(selectedField, () => singleFilterConfig.value.field = selectedField.value);
watch(filterLabel, () => singleFilterConfig.value.label = filterLabel.value.trim());
watch(selectedFilterType, () => singleFilterConfig.value.type =
		selectedFilterType.value === null ? "" : selectedFilterType.value.toLowerCase());
watch(labelInBubble, () => singleFilterConfig.value["label in bubble"] = `${labelInBubble.value}`);
function saveFilter () {
  if (singleFilterConfig.value.field === null) {
    message.value = "Select a field to filter.";
    return;
  }
  if (singleFilterConfig.value.label === "") {
    message.value = "Enter a filter label.";
    return;
  }
  if (singleFilterConfig.value.type === null ||
				singleFilterConfig.value.type === "") {
    message.value = "Select a filter type.";
    return;
  }
  const thisFilter = JSON.parse(JSON.stringify(singleFilterConfig.value)); // Deep copy
  if (editingFilterIndex.value !== -1) {
    allFilters.value[editingFilterIndex.value] = thisFilter;
  } else {
    allFilters.value.push(thisFilter);
  }
  clearAll();
}
function clearAll () {
  editingFilterIndex.value = -1;
  message.value = "";
  selectedField.value = "";
  selectedFilterType.value = null;
  labelInBubble.value = false;
  filterLabel.value = "";
}
function editFilter (index) {
  editingFilterIndex.value = index;
  const filterContent = JSON.parse(JSON.stringify(allFilters.value[index])); // Deep copy
  selectedField.value = filterContent.field;
  filterLabel.value = filterContent.label;
  selectedFilterType.value = filterTypeOptions[filterContent.type];
  labelInBubble.value = filterContent["label in bubble"] === "true";
}

function deleteFilter () {
  if (editingFilterIndex.value !== -1) {
    allFilters.value.splice(editingFilterIndex.value, 1);
  }
  clearAll();
}
function moveUpDown (index, down = false) {
  if (down) { index++; }
  const risingItem = allFilters.value[index];
  allFilters.value.splice(index, 1);
  allFilters.value.splice(index - 1, 0, risingItem);
}

function copyFilterConfig () {
  navigator.clipboard.writeText(JSON.stringify(allFilters.value));
}
</script>
