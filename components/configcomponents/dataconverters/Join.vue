<template>
  <div id="joinConfig" class="row">
    <div class="col-md-2 col">
      <div class="label">
        Select field 1
      </div>
      <SingleFieldSelect
        :selected-field="firstField"
        @field-selected="field => acceptField(field, 1)"
      />
    </div>
    <div class="col-md-2 col">
      <div class="label">
        Select field 2
      </div>
      <SingleFieldSelect
        :selected-field="secondField"
        @field-selected="field => acceptField(field, 2)"
      />
    </div>
    <div class="col-md-4">
      <div class="label">
        New field name
        <input v-model="latestFieldName" type="text" class="form-control input-default">
      </div>
    </div>
    <div class="col-md-4 col">
      <div class="label">
        Join by
      </div>
      <input v-model="joinBy" type="text" class="form-control input-default">
    </div>
  </div>
</template>
<script setup>
import SingleFieldSelect from '@/components/configcomponents/SingleFieldSelect.vue';
const props = defineProps({ loadConfig: String });
const emit = defineEmits(['configChanged']);
const firstField = ref(null);
const secondField = ref(null);
const joinBy = ref("");
const latestFieldName = ref("");
if (props.loadConfig !== "{}") {
  const oldConfig = JSON.parse(props.loadConfig);
  latestFieldName.value = oldConfig["field name"];
  firstField.value = oldConfig["fields to join"][0];
  secondField.value = oldConfig["fields to join"][1];
  joinBy.value = oldConfig["join by"];
}
watch([latestFieldName, firstField, secondField, joinBy], () => {
  emitConfig();
});
function preSaveCheck () {
  const check = {
    ready: false,
    msg: ""
  };
  if (joinBy.value.includes(",")) {
    check.msg = "Commas may not be used in field joins.";
    return check;
  }
  if (firstField.value === null || secondField.value === null) {
    check.msg = "Select two fields to join.";
    return check;
  }
  check.ready = true;
  return check;
}
function acceptField (field, fieldPosition) {
  if (fieldPosition === 1) {
    firstField.value = field;
  } else if (fieldPosition === 2) {
    secondField.value = field;
  }
}
function emitConfig () {
  const config = {
    type: "join",
    "field name": latestFieldName.value,
    "fields to join": [firstField.value, secondField.value],
    "join by": joinBy.value,
    "create new": true
  };
  emit('configChanged', config, preSaveCheck());
}
</script>
