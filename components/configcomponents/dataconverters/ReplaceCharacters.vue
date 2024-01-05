<template>
  <div id="replaceCharactersConfig" class="row">
    <CreateNewField
      :selected-field="selectedField"
      :field-is-loaded="fieldIsLoaded"
      :loaded-field-create-new="defaultCreateNew"
      :loaded-field-name="latestFieldName"
      @field-name-set="fieldInfo => processFieldInfo(fieldInfo)"
    />
    <div class="col-md-4 col">
      <table>
        <tr>
          <th>
            <div class="label">
              Replace
            </div>
          </th>
          <th>
            <div class="label">
              With
            </div>
          </th>
        </tr>
        <tr v-for="(entry, index) in replaceChars" :key="index">
          <td>
            <input
              type="text"
              class="form-control input-default"
              :value="entry['from']"
              @change="(event)=>updateFrom(index, event.target.value)"
            >
          </td>
          <td>
            <input
              type="text"
              class="form-control input-default"
              :value="entry['to']"
              @change="(event)=>updateTo(index, event.target.value)"
            >
          </td>
          <td>
            <button
              v-if="replaceChars.length > 1"
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
import CreateNewField from '@/components/configcomponents/CreateNewField.vue';
const props = defineProps({ loadConfig: String });
const emit = defineEmits(['configChanged']);
const selectedField = ref(null);
const fieldIsLoaded = ref(false);
const latestFieldName = ref("");
const createNewField = ref(false);
const defaultCreateNew = ref(false);
const replaceChars = ref([
  {
    from: "",
    to: ""
  }
]);
if (props.loadConfig !== "{}") {
  fieldIsLoaded.value = true;
  const oldConfig = JSON.parse(props.loadConfig);
  selectedField.value = oldConfig["raw field"];
  replaceChars.value = oldConfig.replace;
  latestFieldName.value = oldConfig["field name"];
  createNewField.value = oldConfig["create new"];
  defaultCreateNew.value = oldConfig["create new"];
}
function addEntry () {
  replaceChars.value.push({
    from: "",
    to: ""
  });
}
function deleteEntry (index) {
  replaceChars.value.splice(index, 1);
}
function updateFrom (index, value) {
  replaceChars.value[index].from = value;
  emitConfig();
}
function updateTo (index, value) {
  replaceChars.value[index].to = value;
  emitConfig();
}
watch([latestFieldName, selectedField, replaceChars], () => {
  emitConfig();
});
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  if (selectedField.value === null) {
    check.msg = "Select a raw field.";
    return check;
  }
  for (const entry of replaceChars.value) {
    if (entry.from === "") {
      check.msg = "Fill in all 'Replace' entries.";
      return check;
    }
    if (entry.to.includes(",")) {
      check.msg = "Commas may not be used in character replacements.";
      return check;
    }
  }
  check.ready = true;
  return check;
}
function emitConfig () {
  const replaceCharConfig = {
    type: 'replace characters',
    'field name': latestFieldName.value,
    'raw field': selectedField.value,
    replace: replaceChars.value,
    'create new': createNewField.value
  };
  emit('configChanged', replaceCharConfig, preSaveCheck());
}
function processFieldInfo (fieldInfo) {
  createNewField.value = fieldInfo["create new"];
  latestFieldName.value = fieldInfo["field name"];
  selectedField.value = fieldInfo["raw field"];
}
</script>
