<template>
  <div id="scoreColumnsConfig" class="row">
    <div class="col-md-4 col">
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
              @change="(event)=>addRemoveEntry(event)"
            >
          </td>
          <td>
            <span class="form-check-label" for="flexCheckDefault">{{ field["field name"] }}</span>
          </td>
        </tr>
      </tbody>
    </div>
    <div class="col-md-4 col">
      <div class="label">
        New field name
        <input v-model="latestFieldName" type="text" class="form-control input-default">
      </div>
    </div>
    <div class="col-md-4 col">
      <table class="dr-byor-data-columns">
        <tr>
          <th />
          <th>
            <div class="label">
              Score true
            </div>
          </th>
          <th>
            <div class="label">
              Score false
            </div>
          </th>
        </tr>
        <tr v-for="field in selectedFields" :key="field">
          <td>{{ getColumnName(field) }}</td>
          <td>
            <input
              type="number"
              class="form-control input-default"
              :value="!!scores[field] ? scores[field]['value to score']['yes'] : 1"
              @change="(event)=>updateScore(field, 'yes', event.target.value)"
            >
          </td>
          <td>
            <input
              type="number"
              class="form-control input-default"
              :value="!!scores[field] ? scores[field]['value to score']['no'] : 0"
              @change="(event)=>updateScore(field, 'no', event.target.value)"
            >
          </td>
        </tr>
      </table>
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
const scores = ref({});
const latestFieldName = ref("");
const scoreColumnsConfig = ref({
  type: "score columns",
  "field name": latestFieldName,
  "fields to score": selectedFields,
  "score by": scores,
  "create new": true
});
if (props.loadConfig !== "{}") {
  const oldConfig = JSON.parse(props.loadConfig);
  latestFieldName.value = oldConfig["field name"];
  const fields = oldConfig["fields to score"];
  selectedFields.value = fields;
  fields.forEach((field) => {
    const yesVal = oldConfig['score by'][field]['value to score'].yes;
    const noVal = oldConfig['score by'][field]['value to score'].no;
    addNewEntry(field, yesVal, noVal);
  });
}
function getColumnName (field) {
  return field === null ? "" : store.getColumnName(field);
}
function addRemoveEntry (event) {
  const box = event.target.value;
  const boxes = event.target._modelValue;
  if (boxes.includes(box)) {
    addNewEntry(box);
  } else {
    removeEntry(box);
  }
  emitConfig();
}
function removeEntry (field) {
  delete scores.value[field];
}
function addNewEntry (field, yesVal = 1, noVal = 0) {
  // Adds to the score object when a new item is selected
  const newEntry = {
    type: "boolean",
    "value to score": {
      yes: yesVal,
      no: noVal
    }
  };
  scores.value[field] = newEntry;
}
function updateScore (field, yesOrNo, value) {
  const scoreValue = parseInt(value);
  if (value === "" || value === null || typeof (scoreValue) !== 'number') {
    // Force emit a value of false for ready to save
    emit('configChanged', scoreColumnsConfig.value, {
      ready: false,
      msg: "Scores must be numerical."
    });
  } else {
    scores.value[field]["value to score"][yesOrNo] = scoreValue;
    emitConfig();
  }
}
function toggleSelectAll () {
  selectedFields.value = selectAll.value ? fieldColumnNames.value.map(field => field["raw field"]) : [];
}
watch([latestFieldName, selectedFields, scores], () => {
  emitConfig();
});
function emitConfig () {
  emit('configChanged', scoreColumnsConfig.value, preSaveCheck());
}
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  if (scoreColumnsConfig.value["fields to score"].length < 1) {
    check.msg = "Select fields to score.";
    return check;
  }
  for (const field of scoreColumnsConfig.value["fields to score"]) {
    if (!scoreColumnsConfig.value["score by"][field]) {
      check.msg = "Specify values for score calculation.";
      return check;
    }
  }
  check.ready = true;
  return check;
}
</script>
