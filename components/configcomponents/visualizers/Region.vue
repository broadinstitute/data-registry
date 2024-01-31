<template>
  <div class="row">
    <div id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset">
        <div v-if="editingFieldset === CHECK_DONE.REGION_X.id">
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
                <input v-model="configObject['x axis label']" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.REGION_Y.id">
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
                <input v-model="configObject['y axis label']" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.REGION_RENDER.id">
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
                Star key:
              </td>
              <td>
                <FieldSelect v-model="configObject['star key']" :noneOption="true"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td colspan="2">Hover content</td>
            </tr>
            <FieldCheckboxes v-model="configObject['hover content']"></FieldCheckboxes>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.REGION_REGION.id">
          <tbody>
            <tr>
              <td>
                Chromosome field:
              </td>
              <td>
                <FieldSelect v-model="configObject['region fields']['chromosome']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Position field:
              </td>
              <td>
                <FieldSelect v-model="configObject['region fields']['position']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Plot height:
              </td>
              <td>
                <input v-model="configObject['height']" class="form-control input-default form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Include genes track:
              </td>
              <td>
                <input v-model="showGenesTrack" type="checkbox">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.REGION_LD.id">
          <tbody>
            <tr>
              <td>
                Reference allele:
              </td>
              <td>
                <FieldSelect v-model="configObject['ld server']['ref']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Alternative allele:
              </td>
              <td>
                <FieldSelect v-model="configObject['ld server']['alt']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Reference variant:
              </td>
              <td>
                <FieldSelect v-model="configObject['ld server']['ref variant field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Population type:
              </td>
              <td>
                <select v-model="configObject['ld server']['populations type']" class="form-control form-control-sm">
                  <option value="fixed">
                    Fixed
                  </option>
                  <option value="dynamic">
                    Dynamic
                  </option>
                </select>
              </td>
            </tr>
            <tr v-if="configObject['ld server']['populations type'] === 'dynamic'">
              <td>
                Populations field:
              </td>
              <td>
                <FieldSelect v-model="configObject['ld server']['populations field']"></FieldSelect>
              </td>
            </tr>
            <tr v-else>
              <td>
                Fixed population:
              </td>
              <td>
                <select v-model="fixedPop" class="form-control form-control-sm">
                  <option value="">
                    Select a population
                  </option>
                  <option v-for="item in popOptions" :key="item">
                    {{ item }}
                  </option>
                </select>
              </td>
            </tr>
            <tr v-if="configObject['ld server']['populations type'] === 'fixed' && fixedPop">
              <td>
                {{ fixedPop }}:
              </td>
              <td>
                <input v-model="populations[fixedPop]" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    <div id="region-gui" class="viz-gui">
      <GuiButton :info="CHECK_DONE.REGION_Y"></GuiButton>
      <GuiButton :info="CHECK_DONE.REGION_X"></GuiButton>
      <GuiButton :info="CHECK_DONE.REGION_REGION"></GuiButton>
      <GuiButton :info="CHECK_DONE.REGION_RENDER"></GuiButton>
      <GuiButton :info="CHECK_DONE.REGION_LD"></GuiButton>
      <img v-if="showGenesTrack" src="assets/images/gene_only.jpg" id="region-genes" />
    </div>
  </div>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  import FieldCheckboxes from '../FieldCheckboxes.vue';
  import FieldSelect from '../FieldSelect.vue';
  import GuiButton from '../GuiButton.vue';
  const store = useConfigBuilderStore();
  const runtimeConfig = useRuntimeConfig();
  const axios = useAxios(runtimeConfig, undefined, (error) => {
    console.log(error);
    throw new Error("Server Error");
  });
  const props = defineProps({ 
      configToLoad: String,
      editing: Boolean,
    });
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = computed(() => store.vizEditingFieldset);
  const editingRegion = computed(() => props.editing);
  const configObject = ref({
    "type": "region plot",
    "x axis field": "",
    "y axis field": "",
    "render by": "",
    "input type": "from data", // Dynamic and static not supported yet,
    "hover content": [],
    "height": "",
    "region fields": {
        "chromosome": "",
        "position": ""
      },
    "ld server": {
      "pos": "",
      "ref": "",
      "alt": "",
      "ref variant field": "",
      "populations type": "fixed",
      "populations field": ""
    },
    "star key": ""
  });
  const showGenesTrack = ref(true);
  const fixedPop = ref("");
  const popOptions = ref([]);
  const populations = ref({});
  const POPULATIONS_URL = "https://portaldev.sph.umich.edu/ld/genome_builds/GRCh37/references/1000G/populations";
  // TODO SUPPLY ALL THESE VALIDATORS!!!
  const CHECK_DONE = Object.freeze({
    REGION_X: {
      id: "region-x",
      text: "X-axis field",
      condition: () => !configObject.value["x axis field"] || !configObject.value['x axis label'],
      msg: "Specify field and label for X-axis."
    },
    REGION_Y: {
      id: "region-y",
      text: "Y-axis field",
      condition: () => !configObject.value["y axis field"] || !configObject.value['y axis label'],
      msg: "Specify field and label for Y-axis."
    },
    REGION_RENDER: {
      id: "region-render",
      text: "Render by",
      condition: () => !configObject.value["render by"],
      msg: "Specify field to render by."
    },
    REGION_REGION: {
      id: "region-region",
      text: "Region",
      condition: () => !configObject.value["region fields"]["chromosome"] || 
        !configObject.value["region fields"]["position"], 
      msg: "Specify chromosome field and position field.",
    },
    REGION_LD: {
      id: "region-ld",
      text: "LD server",
      condition: () => !configObject.value["ld server"]["ref"] || 
        !configObject.value["ld server"]["alt"] || 
        !configObject.value["ld server"]["ref variant field"] || 
        (configObject.value["ld server"]["populations type"] !== "fixed" && 
          !configObject.value["ld server"]["populations field"]) ||
        (configObject.value["ld server"]["populations type"] === "fixed" && 
          (!fixedPop.value || !populations.value[fixedPop.value])),
      msg: "Specify fields for ref, alt, and ref var as well as population details."
    }
  });
  const configString = computed(() => {
    // Dynamic population has been removed as an option for now - we're working on it.
    let outputObject = JSON.parse(JSON.stringify(configObject.value)); // Deep copy
    if (!outputObject["height"]){
      delete outputObject["height"];
    }
    if (!outputObject["star key"]){
      delete outputObject["star key"];
    }
    if (outputObject["hover content"].length === 0){
      delete outputObject["hover content"];
    }
    outputObject["ld server"]["pos"] = outputObject["region fields"]["pos"];
    if (outputObject["populations type"] === "fixed"){
      delete outputObject["ld server"]["populations field"];
    } else {
      delete outputObject["ld server"]["fixed population"];
      delete outputObject["ld server"]["populations"];
    }
    if (showGenesTrack.value) {
      outputObject["genes track"] = {
        "input type": "from data", // From data is the only option we're using currently
        "region fields": outputObject["region fields"]
      };
    }
    return JSON.stringify(outputObject);
  });
  onMounted(async () => {
    if (editingRegion.value){
        loadConfig();
      }
    await loadPopulationOptions();
  });
  watch(editingRegion, () => {
    if (editingRegion.value){
      loadConfig();
    }
  });
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
  async function loadPopulationOptions () {
    const populations = (await axios.get(POPULATIONS_URL)).data;
    const popListStart = [];
    if (populations.data.includes("ALL")) {
      popListStart.push("ALL");
      fixedPop.value = "ALL";
    }
    popOptions.value = popListStart.concat(populations.data.filter(item => item !== "ALL"));
  }
  function loadConfig(){
    let loadedConfig = JSON.parse(props.configToLoad);
    if (!loadedConfig["hover content"]){
      loadedConfig["hover content"] = [];
    }
    if (!loadedConfig["height"]){
      loadedConfig["height"] = "";
    }
    if (!loadedConfig["star key"]){
      loadedConfig["star key"] = "";
    }
    if (!loadedConfig["ld server"]["fixed population"]){
      loadedConfig["ld server"]["fixed population"] = "";
    }
    if (!loadedConfig["ld server"]["populations"]){
      loadedConfig["ld server"]["populations"] = {};
    }
    if (!loadedConfig["ld server"]["populations field"]){
      loadedConfig["ld server"]["populations field"];
    }
    showGenesTrack.value = !!loadedConfig["genes track"];
  }
</script>
