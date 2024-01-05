<template>
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
    <div class="label">
      <input
        id="false-button"
        v-model="createNewField"
        class="form-check-input"
        type="checkbox"
        name="first"
        value="create"
        :disabled="!fieldAvailable"
      >
      Create new field
    </div>
    <div v-if="createNewField" class="label new-field-name">
      New field name <sup>required</sup>
      <label>
        <input v-model="newFieldName" type="text" class="form-control input-default">
      </label>
    </div>
  </div>
</template>
<script setup>
import SingleFieldSelect from '@/components/configcomponents/SingleFieldSelect.vue';
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
const store = useConfigBuilderStore();
const props = defineProps({
  fieldIsLoaded: Boolean,
  selectedField: String,
  loadedFieldCreateNew: Boolean,
  loadedFieldName: String
});
const emit = defineEmits(["fieldNameSet"]);
const createNewField = ref(props.loadedFieldCreateNew);
const selectedField = ref(props.selectedField);
const selectedFieldColName = computed(() =>
  selectedField.value === null ? "" : store.getColumnName(selectedField.value)
);
const unConvertedFields = computed(() =>
  store.getUnConvertedFields.map(field => field["raw field"])
);
const fieldAvailable = computed(() => {
  const available = unConvertedFields.value.includes(selectedField.value);
  if (!props.fieldIsLoaded && !available) {
    createNewField.value = true;
  }
  // Force enable the convert option if you're loading a field which already has it chosen
  return (props.fieldIsLoaded && !props.loadedFieldCreateNew) ? true : available;
});
const newFieldName = ref(props.loadedFieldCreateNew ? props.loadedFieldName : "");
function acceptField (field) {
  selectedField.value = field;
}
watch([selectedField, createNewField, newFieldName], () => {
  const emitObject = {
    "create new": createNewField.value,
    "raw field": selectedField.value,
    "field name": createNewField.value ? newFieldName.value : selectedFieldColName.value,
  };
  emit("fieldNameSet", emitObject);
});
</script>
