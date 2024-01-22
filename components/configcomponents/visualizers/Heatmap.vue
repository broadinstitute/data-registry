<template>
  <div class="row">
    <div id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset">
        <div v-if="editingFieldset === CHECK_DONE.HEATMAP_PLOT_LABEL.id">
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
        <div v-else-if="editingFieldset === CHECK_DONE.HEATMAP_COLUMN.id">
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
        <div v-else-if="editingFieldset === CHECK_DONE.HEATMAP_ROW.id">
          <tbody>
            <tr>
              <td class="popup-field-label">
                Row field:
              </td>
              <td>
                <select v-model="rowField" class="form-control form-control-sm">
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
        <div v-else-if="editingFieldset === CHECK_DONE.HEATMAP_MAIN.id">
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
                    Positive
                  </option>
                  <option value="negative">
                    Negative
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
        <div v-else-if="editingFieldset === CHECK_DONE.HEATMAP_SUB.id">
          <tbody>
            <tr>
              <td>Include sub circle:</td>
              <td>
                <input type="checkbox" v-model="includeSubCircle">
              </td>
            </tr>
          </tbody>
          <tbody v-if="includeSubCircle">
            <tr>
              <td class="popup-field-label">
                Field:
              </td>
              <td>
                <select v-model="subField" class="form-control form-control-sm">
                  <option value="">
                    Select field
                  </option>
                  <option v-for="field in availableFields" :value="field" :key="field">
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
                  v-model="subLabel"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
              </td>
            </tr>
            <!-- Only render type currently available is 'steps'-->
            <tr>
              <td class="popup-field-label">
                Direction:
              </td>
              <td>
                <select v-model="subDirection" class="form-control form-control-sm">
                  <option value="positive">
                    Positive
                  </option>
                  <option value="negative">
                    Negative
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="popup-field-label">
                Value steps:
              </td>
            </tr>
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
          </tbody>
          <button v-if="includeSubCircle" class="btn btn-primary add-button" @click="subSteps.push('')">
            Add
          </button>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.HEATMAP_FONT_SIZE.id">
          <tbody>
            <tr>
              <td class="popup-field-label">
                Font size:
              </td>
              <td>
                <input v-model="fontSize" class="form-control form-control-sm" type="number">
              </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    <div id="heatmap-gui" class="viz-gui">
      <GuiButton :info="CHECK_DONE.HEATMAP_COLUMN"></GuiButton>
      <GuiButton :info="CHECK_DONE.HEATMAP_ROW"></GuiButton>
      <GuiButton :info="CHECK_DONE.HEATMAP_PLOT_LABEL"></GuiButton>
      <GuiButton :info="CHECK_DONE.HEATMAP_FONT_SIZE"></GuiButton>
      <div id="heatmap-main-wrapper">
        <GuiButton :info="CHECK_DONE.HEATMAP_MAIN"></GuiButton>
          <span>min</span>
          <img v-if="mainDirection === 'positive'" src="assets/images/heatmap_color_scale.jpg"/>
          <img v-else src="assets/images/heatmap_color_scale_reversed.jpg"/>
          <span>max</span>
      </div>
      <div id="heatmap-sub-wrapper">
        <GuiButton :info="CHECK_DONE.HEATMAP_MAIN"></GuiButton>
        <span>min</span>
        <img v-if="subDirection === 'positive'" src="assets/images/heatmap_dot_sizes.jpg"/>
        <img v-else src="assets/images/heatmap_dot_sizes_reversed.jpg"/>
        <span>max</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import GuiButton from '../GuiButton.vue';
const store = useConfigBuilderStore();
const emit = defineEmits(["updateVisualizer"]);
const availableFields = computed(() => store.allFields);
const editingFieldset = computed(() => store.vizEditingFieldset);
const plotLabel = ref("");
const columnField = ref("");
const columnLabel = ref("");
const rowField = ref("");
const rowLabel = ref("");
const fontSize = ref("");
const mainField = ref("");
const mainLabel = ref("");
const mainRenderType = ref("scale");
const mainDirection = ref("positive");
const mainLow = ref("");
const mainMid = ref("");
const mainHigh = ref("");
const includeSubCircle = ref(true);
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
  if (includeSubCircle.value) {
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
const CHECK_DONE = Object.freeze({
  HEATMAP_PLOT_LABEL: {
    id: "heatmap-plot-label",
    text: "Plot label",
    condition: () => !plotLabel.value, 
    msg: "Specify a label for the plot." 
  },
  HEATMAP_COLUMN: {
    id: "heatmap-column",
    text: "Column field", 
    condition: () => !columnField.value || !columnLabel.value,
    msg: "Specify field and label for columns."
  },
  HEATMAP_ROW: {
    id: "heatmap-row",
    text: "Row field",
    condition: () => !rowField.value || !rowLabel.value,
    msg: "Specify field and label for rows."
  },
  HEATMAP_FONT_SIZE: {
    id: "heatmap-font-size",
    text: "Font size",
    condition: () => !fontSize.value, 
    msg: "Specify font size." 
  },
  HEATMAP_MAIN: {
    id: "heatmap-main",
    text: "Box color coding",
    condition: () => !mainField.value || !mainLabel.value || !(mainLow.value <= mainMid.value && mainMid.value <= mainHigh.value),
    msg: "Specify main field, label, and low/mid/high values in order."
  },
  HEATMAP_SUB: {
    id: "heatmap-sub",
    text: "Sub circle scaling",
    condition: () => includeSubCircle.value && (!subField.value || !subLabel.value || 
        subSteps.value.length === 0 || subSteps.value.includes("")), 
    msg: "Specify field, label, and value steps for the sub circle." 
  },
});
watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
</script>
