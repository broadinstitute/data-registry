<template>
  <div class="row">
    <div class="col-md-2">
      Y axis field <sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="yAxisField" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Y axis label <sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <input
        v-model="yLabel"
        type="text"
        class="form-control input-default form-control-sm"
      >
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Decimal places<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <input
        v-model="yDecimal"
        type="number"
        class="form-control input-default form-control-sm"
      >
    </div>
    <div class="col-md-6">
      <div class="form-check form-check-inline">
        <label class="form-check-label" for="flexCheckDefault">
          Convert Y axis value to -log10
        </label>
        <input
          id="flexCheckDefault"
          v-model="convertLog"
          class="form-check-input"
          type="checkbox"
          :value="false"
        >
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Render by<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="renderBy" class="form-control form-control-sm">
        <option value="">
          Select a field
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Group by<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="groupBy" class="form-control form-control-sm">
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
      Beta field
      <small>(direction)</small>
    </div>
    <div class="col-md-4">
      <select v-model="betaField" class="form-control form-control-sm">
        <option value="">
          None
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
    <div class="col-md-2">
      Star key
    </div>
    <div class="col-md-4">
      <select v-model="starKey" class="form-control form-control-sm">
        <option value="">
          None
        </option>
        <option v-for="field in availableFields" :key="field">
          {{ field }}
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Thresholds
    </div>
    <div class="col-md-4 col">
      <table>
        <tr v-for="(_, index) in thresholds" :key="index">
          <td>
            <input
              v-model="thresholds[index]"
              class="form-control form-control-sm"
              type="number"
            >
          </td>
          <td>
            <button
              class="btn btn-secondary replace-chars-button delete-button"
              @click="thresholds.splice(index, 1)"
            >
              &times;
            </button>
          </td>
        </tr>
      </table>
      <button class="btn btn-primary add-button" @click="thresholds.push('')">
        Add
      </button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Plot margins
    </div>
    <div class="col-md-4">
      <tr>
        <td>Top</td>
        <td>
          <input v-model="margin['top']" class="form-control input-default form-control-sm" type="number">
        </td>
      </tr>
      <tr>
        <td>Bottom</td>
        <td>
          <input v-model="margin['bottom']" class="form-control input-default form-control-sm" type="number">
        </td>
      </tr>
      <tr>
        <td>Left</td>
        <td>
          <input v-model="margin['left']" class="form-control input-default form-control-sm" type="number">
        </td>
      </tr>
      <tr>
        <td>Right</td>
        <td>
          <input v-model="margin['right']" class="form-control input-default form-control-sm" type="number">
        </td>
      </tr>
    </div>
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
          <input id="flexCheckDefault" v-model="hoverContent" class="form-check-input" type="checkbox" :value="field">
          <label class="form-check-label" for="flexCheckDefault">{{ field }}</label>
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
const store = useConfigBuilderStore();
const emit = defineEmits(["updateVisualizer"]);
const availableFields = computed(() => store.allFields);
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
const thresholds = ref([]);
const margin = ref({});
const VALIDATORS = [
  { condition: () => yAxisField.value === "", msg: "Specify Y axis field" },
  { condition: () => yLabel.value === "", msg: "Specify Y axis label" },
  { condition: () => yDecimal.value === "" || yDecimal.value < 0, msg: "Specify decimal places" },
  { condition: () => renderBy.value === "", msg: "Specify field to render by" },
  { condition: () => groupBy.value === "", msg: "Specify field to group by" },
  { condition: () => thresholds.value.includes(null) || thresholds.value.includes(""), msg: "Fill in missing threshold value" }
];
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
  emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
});
</script>
