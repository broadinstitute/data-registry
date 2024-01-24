<template>
  <div class="row">
    <div id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset">
        <div v-if="editingFieldset === CHECK_DONE.PHEWAS_Y.id">
          <tbody>
            <tr>
              <td>
                Y-axis field:
              </td>
              <td>
                <FieldSelect v-model="yAxisField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Y-axis label:
              </td>
              <td>
                <input
                  v-model="yLabel"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
              </td>
            </tr>
            <tr>
              <td>
                Decimal places:
              </td>
              <td>
                <input
                  v-model="yDecimal"
                  type="number"
                  class="form-control input-default form-control-sm"
                >
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Convert values to -log10
                <input
                  id="flexCheckDefault"
                  v-model="convertLog"
                  class="form-check-input"
                  type="checkbox"
                  :value="false"
                >
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.PHEWAS_GROUP.id">
          <tbody>
            <tr>
              <td>
                Group by:
              </td>
              <td>
                <FieldSelect v-model="groupBy"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Star key:
              </td>
              <td>
                <FieldSelect v-model="starKey" :noneOption="true"></FieldSelect>
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.PHEWAS_RENDER.id">
          <tbody>
            <tr>
              <td>
                Render by:
              </td>
              <td>
                <FieldSelect v-model="renderBy"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Beta field:
              </td>
              <td>
                <FieldSelect v-model="betaField" :noneOption="true"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Hover content:
              </td>
            </tr>
            <tr class="compact">
              <td class="popup-field-label small-label">
                Select all fields
              </td>
              <td>
                <input
                v-model="selectAllBox"
                class="form-check-input"
                type="checkbox"
                @change="hoverContent = !selectAllBox ? [] : availableFields"
                >
              </td>
            </tr>
            <tr v-for="field in availableFields" :key="field" class="compact">
              <td class="popup-field-label small-label">
                {{ field }}
              </td>
              <td>
                <input id="flexCheckDefault" v-model="hoverContent" class="form-check-input" type="checkbox" :value="field">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.PHEWAS_SETUP.id">
          <tbody>
            <tr>
              <td>
                Height:
              </td>
              <td>
                <input v-model="height" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Margins:
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Top
              </td>
              <td>
                <input v-model="margin['top']" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Bottom
              </td>
              <td>
                <input v-model="margin['bottom']" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Left
              </td>
              <td>
                <input v-model="margin['left']" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Right
              </td>
              <td>
                <input v-model="margin['right']" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.PHEWAS_THRESHOLDS.id">
          <tr>
              <td>
                Thresholds:
              </td>
            </tr>
            <tr v-for="(_, index) in thresholds" :key="index">
              <td>
                <input
                  v-model="thresholds[index]"
                  class="form-control form-control-sm"
                  type="number"
                >
              </td>
              <td>
                <button v-if="thresholds.length > 1"
                  class="btn btn-secondary replace-chars-button delete-button"
                  @click="thresholds.splice(index, 1)"
                >
                  &times;
                </button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <button class="btn btn-primary add-button" @click="thresholds.push('')">
                  Add
                </button>
              </td>
            </tr>
        </div>
      </div>
    </div>
    <div id="phewas-gui" class="viz-gui">
      <GuiButton :info="CHECK_DONE.PHEWAS_Y"></GuiButton>
      <GuiButton :info="CHECK_DONE.PHEWAS_GROUP"></GuiButton>
      <GuiButton :info="CHECK_DONE.PHEWAS_RENDER"></GuiButton>
      <GuiButton :info="CHECK_DONE.PHEWAS_SETUP"></GuiButton>
      <GuiButton :info="CHECK_DONE.PHEWAS_THRESHOLDS"></GuiButton>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import FieldSelect from '../FieldSelect.vue';
import GuiButton from '../GuiButton.vue';
const store = useConfigBuilderStore();
const emit = defineEmits(["updateVisualizer"]);
const availableFields = computed(() => store.allFields);
const editingFieldset = computed(() => store.vizEditingFieldset);
const selectAllBox = ref(false);
const yAxisField = ref("");
const convertLog = ref(false);
const yDecimal = ref(2);
const yLabel = ref("");
const groupBy = ref("");
const renderBy = ref("");
const hoverContent = ref([]);
const betaField = ref("");
const starKey = ref("");
const height = ref("");
const thresholds = ref([""]);
const margin = ref({});
const plotSetupUnedited = ref(true); // Just want to make it turn green without an evaluator condition
const CHECK_DONE = Object.freeze({
  PHEWAS_Y: {
    id: "phewas-y",
    text: "Y-axis field",
    condition: () => !yAxisField.value || !yLabel.value || yDecimal.value === "" || yDecimal.value < 0, 
    msg: "Specify field, label, and decimal places for Y-axis."
  },
  PHEWAS_RENDER: {
    id: "phewas-render",
    text: "Render by",
    condition: () => !renderBy.value, 
    msg: "Specify field to render by." 
  },
  PHEWAS_GROUP: {
    id: "phewas-group",
    text: "Group by",
    condition: () => !groupBy.value, 
    msg: "Specify field to group by."
  },
  PHEWAS_SETUP: {
    id: "phewas-setup",
    text: "Plot setup",
    condition: () => plotSetupUnedited.value,
    msg: "Placeholder"
    
  },
  PHEWAS_THRESHOLDS: {
    id: "phewas-thresholds",
    text: "Thresholds",
    condition: () => thresholds.value.includes(null) || thresholds.value.includes(""),
    msg: "Fill in missing threshold values."
  }
});
const configString = computed(() => {
  const config = {
    type: "phewas plot",
    "y axis field": yAxisField.value,
    "y axis label": yLabel.value,
    "y ticks decimal point": parseInt(yDecimal.value),
    "render by": renderBy.value,
    "group by": groupBy.value,
    "convert y -log10": `${convertLog.value}`
  };
  // Phenotype map can only be added administratively.
  if (height.value !== "") {
    config.height = height.value;
  }
  if (betaField.value !== "") {
    config["beta field"] = betaField.value;
  }
  if (starKey.value !== "") {
    config["star key"] = starKey.value;
  }
  if (thresholds.value.length > 0) {
    config.thresholds = thresholds.value;
  }
  if (hoverContent.value.length > 0) {
    config["hover content"] = hoverContent.value;
  }
  if (Object.keys(margin.value).length > 0) {
    config["plot margin"] = margin.value;
  }
  return JSON.stringify(config);
});
watch(configString, () => {
  emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
});
watch(editingFieldset, (_, oldVal) => {
  if (oldVal === CHECK_DONE.PHEWAS_SETUP.id){
    plotSetupUnedited.value = false;
  }
});
</script>
