<template>
  <div id="array2StringConfig" class="row">
    <CreateNewField
      :selected-field="selectedField"
      :field-is-loaded="fieldIsLoaded"
      :loaded-field-create-new="defaultCreateNew"
      :loaded-field-name="latestFieldName"
      @field-name-set="fieldInfo => processFieldInfo(fieldInfo)"
    />
    <div class="col-md-4 col">
      <div class="label">
        Separate items by
      </div>
      <input v-model="separator" type="text" class="form-control input-default">
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
const separator = ref("");
const defaultCreateNew = ref(false);
const createNewField = ref(false);

if (props.loadConfig !== "{}") {
  fieldIsLoaded.value = true;
  const oldConfig = JSON.parse(props.loadConfig);
  selectedField.value = oldConfig["raw field"];
  separator.value = oldConfig["separate by"];
  latestFieldName.value = oldConfig["field name"];
  createNewField.value = oldConfig["create new"];
  defaultCreateNew.value = oldConfig["create new"];
}
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  if (selectedField.value === null) {
    check.msg = "Select a field.";
    return check;
  }
  // separator CAN be an empty string so we don't check that
  if (separator.value.includes(",")) {
    check.msg = "Commas may not be used in separator.";
    return check;
  }
  check.ready = true;
  return check;
}
function emitConfig () {
  const arrayRenameConfig = {
    type: 'array to string',
    'field name': latestFieldName.value,
    'raw field': selectedField.value,
    'separate by': separator.value,
    'create new': createNewField.value
  };
  emit('configChanged', arrayRenameConfig, preSaveCheck());
}
function processFieldInfo (fieldInfo) {
  createNewField.value = fieldInfo["create new"];
  latestFieldName.value = fieldInfo["field name"];
  selectedField.value = fieldInfo["raw field"];
}
watch([latestFieldName, selectedField, separator], () => emitConfig());
</script>
