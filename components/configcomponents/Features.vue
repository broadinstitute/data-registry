<template>
  <a href="https://hugeampkpncms.org/node/45" target="_blank" class="tutorial-link">
    Features tutorial
  </a>
  <div class="row dr-builder-ui">
    <div class="col-md-3 col">
      <div class="label">
        Feature name
      </div>
      <input v-model="currentFeatureName" type="text" class="form-control input-default">
    </div>
    <div class="col-md-3 col">
      <tr>
        <th colspan="2">
          <div class="label">
            Select fields
          </div>
        </th>
      </tr>
      <FieldCheckboxes v-model="currentSelectedFields"></FieldCheckboxes>
    </div>
    <div class="col-md-5 col">
      <div class="label">
        Set order
      </div>
      <tbody class="dr-byor-data-columns">
        <tr v-for="(field, index) in currentSelectedFields" class="arrow-button-list" :key="field">
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
              :disabled="index === currentSelectedFields.length - 1"
              @click="moveUpDown(index, true)"
            >
              &darr;
            </button>
          </td>
        </tr>
      </tbody>
      <div class="failed-save">
        {{ saveErrorMsg }}
      </div>
    </div>
    <div class="col-md-1 col">
      <button class="btn btn-primary btn-sm" type="button" @click="saveFeature()">
        Save
      </button>
      <button class="btn btn-warning btn-sm" type="button" @click="doneEditing()">
        Cancel
      </button>
      <button class="btn btn-danger btn-sm" type="button" @click="deleteFeature()">
        Delete
      </button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 col text-center dr-bubbles-wrapper">
      <div v-for="(feature, index) in allFeaturesConfig.features" class="dr-format-bubble" :key="index">
        <button
          class="btn btn-secondary move-prev-next"
          :disabled="editingFeatureIndex !== -1 || index === 0"
          @click="movePrevNext(index)"
        >
          &leftarrow;
        </button>
        <span class="name">{{ feature }}</span>
        <span v-if="editingFeatureIndex === index" class="editing">Editing</span>
        <a v-else @click="editFeature(index)"><span class="edit">Edit</span></a>
        <button
          class="btn btn-secondary move-prev-next"
          :disabled="editingFeatureIndex !== -1 || index === allFeaturesConfig.features.length - 1"
          @click="movePrevNext(index, true)"
        >
          &rightarrow;
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import FieldCheckboxes from './FieldCheckboxes.vue';
const store = useConfigBuilderStore();
const emit = defineEmits(["featuresChanged"]);
// WHY is this updating on such a delay
const availableFields = computed(() => {
  const fields = store.allFields;
  return fields;
});
const fieldNameOld = computed(() => store.latestFieldRename[0]);
const fieldNameNew = computed(() => store.latestFieldRename[1]);
const currentFeatureName = ref("");
const currentSelectedFields = ref([]);
const editingFeatureIndex = ref(-1);
const saveErrorMsg = ref("");
const selectAll = ref(false);
const allFeaturesConfig = ref({
  features: []
});
const offLimitsNames = [
  "data convert",
  "column formatting",
  "top rows",
  "features",
  "tool tips",
  "locus field",
  "star column"
];
function moveUpDown (index, down = false) {
  if (down) { index++; }
  const risingItem = currentSelectedFields.value[index];
  currentSelectedFields.value.splice(index, 1);
  currentSelectedFields.value.splice(index - 1, 0, risingItem);
}
function movePrevNext (index, next = false) {
  if (next) { index++; }
  const list = allFeaturesConfig.value.features;
  const risingItem = list[index];
  list.splice(index, 1);
  list.splice(index - 1, 0, risingItem);
  allFeaturesConfig.value.features = list;
  emitFeatures();
}
function saveFeature () {
  const trimmedName = currentFeatureName.value.trim();
  if (offLimitsNames.includes(trimmedName)) {
    saveErrorMsg.value = `${trimmedName} is a reserved keyword. Choose a different name.`;
    return;
  }
  if (trimmedName.length > 0 && currentSelectedFields.value.length > 0) {
    // Check for duplicates
    for (let i = 0; i < allFeaturesConfig.value.features.length; i++) {
      const existingFeature = allFeaturesConfig.value.features[i];
      if (i !== editingFeatureIndex.value && existingFeature === trimmedName) {
        saveErrorMsg.value = "Select a unique feature name.";
        return;
      }
    }
    if (editingFeatureIndex.value === -1) {
      allFeaturesConfig.value.features.push(trimmedName);
      allFeaturesConfig.value[trimmedName] = currentSelectedFields.value;
    } else {
      const oldName = allFeaturesConfig.value.features[editingFeatureIndex.value];
      allFeaturesConfig.value.features[editingFeatureIndex.value] = trimmedName;
      allFeaturesConfig.value[trimmedName] = currentSelectedFields.value;
      if (oldName !== trimmedName) {
        delete allFeaturesConfig.value[oldName];
      }
    }
    doneEditing();
    emitFeatures();
  } else if (trimmedName === "") {
    saveErrorMsg.value = "Enter feature name.";
  } else if (currentSelectedFields.value.length === 0) {
    saveErrorMsg.value = "Select some fields.";
  }
}
function editFeature (index) {
  if (editingFeatureIndex.value !== -1) {
    saveErrorMsg.value = "Already editing another feature. Save or cancel to continue";
    return;
  }
  editingFeatureIndex.value = index;
  const prevName = allFeaturesConfig.value.features[index];
  currentFeatureName.value = allFeaturesConfig.value.features[index];
  currentSelectedFields.value = allFeaturesConfig.value[prevName];
  saveErrorMsg.value = "";
}
function deleteFeature () {
  if (editingFeatureIndex.value !== -1) {
    const featureToDelete = allFeaturesConfig.value.features[editingFeatureIndex.value];
    allFeaturesConfig.value.features =
                allFeaturesConfig.value.features.filter(feature => feature !== featureToDelete);
    delete allFeaturesConfig.value[featureToDelete];
    editingFeatureIndex.value = null;
  }
  doneEditing();
  emitFeatures();
}
function doneEditing () {
  saveErrorMsg.value = "";
  currentFeatureName.value = "";
  currentSelectedFields.value = [];
  editingFeatureIndex.value = -1;
  selectAll.value = false;
}
watch([availableFields, fieldNameOld], (newValues, oldValues) => {
  // First handle name changes
  allFeaturesConfig.value.features.forEach((feature) => {
    const featureCopy = allFeaturesConfig.value[feature];
    // Guarding against duplicate names in features due to create/convert
    if (!featureCopy.includes(fieldNameNew.value)) {
      for (let i = 0; i < featureCopy.length; i++) {
        if (featureCopy[i] === fieldNameOld.value) {
          featureCopy[i] = fieldNameNew.value;
        }
      }
    }
    allFeaturesConfig.value[feature] = featureCopy;
  });
  for (let i = 0; i < currentSelectedFields.value.length; i++) {
    if (currentSelectedFields.value[i] === fieldNameOld.value) {
      currentSelectedFields.value[i] = fieldNameNew.value;
    }
  }
  // Next, handle deletions
  const oldFields = oldValues[0];
  const newFields = newValues[0];
  oldFields.forEach((oldField) => {
    if (!newFields.includes(oldField)) {
      currentSelectedFields.value =
                    currentSelectedFields.value.filter(field => field !== oldField);
      for (const featureName of allFeaturesConfig.value.features) {
        const featureCopy = allFeaturesConfig.value[featureName];
        if (featureCopy.includes(oldField)) {
          allFeaturesConfig.value[featureName] = featureCopy.filter(field => field !== oldField);
        }
      }
    }
  });
  // Cleanup in case any features are now empty
  allFeaturesConfig.value.features.forEach((feature) => {
    if (allFeaturesConfig.value[feature].length === 0) {
      delete allFeaturesConfig.value[feature];
      allFeaturesConfig.value.features =
                    allFeaturesConfig.value.features.filter(item => item !== feature);
    }
  });
  emitFeatures();
});
function emitFeatures () {
  emit("featuresChanged", allFeaturesConfig.value);
}
</script>
