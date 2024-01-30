<template>
  <div class="row">
    <div id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset">
        <div v-if="editingFieldset === CHECK_DONE.VOLCANO_PLOT_LABEL.id">
          <tbody>
            <tr>
              <td>
                Plot label:
              </td>
              <td>
                <input
                  v-model="configObject['label']"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
              </td>
            </tr>
            <tr>
              <td>
                Width:
              </td>
              <td>
                <input v-model="configObject['width']" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Height:
              </td>
              <td>
                <input v-model="configObject['height']" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Label dots meeting:
              </td>
              <td>
                <select v-model="configObject['dot label score']" class="form-control form-control-sm">
                  <option value="">
                    Select
                  </option>
                  <option :value="1">
                    1 condition
                  </option>
                  <option :value="2">
                    2 conditions
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.VOLCANO_X.id">
          <tbody>
            <tr>
              <td>
                X-axis field:
              </td>
              <td>
                <FieldSelect v-model="configObject['x axis field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                X-axis label:
              </td>
              <td>
                <input v-model="configObject['x axis label']" 
                  type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
            <tr>
              <td>
                Condition:
              </td>
              <td>
                <select v-model="configObject['x condition']['combination']" 
                  class="form-control form-control-sm">
                  <option value="">Select condition</option>
                  <option v-for="objVal in CONDITION_OPTIONS" :key="objVal.text" :value="objVal.text">
                    {{ objVal.display }}
                  </option>
                </select>
                <!-- v-bind entries in list-->
              </td>
            </tr>
            <tr v-if="requiresGreaterThan(configObject['x condition']['combination'])">
              <td>
                Greater than:
              </td>
              <td>
                <input v-model="configObject.value['x condition']['greater than']" 
                  class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr v-if="requiresLessThan(configObject['x condition']['combination'])">
              <td>
                <span v-if="configObject['x condition']['combination'] === CONDITION_OPTIONS.AND.text">
                  AND
                </span>
                <span v-else-if="configObject['x condition']['combination'] === CONDITION_OPTIONS.OR.text">
                  OR
                </span>
                Less than:
              </td>
              <td>
                <input v-model="configObject['x condition']['lower than']" 
                  class="form-control form-control-sm" type="number">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.VOLCANO_Y.id">
          <tbody>
            <tr>
              <td>
                Y-axis field:
              </td>
              <td>
                <FieldSelect v-model="configObject['y axis field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Y-axis label:
              </td>
              <td>
                <input v-model="configObject['y axis label']"
                  type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
            <tr>
              <td>
                Condition:
              </td>
              <td>
                <select v-model="configObject['y condition']['combination']" class="form-control form-control-sm">
                  <option value="">Select condition</option>
                  <option v-for="objVal in CONDITION_OPTIONS" :key="objVal.text" :value="objVal.text">
                    {{ objVal.display }}
                  </option>
                </select>
                <!-- v-bind entries in list-->
              </td>
            </tr>
            <tr v-if="requiresGreaterThan(configObject['y condition']['combination'])">
              <td>
                Greater than:
              </td>
              <td>
                <input v-model="configObject['y condition']['greater than']" 
                  class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr v-if="requiresLessThan(configObject['y condition']['combination'])">
              <td>
                <span v-if="configObject['y condition']['combination'] === CONDITION_OPTIONS.AND.text">
                  AND
                </span>
                <span v-else-if="configObject['y condition']['combination'] === CONDITION_OPTIONS.OR.text">
                  OR
                </span>
                Less than:
              </td>
              <td>
                <input v-model="configObject['y condition']['lower than']" 
                  class="form-control form-control-sm" type="number">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.VOLCANO_RENDER_BY.id">
          <tbody>
            <tr>
              <td>
                Render by:
              </td>
              <td>
                <FieldSelect v-model="configObject['render by']"></FieldSelect>
              </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    <div id="volcano-gui" class="viz-gui">
      <GuiButton :info="CHECK_DONE.VOLCANO_X"></GuiButton>
      <GuiButton :info="CHECK_DONE.VOLCANO_Y"></GuiButton>
      <GuiButton :info="CHECK_DONE.VOLCANO_PLOT_LABEL"></GuiButton>
      <GuiButton :info=CHECK_DONE.VOLCANO_RENDER_BY></GuiButton>
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
  const editingVolcano = computed(() => props.editing);
  const configObject = ref({
    "type": "volcano plot",
    "x axis field": "",
    "y axis field": "",
    "render by": "",
    "dot label score": "",
    "x condition": {
      "combination": "",
      "greater than": "",
      "lower than": ""
    },
    "y condition": {
      "combination": "",
      "greater than": "",
      "lower than": ""
    },
    "width": "",
    "height": ""
  });
  const CONDITION_OPTIONS = Object.freeze({
    GREATER: {
      text: "greater than",
      display: "Greater than"
    },
    LESS: {
      text: "lower than",
      display: "Less than"
    },
    AND: {
      text: "and",
      display: "AND"
    },
    OR: {
      text: "or",
      display: "OR"
    }
  });
  const CHECK_DONE = Object.freeze({
    VOLCANO_PLOT_LABEL: {
      id: "volcano-plot-label",
      text: "Plot setup",
      condition: () => !configObject.value["label"] || !configObject.value["dot label score"], 
      msg: "Specify a plot label and dot labeling conditions."
    },
    VOLCANO_X: {
      id: "volcano-x",
      text: "X-axis field",
      // Empty string comparisons are necessary for number field which accepts zeroes
      condition: () => !configObject.value["x axis field"] || 
        !configObject.value["x axis label"] || 
        !configObject.value['x condition']['combination'] ||
        (requiresGreaterThan(configObject.value['x condition']['combination']) && 
          configObject.value['x condition']['greater than'] === "") ||
        (requiresLessThan(configObject.value['x condition']['combination']) && 
          configObject.value['x condition']['lower than'] === "") ||
        (configObject.value['x condition']['combination'] === "and" &&
          configObject.value['x condition']['greater than'] >= 
            configObject.value['x condition']['lower than']),
      msg: "Specify field, label, condition, and thresholds for X-axis."
    },
    VOLCANO_Y: {
      id: "volcano-y",
      text: "Y-axis field",
      // Empty string comparisons are necessary for number field which accepts zeroes
      condition: () => !configObject.value['y axis field'] || 
        !configObject.value['y axis label'] || 
        !configObject.value['y condition']['combination'] ||
        (requiresGreaterThan(configObject.value['y condition']['combination']) && 
          configObject.value['y condition']['greater than'] === "") ||
        (requiresLessThan(configObject.value['y condition']['combination']) && 
          configObject.value['y condition']['lower than'] === "") ||
        (configObject.value['y condition']['combination'] === "and" && 
          configObject.value['y condition']['greater than'] >= 
            configObject.value['y condition']['lower than']),
      msg: "Specify field, label, and condition for Y-axis."
    },
    VOLCANO_RENDER_BY: {
      id: "volcano-render-by",
      text: "Render by",
      condition: () => !configObject.value['render by'], 
      msg: "Specify field to render by."  
    },

  });
  const configString = computed(() => {
    let outputObject = JSON.parse(JSON.stringify(configObject.value)); // Deep copy
    if (!requiresGreaterThan(outputObject["x condition"]["combination"])) {
      delete outputObject["x condition"]["greater than"];
    }
    if (!requiresLessThan(outputObject["x condition"]["combination"])) {
      delete outputObject["x condition"]["lower than"];
    }
    if (!requiresGreaterThan(outputObject["y condition"]["combination"])) {
      delete outputObject["y condition"]["greater than"];
    }
    if (!requiresLessThan(outputObject["y condition"]["combination"])) {
      delete outputObject["y condition"]["lower than"];
    }
    if (!outputObject["width"]) {
      delete outputObject["width"];
    }
    if (!outputObject["height"]) {
      delete outputObject["height"];
    }
    return JSON.stringify(outputObject);
  });
  onMounted(() => {
    if (editingVolcano.value){
      loadConfig();
    }
  });
  watch(editingVolcano, () => {
    if (editingVolcano.value){
      loadConfig();
    }
  });
  function requiresGreaterThan(conditionString){
    let greaterThans = ["greater than", "and", "or"];
    return greaterThans.includes(conditionString);
  }
  function requiresLessThan(conditionString){
    let lessThans = ["lower than", "and", "or"];
    return lessThans.includes(conditionString);
  }
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
  function loadConfig(){
    let loadedConfig = JSON.parse(props.configToLoad);
    if (!Object.keys(loadedConfig["x condition"]).includes("greater than")){
      // Zero is a falsy value but valid input
      loadedConfig["x condition"]["greater than"] = "";
    }
    if (!Object.keys(loadedConfig["x condition"]).includes("lower than")){
      loadedConfig["x condition"]["lower than"] = "";
    }
    if (!Object.keys(loadedConfig["y condition"]).includes("greater than")){
      loadedConfig["y condition"]["greater than"] = "";
    }
    if (!Object.keys(loadedConfig["y condition"]).includes("lower than")){
      loadedConfig["y condition"]["lower than"] = "";
    }
    if (!loadedConfig["width"]){
      loadedConfig["width"] = "";
    }
    if (!loadedConfig["height"]){
      loadedConfig["height"] = "";
    }
    configObject.value = loadedConfig;
  }
</script>
