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
                <FieldSelect v-model="xAxisField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                X-axis label:
              </td>
              <td>
                <input v-model="xAxisLabel" type="text" class="form-control input-default form-control-sm">
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
                <FieldSelect v-model="yAxisField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Y-axis label:
              </td>
              <td>
                <input v-model="yAxisLabel" type="text" class="form-control input-default form-control-sm">
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
                <FieldSelect v-model="renderBy"></FieldSelect>
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
            <tr>
              <td colspan="2">Hover content</td>
            </tr>
            <FieldCheckboxes v-model="hoverContent"></FieldCheckboxes>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.REGION_REGION.id">
          <tbody>
            <tr>
              <td>
                Chromosome field:
              </td>
              <td>
                <FieldSelect v-model="chrField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Position field:
              </td>
              <td>
                <FieldSelect v-model="posField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Plot height:
              </td>
              <td>
                <input v-model="height" class="form-control input-default form-control-sm" type="number">
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
                <FieldSelect v-model="refField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Alternative allele:
              </td>
              <td>
                <FieldSelect v-model="altField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Reference variant:
              </td>
              <td>
                <FieldSelect v-model="refVarField"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td>
                Population type:
              </td>
              <td>
                <select v-model="popTypeFixed" class="form-control form-control-sm">
                  <option :value="true">
                    Fixed
                  </option>
                  <option :value="false">
                    Dynamic
                  </option>
                </select>
              </td>
            </tr>
            <tr v-if="!popTypeFixed">
              <td>
                Populations field:
              </td>
              <td>
                <FieldSelect v-model="popField"></FieldSelect>
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
            <tr v-if="popTypeFixed && fixedPop">
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
  const xAxisField = ref("");
  const xAxisLabel = ref("");
  const yAxisField = ref("");
  const yAxisLabel = ref("");
  const renderBy = ref("");
  const hoverContent = ref([]);
  const height = ref(200);
  const starKey = ref("");
  const chrField = ref("");
  const posField = ref("");
  const refField = ref("");
  const altField = ref("");
  const refVarField = ref("");
  const popTypeFixed = ref(true);
  const popField = ref("");
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
      condition: () => !xAxisField.value || !xAxisLabel.value,
      msg: "Specify field and label for X-axis."
    },
    REGION_Y: {
      id: "region-y",
      text: "Y-axis field",
      condition: () => !yAxisField.value || !yAxisLabel.value,
      msg: "Specify field and label for Y-axis."
    },
    REGION_RENDER: {
      id: "region-render",
      text: "Render by",
      condition: () => !renderBy.value,
      msg: "Specify field to render by."
    },
    REGION_REGION: {
      id: "region-region",
      text: "Region",
      condition: () => !chrField.value || !posField.value, 
      msg: "Specify chromosome field and position field.",
    },
    REGION_LD: {
      id: "region-ld",
      text: "LD server",
      condition: () => !refField.value || !altField.value || !refVarField.value || 
        (!popTypeFixed.value && !popField.value) ||
        (popTypeFixed.value && 
          (!fixedPop.value || !populations.value[fixedPop.value])),
      msg: "Specify fields for ref, alt, and ref var as well as population details."
    }
  });
  const configString = computed(() => {
    // Dynamic population has been removed as an option for now - we're working on it.
    const config = {
      type: "region plot",
      "x axis field": xAxisField.value,
      "x axis label": xAxisLabel.value.trim(),
      "y axis field": yAxisField.value,
      "y axis label": yAxisLabel.value.trim(),
      "render by": renderBy.value,
      "input type": "from data", // Dynamic and static not supported yet
      "region fields": {
        "chromosome": chrField.value,
        "position": posField.value
      },
      "ld server": {
        "pos": posField.value,
        "ref": refField.value,
        "alt": altField.value,
        "ref variant field": refVarField.value,
        "populations type": popTypeFixed.value ? "fixed" : "dynamic",
      }
    };
    if (starKey.value){
      config["star key"] = starKey.value;
    }
    if (popTypeFixed.value){
      config["ld server"]["fixed population"] = fixedPop.value;
      config["ld server"]["populations"] = populations.value;
    } else {
      config["ld server"]["populations field"] = popField.value;
    }
    if (height.value !== "") {
      config.height = height.value;
    }
    if (hoverContent.value.length !== 0) {
      config["hover content"] = hoverContent.value;
    }
    if (showGenesTrack.value) {
      const genesTrack = {
        "input type": "from data", // From data is the only option we're using currently
        "region fields": config["region fields"]
      };
      config["genes track"] = genesTrack;
    }
    return JSON.stringify(config);
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
    xAxisField.value = loadedConfig["x axis field"];
    xAxisLabel.value = loadedConfig["x axis label"];
    yAxisField.value = loadedConfig["y axis field"];
    yAxisLabel.value = loadedConfig["y axis label"];
    renderBy.value = loadedConfig["render by"];
    posField.value = loadedConfig["ld server"]["pos"];
    refField.value = loadedConfig["ld server"]["ref"];
    altField.value = loadedConfig["ld server"]["alt"];
    refVarField.value = loadedConfig["ld server"]["ref variant field"];
    popTypeFixed.value = loadedConfig["ld server"]["populations type"] === "fixed";
    chrField.value = loadedConfig["region fields"]["chromosome"];
    posField.value = loadedConfig["region fields"]["position"];
    if (loadedConfig["star key"]){
      starKey.value = loadedConfig["star key"];
    }
    if (popTypeFixed.value){
      fixedPop.value = loadedConfig["ld server"]["fixed population"];
      populations.value = loadedConfig["ld server"]["populations"];
    } else {
      popField.value = loadedConfig["ld server"]["populations field"];
    }
    if (loadedConfig["height"]){
      height.value = loadedConfig["height"];
    }
    if (loadedConfig["hover content"]){
      hoverContent.value = loadedConfig["hover content"];
    }
    if (loadedConfig["genes track"]){
      showGenesTrack.value = true;
    }
  }
</script>
