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
                <input v-model="configObject['label']" type="text" class="form-control input-default form-control-sm">
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
                <FieldSelect v-model="configObject['column field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Column label:
              </td>
              <td>
                <input
                    v-model="configObject['column label']"
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
                <FieldSelect v-model="configObject['row field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Row label:
              </td>
              <td>
                <input
                    v-model="configObject['row label']"
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
                <FieldSelect v-model="configObject.main['field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Label:
              </td>
              <td>
                <input
                  v-model="configObject.main['label']"
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
                <select v-model="configObject.main['direction']" class="form-control form-control-sm">
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
                <input v-model="configObject.main['low']" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Mid:
              </td>
              <td>
                <input v-model="configObject.main['middle']" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                High:
              </td>
              <td>
                <input v-model="configObject.main['high']" class="form-control form-control-sm" type="number">
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
                <FieldSelect v-model="configObject.sub['field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Label:
              </td>
              <td>
                <input
                  v-model="configObject.sub['label']"
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
                <select v-model="configObject.sub['direction']" class="form-control form-control-sm">
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
            <tr v-for="(_, index) in configObject.sub['value range']" :key="index">
              <td>
                <input
                  v-model="configObject.sub['value range'][index]"
                  class="form-control form-control-sm"
                  type="number"
                >
              </td>
              <td>
                <button
                  v-if="configObject.sub['value range'].length > 1"
                  class="btn btn-secondary replace-chars-button delete-button"
                  @click="configObject.sub['value range'].splice(index, 1)"
                >
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
          <button v-if="includeSubCircle" class="btn btn-primary add-button" 
            @click="configObject.sub['value range'].push('')">
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
                <input v-model="configObject['font size']" class="form-control form-control-sm" type="number">
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
          <img v-if="configObject.main['direction'] === 'positive'" src="assets/images/heatmap_color_scale.jpg"/>
          <img v-else src="assets/images/heatmap_color_scale_reversed.jpg"/>
          <span>max</span>
      </div>
      <div id="heatmap-sub-wrapper">
        <GuiButton :info="CHECK_DONE.HEATMAP_SUB"></GuiButton>
        <span>min</span>
        <img v-if="configObject.sub['direction'] === 'positive'" src="assets/images/heatmap_dot_sizes.jpg"/>
        <img v-else src="assets/images/heatmap_dot_sizes_reversed.jpg"/>
        <span>max</span>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  import FieldSelect from '../FieldSelect.vue';
  import GuiButton from '../GuiButton.vue';
  const store = useConfigBuilderStore();
  const props = defineProps({ 
    configToLoad: String,
    editing: Boolean,
  });
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = computed(() => store.vizEditingFieldset);
  const editingHeatmap = computed(() => props.editing);
  const CONFIG_SUB = {
      "field": "",
      "type": "steps", // only supported type at the moment
      "direction": "positive",
      "value range": [""]
  };
  const configObject = ref({
    "type": "heat map",
    // Pre-fill empty strings so that 'select field' is preselected
    "column field": "",
    "row field": "",
    "main": {
      "field": "",
      "type": "scale", // only supported type at the moment,
      "direction": "positive",
      "low": "",
      "middle": "",
      "high": ""
    },
    "sub": JSON.parse(JSON.stringify(CONFIG_SUB)) //Deep copy
  });
  const includeSubCircle = ref(true);
  const configString = computed(() => {
    // Clean up optional fields
    let outputObject = JSON.parse(JSON.stringify(configObject.value)); // Deep copy
    if (!includeSubCircle.value){
      delete outputObject["sub"];
    }
    // tracking the string rather than the object picks up changes within arrays
    return JSON.stringify(outputObject);
  });
  const CHECK_DONE = Object.freeze({
    HEATMAP_PLOT_LABEL: {
      id: "heatmap-plot-label",
      text: "Plot label",
      condition: () => !configObject.value["label"],
      msg: "Specify a label for the plot." 
    },
    HEATMAP_COLUMN: {
      id: "heatmap-column",
      text: "Column field", 
      condition: () => !configObject.value["column field"] || !configObject.value["column label"],
      msg: "Specify field and label for columns."
    },
    HEATMAP_ROW: {
      id: "heatmap-row",
      text: "Row field",
      condition: () => !configObject.value["row field"] || !configObject.value["row label"],
      msg: "Specify field and label for rows."
    },
    HEATMAP_FONT_SIZE: {
      id: "heatmap-font-size",
      text: "Font size",
      condition: () => !configObject.value["font size"], 
      msg: "Specify font size." 
    },
    HEATMAP_MAIN: {
      id: "heatmap-main",
      text: "Box color coding",
      condition: () => !configObject.value.main["field"] || !configObject.value.main["label"] ||
        configObject.value.main["low"] === '' || //can't use value truthiness because 0 is valid
        configObject.value.main["middle"] === '' ||
        configObject.value.main["high"] === '' ||
        !(configObject.value.main["low"] <= configObject.value.main["middle"] && 
          configObject.value.main["middle"] <= configObject.value.main['high']),
      msg: "Specify main field, label, and low/mid/high values in order."
    },
    HEATMAP_SUB: {
      id: "heatmap-sub",
      text: "Sub circle scaling",
      condition: () => includeSubCircle.value && 
        (!configObject.value.sub["field"] || !configObject.value.sub["label"] || 
          configObject.value.sub["value range"].length === 0 || 
          configObject.value.sub["value range"].includes("")), 
      msg: "Specify field, label, and value steps for the sub circle." 
    },
  });
  onMounted(() => {
    if (editingHeatmap.value){
      loadConfig();
    }
  });
  watch(editingHeatmap, () => {
    if (editingHeatmap.value){
      loadConfig();
    }
  });
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
  function loadConfig(){
    let loadedConfig = JSON.parse(props.configToLoad);
    includeSubCircle.value = !!loadedConfig.sub;
    if (!loadedConfig.sub){
      loadedConfig.sub = JSON.parse(JSON.stringify(CONFIG_SUB));
    }
    configObject.value = loadedConfig;
  }
</script>
