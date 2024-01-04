<template>
  <div id="splitConfig" class="row">
    <div class="col-md-4 col">
      <div class="label">
        Select field
      </div>
      <SingleFieldSelect
        :selected-field="selectedField"
        @field-selected="field => acceptField(field)"
      />
    </div>
    <div class="col-md-4 col">
      <table>
        <tr>
          <th>
            <div class="label">
              New field name
            </div>
          </th>
          <th>
            <div class="label">
              Split by
            </div>
          </th>
        </tr>
        <tr v-for="entry, index in newFieldNames">
          <td>
            <input
              type="text"
              class="form-control input-default"
              :value="entry"
              @change="(event)=>updateNames(index, event.target.value)"
            >
          </td>
          <td v-if="index !== newFieldNames.length - 1">
            <input
              type="text"
              class="form-control input-default"
              :value="splitBy[index]"
              @change="(event)=>updateSplitBy(index, event.target.value)"
            >
          </td>
          <td>
            <button
              v-if="newFieldNames.length > 2"
              class="btn btn-secondary replace-chars-button delete-button"
              @click="deleteEntry(index)"
            >
              &times;
            </button>
          </td>
        </tr>
      </table>
      <button class="btn btn-primary add-button" @click="addEntry()">
        Add
      </button>
    </div>
  </div>
</template>
<script setup>
import SingleFieldSelect from '@/components/configcomponents/SingleFieldSelect.vue';
const props = defineProps({ loadConfig: String });
const emit = defineEmits(['configChanged']);
const selectedField = ref(null);
const splitBy = ref([""]);
const newFieldNames = ref(["", ""]);

function emitConfig () {
  const splitConfig = {
    type: "split",
    "field name": newFieldNames.value,
    "field to split": selectedField.value,
    "split by": splitBy.value,
    "create new": true
  };
  emit('configChanged', splitConfig, preSaveCheck());
}
if (props.loadConfig !== "{}") {
  const oldConfig = JSON.parse(props.loadConfig);
  selectedField.value = oldConfig["field to split"];
  splitBy.value = oldConfig["split by"];
  newFieldNames.value = oldConfig["field name"];
}

function updateNames (index, name) {
  newFieldNames.value[index] = name;
  emitConfig();
}

function updateSplitBy (index, splitChar) {
  splitBy.value[index] = splitChar;
  emitConfig();
}
function addEntry () {
  newFieldNames.value.push("");
  splitBy.value.push("");
  emitConfig();
}
function deleteEntry (index) {
  newFieldNames.value.splice(index, 1);
  const splicePos = index === splitBy.value.length ? index - 1 : index;
  splitBy.value.splice(splicePos, 1);
  emitConfig();
}
function acceptField (field) {
  selectedField.value = field;
}
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  const fieldsLength = newFieldNames.value.length;
  if (fieldsLength < 2) {
    check.msg = "Specify at least 2 fields.";
    return check;
  }
  for (let i = 0; i < fieldsLength; i++) {
    if (newFieldNames.value.slice(0, i).includes(newFieldNames.value[i])) {
      check.msg = "Specify unique field names.";
      return check;
    }
  }
  if (splitBy.value.length !== fieldsLength - 1 || splitBy.value.includes("")) {
    check.msg = "Specify split separators.";
    return check;
  }
  check.ready = true;
  return check;
}
watch([newFieldNames, selectedField, splitBy], () => {
  emitConfig();
});
</script>
