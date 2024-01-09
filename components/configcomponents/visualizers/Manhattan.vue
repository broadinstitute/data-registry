<template>
  <div class="row">
      <div id="viz-gui" class="col-md-12">
        <button id="y-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('y-button')">
          Y-axis field
        </button>
        <button id="x-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('x-button')">
          X-axis field</button>
        <div v-if="editingFieldset !== ''" id="popup-fields">
         <div v-if="editingFieldset === 'x-button'">
          <select v-model="xAxisField" class="form-control form-control-sm">
            <option value="">
              Select a field
            </option>
            <option v-for="field in availableFields" :key="field">
              {{ field }}
            </option>
          </select>
         </div> 
        </div>
      </div>
    </div>
  <div class="row">
    <div class="col-md-2">
      Graphic format<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="graphicFormat" class="form-control form-control-sm">
        <option>Vector</option>
        <option>Bitmap</option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      X axis field<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      
    </div>
    <div class="col-md-2">
      X axis label<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <input v-model="xAxisLabel" type="text" class="form-control input-default form-control-sm">
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Y axis field<sup class="required"> *</sup>
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
      Y axis label<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <input v-model="yAxisLabel" type="text" class="form-control input-default form-control-sm">
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
      Height
    </div>
    <div class="col-md-4">
      <input v-model="height" class="form-control form-control-sm" type="number">
    </div>
  </div>
  <div v-if="graphicFormat === 'Vector'" class="row">
    <div class="col-md-2">
      Link to
    </div>
    <div class="col-md-10">
      <input v-model="linkTo" type="text" class="form-control input-default form-control-sm">
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
  import * as d3 from "d3";
  const store = useConfigBuilderStore();
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = ref("");
  const availableFields = computed(() => store.allFields);
  const selectAllBox = ref(false);
  const graphicFormat = ref("Vector");
  const xAxisField = ref("");
  const yAxisField = ref("");
  const renderBy = ref("");
  const xAxisLabel = ref("");
  const yAxisLabel = ref("");
  const height = ref("");
  const linkTo = ref("");
  const hoverContent = ref([]);
  const configString = computed(() => {
    const type = graphicFormat.value === "Vector" ? "manhattan plot" : "manhattan bitmap plot";
    const config = {
      type,
      "x axis field": xAxisField.value,
      "y axis field": yAxisField.value,
      "render by": renderBy.value,
      "x axis label": xAxisLabel.value,
      "y axis label": yAxisLabel.value,
    };
    if (height.value !== "") {
      config.height = height.value;
    }
    if (linkTo.value !== "") {
      config["link to"] = linkTo.value;
    }
    if (hoverContent.value.length > 0) {
      config["hover content"] = hoverContent.value;
    }
    return JSON.stringify(config);
  });
  const VALIDATORS = [
    { condition: () => xAxisField.value === "" || yAxisField.value === "", msg: "Specify fields for both axes." },
    { condition: () => renderBy.value === "", msg: "Specify field to render by." },
    { condition: () => xAxisLabel.value === "" || yAxisLabel.value === "", msg: "Specify labels for both axes." }
  ];
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
  });
  function editFieldset(fieldsetId){
    editingFieldset.value = fieldsetId;
  }
</script>
<style>
  .gui-btn, #popup-fields {
    background-color: #eeeeee;
    border: 1px solid #dddddd;
    border-radius: 15px;
    color: #333333;
  }
  #y-button {
    position: relative;
    top: 135px;
    left: 5px;
  }
  #x-button {
    position: relative;
    top: 260px;
    left: 350px;
  }
  #popup-fields {
    position: relative;
    width: 250px;
    min-height: 100px;
    top: -5px;
    left: 275px;
  }
</style>