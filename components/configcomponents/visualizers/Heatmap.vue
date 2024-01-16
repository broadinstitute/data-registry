<template>
  <div class="row">
    <div class="col-md-2" id="leftFieldWrapper">
      <div v-if="editingFieldset === 'heatmap-plot-label'">
        <tbody class="pad-field">
          <tr>
            <td class="popup-field-label">
              Plot label:
            </td>
            <td>
              <input v-model="plotLabel" type="text" class="form-control input-default form-control-sm">
            </td>
          </tr>
        </tbody>
      </div>
      <div v-else-if="editingFieldset === 'heatmap-column'">
        <tbody>
          <tr>
            <td class="popup-field-label">
              Column field:
            </td>
            <td>
              <select v-model="columnField" class="form-control form-control-sm">
                <option value="">
                  Select a field
                </option>
                <option v-for="field in availableFields" :key="field">
                  {{ field }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              Column label:
            </td>
            <td>
              <input
                  v-model="columnLabel"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
            </td>
          </tr>
        </tbody>
      </div>
      <div v-else-if="editingFieldset === 'heatmap-row'">
        <tbody>
          <tr>
            <td class="popup-field-label">
              Row field:
            </td>
            <td>
              <select v-model="columnField" class="form-control form-control-sm">
                <option value="">
                  Select a field
                </option>
                <option v-for="field in availableFields" :key="field">
                  {{ field }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              Row label:
            </td>
            <td>
              <input
                  v-model="rowLabel"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
            </td>
          </tr>
        </tbody>
      </div>
      <div v-else-if="editingFieldset === 'heatmap-main'">
        <tbody>
          <tr>
            <td class="popup-field-label">
              Field:
            </td>
            <td>
              <select v-model="mainField" class="form-control form-control-sm">
                <option value="">
                  Select a field
                </option>
                <option v-for="field in availableFields" :key="field">
                  {{ field }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              Label:
            </td>
            <td>
              <input
                v-model="mainLabel"
                type="text"
                class="form-control input-default form-control-sm"
              >
            </td>
          </tr>
          <!-- "Render type" param - only current option is 'scale'-->
          <tr>
            <td class="popup-field-label">
              Direction:
            </td>
            <td>
              <select v-model="mainDirection" class="form-control form-control-sm">
                <option value="positive">
                  Positive (higher darker)
                </option>
                <option value="negative">
                  Negative (lower darker)
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              Low:
            </td>
            <td>
              <input v-model="mainLow" class="form-control form-control-sm" type="number">
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              Mid:
            </td>
            <td>
              <input v-model="mainMid" class="form-control form-control-sm" type="number">
            </td>
          </tr>
          <tr>
            <td class="popup-field-label">
              High:
            </td>
            <td>
              <input v-model="mainHigh" class="form-control form-control-sm" type="number">
            </td>
          </tr>
        </tbody>
      </div>
    </div>
    <div id="heatmap-gui" class="col-md-9 viz-gui">
      <button id="heatmap-column" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('heatmap-column')">
        <span class="pencil">&#9998;</span>
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Column field
      </button>
      <button id="heatmap-row" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('heatmap-row')">
        <span class="pencil">&#9998;</span>
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Row field
      </button>
      <button id="heatmap-plot-label" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('heatmap-plot-label')">
        <span class="pencil">&#9998;</span>
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Plot label
      </button>
      <button id="heatmap-main" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('heatmap-main')">
        <span class="pencil">&#9998;</span>
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Box color coding
      </button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Font size<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <input v-model="fontSize" class="form-control form-control-sm" type="number">
    </div>
  </div>
  <div class="label">
    Sub circle scaling
  </div>
  <div class="row">
    <div class="col-md-2">
      Field
    </div>
    <div class="col-md-4">
      <select v-model="subField" class="form-control form-control-sm">
        <option value="">
          None
        </option>
        <option v-for="field in availableFields" :value="field" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div v-if="subField !== ''" class="col-md-2">
      Label<sup class="required"> *</sup>
    </div>
    <div v-if="subField !== ''" class="col-md-4">
      <input
        v-model="subLabel"
        type="text"
        class="form-control input-default form-control-sm"
      >
    </div>
  </div>
  <div v-if="subField !== ''">
    <div class="row">
      <div class="col-md-2">
        Render type<sup class="required"> *</sup>
      </div>
      <div class="col-md-4">
        <select v-model="subRenderType" class="form-control form-control-sm">
          <option value="steps">
            Steps
          </option>
        </select>
      </div>
      <div class="col-md-2">
        Direction<sup class="required"> *</sup>
      </div>
      <div class="col-md-4">
        <select v-model="subDirection" class="form-control form-control-sm">
          <option value="positive">
            Positive (higher bigger)
          </option>
          <option value="negative">
            Negative (lower bigger)
          </option>
        </select>
      </div>
    </div>
    <div v-if="subRenderType == 'steps'" class="row">
      <div class="col-md-2">
        Value steps<sup class="required"> *</sup>
      </div>
      <div class="col-md-4 col">
        <table>
          <tr v-for="(_, index) in subSteps" :key="index">
            <td>
              <input
                v-model="subSteps[index]"
                class="form-control form-control-sm"
                type="number"
              >
            </td>
            <td>
              <button
                v-if="subSteps.length > 1"
                class="btn btn-secondary replace-chars-button delete-button"
                @click="subSteps.splice(index, 1)"
              >
                &times;
              </button>
            </td>
          </tr>
        </table>
        <button class="btn btn-primary add-button" @click="subSteps.push('')">
          Add
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
const store = useConfigBuilderStore();
const emit = defineEmits(["updateVisualizer"]);
const availableFields = computed(() => store.allFields);
const editingFieldset = ref("");
const plotLabel = ref("");
const columnField = ref("");
const columnLabel = ref("");
const rowField = ref("");
const rowLabel = ref("");
const fontSize = ref(12);
const mainField = ref("");
const mainLabel = ref("");
const mainRenderType = ref("scale");
const mainDirection = ref("positive");
const mainLow = ref("");
const mainMid = ref("");
const mainHigh = ref("");
const subSteps = ref([""]);
const subField = ref("");
const subLabel = ref("");
const subRenderType = ref("steps");
const subDirection = ref("positive");
const configString = computed(() => {
  const config = {
    type: "heat map",
    label: plotLabel.value,
    "column field": columnField.value,
    "column label": columnLabel.value,
    "row field": rowField.value,
    "row label": rowLabel.value,
    "font size": fontSize.value,
    main: {
      field: mainField.value,
      label: mainLabel.value,
      type: mainRenderType.value,
      direction: mainDirection.value,
      low: mainLow.value,
      middle: mainMid.value,
      high: mainHigh.value,
    }
  };
  if (subField.value !== "") {
    const sub = {
      field: subField.value,
      label: subLabel.value,
      type: subRenderType.value,
      direction: subDirection.value,
      "value range": subSteps.value
    };
    config.sub = sub;
  }

  // tracking the string rather than the object picks up changes within arrays
  return JSON.stringify(config);
});
const VALIDATORS = [
  { condition: () => plotLabel.value === "", msg: "Specify a label for the plot." },
  { condition: () => columnField.value === "" || rowField.value === "", msg: "Specify column and row fields." },
  { condition: () => columnLabel.value === "" || rowLabel.value === "", msg: "Specify column and row labels." },
  { condition: () => mainField.value === "", msg: "Specify main field." },
  { condition: () => mainLabel.value === "", msg: "Specify main label." },
  { condition: () => fontSize.value === "", msg: "Specify font size." },
  { condition: () => !(mainLow.value <= mainMid.value && mainMid.value <= mainHigh.value), msg: "Assign low, middle, and high values in order" },
  { condition: () => subField.value !== "" && subLabel.value === "", msg: "Specify a label for the sub circle" },
  {
    condition: () => subField.value !== "" &&
            (subSteps.value.length === 0 || subSteps.value.includes("")),
    msg: "Specify steps for the sub circle."
  }
];
watch(configString, () => {
  emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
});
function editFieldset(fieldsetId){
    editingFieldset.value = fieldsetId;
  }
</script>
