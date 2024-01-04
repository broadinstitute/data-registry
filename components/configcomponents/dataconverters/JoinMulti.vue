<template>
  <div id="joinMultiConfig" class="row">
    <div class="col-md-4 col">
      <div class="label">
        Select fields
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
              Select fields
            </div>
          </th>
        </tr>
        <tr v-for="field in fieldColumnNames" :key="field">
          <td>
            <input
              id="flexCheckDefault"
              v-model="selectedFields"
              class="form-check-input"
              type="checkbox"
              :value="field['raw field']"
              @change="(event)=>removeJoinEntry(event)"
            >
          </td>
          <td>
            <span class="form-check-label" for="flexCheckDefault">{{ field["field name"] }}</span>
          </td>
        </tr>
      </tbody>
    </div>
    <div class="col-md-4">
      <div class="label">
        New field name
        <input v-model="latestFieldName" type="text" class="form-control input-default">
      </div>
    </div>
    <div class="col-md-4 col">
      <tbody class="dr-byor-data-columns">
        <tr>
          <th colspan="3" />
          <th>
            <div class="label">
              Join by
            </div>
          </th>
        </tr>
        <tr v-for="field, index in selectedFields" class="arrow-button-list">
          <td>{{ getColumnName(field) }}</td>
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
          <td class="arrow-button-holder">
            <input
              v-if="index !== selectedFields.length - 1"
              type="text"
              size="5"
              class="form-control input-default arrow-field"
              :value="!!joinBy[index]? joinBy[index] : ''"
              @change="(event)=>getInput(index, event.target.value)"
            >
          </td>
        </tr>
      </tbody>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

const store = useConfigBuilderStore();
const props = defineProps({ loadConfig: String });
const fieldColumnNames = computed(() => store.selectedColumns);
const emit = defineEmits(['configChanged']);
const selectedFields = ref([]);
const selectAll = ref(false);
const joinBy = ref([]);
const latestFieldName = ref("");
const joinMultiConfig = ref({
  type: "join multi",
  "field name": latestFieldName,
  "fields to join": selectedFields,
  "join by": joinBy,
  "create new": true
});
function emitConfig () {
  emit('configChanged', joinMultiConfig.value, preSaveCheck());
}
function getColumnName (field) {
  return field === null ? "" : store.getColumnName(field);
}
if (props.loadConfig !== "{}") {
  const oldConfig = JSON.parse(props.loadConfig);
  latestFieldName.value = oldConfig["field name"];
  selectedFields.value = oldConfig["fields to join"];
  joinBy.value = oldConfig["join by"];
}
function moveUpDown (index, down = false) {
  if (down) { index++; }
  const risingItem = selectedFields.value[index];
  selectedFields.value.splice(index, 1);
  selectedFields.value.splice(index - 1, 0, risingItem);
}
function getInput (index, input) {
  joinBy.value[index] = input;
  emitConfig();
}
function removeJoinEntry (event) {
  // Trims the list of joins when an item is deselected.
  const box = event.target.value;
  const boxes = event.target._modelValue;
  if (!boxes.includes(box)) {
    joinBy.value.pop();
    emitConfig();
  }
}
function toggleSelectAll () {
  selectedFields.value = selectAll.value ? fieldColumnNames.value.map(field => field["raw field"]) : [];
}
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  const fieldsLength = joinMultiConfig.value["fields to join"].length;
  const joinLength = joinMultiConfig.value["join by"].length;
  if (fieldsLength < 2) {
    check.msg = "Select some fields to join.";
    return check;
  }
  if (joinLength !== fieldsLength - 1) {
    check.msg = "Specify join separators.";
    return check;
  }
  for (const joinEntry of joinMultiConfig.value["join by"]) {
    if (joinEntry.includes(",")) {
      check.msg = "Commas may not be used in field joins.";
      return check;
    }
  }
  check.ready = true;
  return check;
}
watch([latestFieldName, selectedFields, joinBy], () => {
  emitConfig();
});
</script>
