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
          </tbody>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
  </div>
  <div class="row">
    <div class="col-md-2">
      Height
    </div>
    <div class="col-md-4">
      <input v-model="height" class="form-control input-default form-control-sm" type="number">
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Hover content
    </div>
    <table id="hover" class="col-md-10">
      <tr>
        <th>
          <input
            v-model="selectAllBox"
            class="form-check-input"
            type="checkbox"
            @change="hoverContent = !selectAllBox ? [] : availableFields"
          >
          <label class="label form-check-label">Select fields</label>
        </th>
      </tr>
      <tr v-for="field in availableFields" :key="field">
        <td>
          <input v-model="hoverContent" class="form-check-input" type="checkbox" :value="field">
          <label class="form-check-label">{{ field }}</label>
        </td>
      </tr>
    </table>
  </div>
  <div class="label">
    Set region
  </div>
  <div class="row">
    <div class="col-md-2">
      Input type<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="inputType" class="form-control form-control-sm">
        <option value="from data">
          From data
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Chromosome field<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="chrField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
  <div v-if="inputType == 'from data'" class="row">
    <div class="col-md-2">
      Position field<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="posField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
  <div class="label">
    LD server
  </div>
  <div class="row">
    <div class="col-md-2">
      Reference allele<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="refField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Alternative allele<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="altField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Reference variant field<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="refVarField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Populations field
    </div>
    <div class="col-md-4">
      <select v-model="popField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Fixed population<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="fixedPop" class="form-control form-control-sm">
        <option value="">
          Select a population
        </option>
        <option v-for="item in popOptions" :key="item">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Include genes track
    </div>
    <div class="col-md-2">
      <input v-model="showGenesTrack" type="checkbox">
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
import FieldSelect from '../FieldSelect.vue';
const store = useConfigBuilderStore();
const runtimeConfig = useRuntimeConfig();
const axios = useAxios(runtimeConfig, undefined, (error) => {
  console.log(error);
  throw new Error("Server Error");
});
const emit = defineEmits(["updateVisualizer"]);
const availableFields = computed(() => store.allFields);
const editingFieldset = computed(() => store.vizEditingFieldset);
const selectAllBox = ref(false);
const xAxisField = ref("");
const xAxisLabel = ref("");
const yAxisField = ref("");
const yAxisLabel = ref("");
const renderBy = ref("");
const inputType = ref("from data");
const hoverContent = ref([]);
const height = ref(200);
const starKey = ref("");
const chrField = ref("");
const posField = ref("");
const refField = ref("");
const altField = ref("");
const refVarField = ref("");
const popField = ref("");
const showGenesTrack = ref(true);
const fixedPop = ref("");
const popOptions = ref([]);
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

});
const VALIDATORS = [
  { condition: () => inputType.value === "from data" && chrField.value === "", msg: "Specify chromosome field." },
  {
    condition: () => posField.value === "" || refField.value === "" ||
            altField.value === "" || refVarField.value === "",
    msg: "Specify position, ref, alt, and reference variant fields."
  },
  { condition: () => popField.value === "", msg: "Specify population field." },
  // { condition: fixedPop.value === "", msg: "Specify fixed population."}
];
const configString = computed(() => {
  // Dynamic population has been removed as an option for now - we're working on it.
  const config = {
    type: "region plot",
    "x axis field": xAxisField.value,
    "x axis label": xAxisLabel.value.trim(),
    "y axis field": yAxisField.value,
    "y axis label": yAxisLabel.value.trim(),
    "render by": renderBy.value,
    "star key": starKey.value,
    "ld server": {
      pos: posField.value,
      ref: refField.value,
      alt: altField.value,
      "ref variant field": refVarField.value,
      "populations field": popField.value,
      "populations type": "fixed",
      populations: {
        ALL: "ALL"
      }
    }
  };
  if (height.value !== "") {
    config.height = height.value;
  }
  if (hoverContent.value.length !== 0) {
    config["hover content"] = hoverContent.value;
  }
  if (inputType.value === "from data") {
    config["region fields"] = {
      chromosome: chrField.value,
      position: posField.value
    };
  }
  if (showGenesTrack.value) {
    const genesTrack = {
      "input type": inputType.value
    };
    if (inputType.value === "dynamic") {
      genesTrack["dynamic parameter"] = "region";
    }
    // From data is the only option we're using currently
    if (inputType.value === "from data") {
      genesTrack["region fields"] = config["region fields"];
    }
    config["genes track"] = genesTrack;
  }
  return JSON.stringify(config);
});
onMounted(async () => {
  await loadPopulationOptions();
});
watch(configString, () => {
  emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
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
</script>
