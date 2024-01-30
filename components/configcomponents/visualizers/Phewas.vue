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
                <FieldSelect v-model="configObject['y axis field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Y-axis label:
              </td>
              <td>
                <input
                  v-model="configObject['y axis label']"
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
                  v-model="configObject['y ticks decimal point']"
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
                <FieldSelect v-model="configObject['group by']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Star key:
              </td>
              <td>
                <FieldSelect v-model="configObject['star key']" :noneOption="true"></FieldSelect>
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
                <FieldSelect v-model="configObject['render by']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Beta field:
              </td>
              <td>
                <FieldSelect v-model="configObject['beta field']" :noneOption="true"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Hover content:
              </td>
            </tr>
            <FieldCheckboxes v-model="configObject['hover content']"></FieldCheckboxes>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.PHEWAS_SETUP.id">
          <tbody>
            <tr>
              <td>
                Height:
              </td>
              <td>
                <input v-model="configObject['height']" class="form-control input-default form-control-sm" type="number">
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
                <input v-model="configObject['plot margin']['top']" 
                  class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Bottom
              </td>
              <td>
                <input v-model="configObject['plot margin']['bottom']" 
                  class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Left
              </td>
              <td>
                <input v-model="configObject['plot margin']['left']"
                  class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td class="small-label">
                Right
              </td>
              <td>
                <input v-model="configObject['plot margin']['right']"
                  class="form-control input-default form-control-sm" type="number">
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
            <tr v-for="(_, index) in configObject.thresholds" :key="index">
              <td>
                <input
                  v-model="configObject.thresholds[index]"
                  class="form-control form-control-sm"
                  type="number"
                >
              </td>
              <td>
                <button class="btn btn-secondary replace-chars-button delete-button"
                  @click="configObject.thresholds.splice(index, 1)"
                >
                  &times;
                </button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                <button class="btn btn-primary add-button" @click="configObject.thresholds.push('')">
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
  import FieldCheckboxes from '../FieldCheckboxes.vue';
  import FieldSelect from '../FieldSelect.vue';
  import GuiButton from '../GuiButton.vue';
  const store = useConfigBuilderStore();
  const props = defineProps({ 
      configToLoad: String,
      editing: Boolean,
    });
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = computed(() => store.vizEditingFieldset);
  const editingPhewas = computed(() => props.editing);
  const configObject = ref({
    "type": "phewas plot",
    "y axis field": "",
    "y ticks decimal point": "",
    "phenotype map": "kp phenotype map", // only supported value right now?
    "render by": "",
    "group by": "",
    "hover content": [],
    "star key": "",
    "beta field": "",
    "thresholds": [""],
    "plot margin": {}
  });
  const convertLog = ref(false);
  const CHECK_DONE = Object.freeze({
    PHEWAS_Y: {
      id: "phewas-y",
      text: "Y-axis field",
      condition: () => !configObject.value['y axis field'] || 
        !configObject.value["y axis label"] || 
        configObject.value["y ticks decimal point"] === "" || 
        configObject.value["y ticks decimal point"] < 0, 
      msg: "Specify field, label, and decimal places for Y-axis."
    },
    PHEWAS_RENDER: {
      id: "phewas-render",
      text: "Render by",
      condition: () => !configObject.value['render by'], 
      msg: "Specify field to render by." 
    },
    PHEWAS_GROUP: {
      id: "phewas-group",
      text: "Group by",
      condition: () => !configObject.value['group by'], 
      msg: "Specify field to group by."
    },
    PHEWAS_SETUP: {
      id: "phewas-setup",
      text: "Plot setup",
      condition: () => !configObject.value['height'],
      msg: "Specify plot height."
      
    },
    PHEWAS_THRESHOLDS: {
      id: "phewas-thresholds",
      text: "Thresholds",
      condition: () => configObject.value["thresholds"].includes(null) || 
        configObject.value["thresholds"].includes(""),
      msg: "Fill in missing threshold values."
    }
  });
  const configString = computed(() => {
    let outputObject = JSON.parse(JSON.stringify(configObject.value)); // Deep copy
    outputObject['convert y -log10'] = `${convertLog.value}`;

    // Avoid empty values for optional fields
    if (outputObject["hover content"].length === 0){
      delete outputObject["hover content"];
    }
    if (!outputObject["beta field"]){
      delete outputObject["beta field"];
    }
    if (!outputObject['star key']){
      delete outputObject['star key'];
    }
    if (outputObject["thresholds"].length === 0){
      delete outputObject["thresholds"];
    }
    if (Object.keys(outputObject["plot margin"]).length === 0) {
      delete outputObject["plot margin"];
    }
    return JSON.stringify(outputObject);
  });
  onMounted(() => {
    if (editingPhewas.value){
      loadConfig();
    }
  });
  watch(editingPhewas, () => {
    if (editingPhewas.value){
      loadConfig();
    }
  });
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
  function loadConfig(){
    let loadedConfig = JSON.parse(props.configToLoad);
    convertLog.value = loadedConfig["convert y -log10"] === 'true';
    if (!loadedConfig['hover content']){
      loadedConfig['hover content'] = [];
    }
    if (!loadedConfig["beta field"]){
      loadedConfig["beta field"] = "";
    }
    if (!loadedConfig["star key"]){
      loadedConfig["star key"] = ""; 
    }
    if (!loadedConfig["thresholds"]){
      loadedConfig["thresholds"] = [""];
    }
    if (!loadedConfig["plot margin"]){
      loadedConfig["plot margin"] = {};
    }
    configObject.value = loadedConfig;
  }
</script>
