<template>
  <div class="row">
    <div class="col-md-2" id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset">
        <div v-if="editingFieldset === CHECK_DONE.VOLCANO_PLOT_LABEL.id">
          <tbody>
            <tr>
              <td>
                Plot label:
              </td>
              <td>
                <input
                  v-model="label"
                  type="text"
                  class="form-control input-default form-control-sm"
                >
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
                <select v-model="xAxisField" class="form-control form-control-sm">
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
              <td>
                X-axis label:
              </td>
              <td>
                <input v-model="xAxisLabel" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.VOLCANO_Y.id">
          <tbody>
            <tr>
              
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    <div id="volcano-gui" class="col-md-9 viz-gui">
      <GuiButton :info="CHECK_DONE.VOLCANO_X"></GuiButton>
      <GuiButton :info="CHECK_DONE.VOLCANO_Y"></GuiButton>
      <GuiButton :info="CHECK_DONE.VOLCANO_PLOT_LABEL"></GuiButton>
      <GuiButton :info=CHECK_DONE.VOLCANO_RENDER_BY></GuiButton>
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
  </div>
  <div class="label">
    X axis field condition
  </div>
  <div class="row">
    <div class="col-md-2">
      Condition<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="xAxisCondition" class="form-control form-control-sm">
        <option value="">
          Select a condition
        </option>
        <option value="greater than">
          Greater than
        </option>
        <option value="lower than">
          Less than
        </option>
        <option value="and">
          AND
        </option>
        <option value="or">
          OR
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div v-if="GREATER_THANS.includes(xAxisCondition)" class="col-md-2">
      Greater than<sup class="required"> *</sup>
    </div>
    <div v-if="GREATER_THANS.includes(xAxisCondition)" class="col-md-4">
      <input v-model="xGT" class="form-control form-control-sm" type="number">
    </div>
    <div class="col-md-2">
      <span v-if="xAxisCondition === 'lower than'">Less than<sup class="required"> *</sup></span>
      <span v-else-if="xAxisCondition === 'and'">AND less than<sup class="required"> *</sup></span>
      <span v-else-if="xAxisCondition === 'or'">OR less than<sup class="required"> *</sup></span>
    </div>
    <div v-if="LOWER_THANS.includes(xAxisCondition)" class="col-md-4">
      <input v-model="xLT" class="form-control form-control-sm" type="number">
    </div>
  </div>
  <div class="label">
    Y axis field condition
  </div>
  <div class="row">
    <div class="col-md-2">
      Condition<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="yAxisCondition" class="form-control form-control-sm">
        <option value="">
          Select a condition
        </option>
        <option value="greater than">
          Greater than
        </option>
        <option value="lower than">
          Less than
        </option>
        <option value="and">
          AND
        </option>
        <option value="or">
          OR
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div v-if="GREATER_THANS.includes(yAxisCondition)" class="col-md-2">
      Greater than<sup class="required"> *</sup>
    </div>
    <div v-if="GREATER_THANS.includes(yAxisCondition)" class="col-md-4">
      <input v-model="yGT" class="form-control form-control-sm" type="number">
    </div>
    <div class="col-md-2">
      <span v-if="yAxisCondition === 'lower than'">Less than<sup class="required"> *</sup></span>
      <span v-else-if="yAxisCondition === 'and'">AND less than<sup class="required"> *</sup></span>
      <span v-else-if="yAxisCondition === 'or'">OR less than<sup class="required"> *</sup></span>
    </div>
    <div v-if="LOWER_THANS.includes(yAxisCondition)" class="col-md-4">
      <input v-model="yLT" class="form-control form-control-sm" type="number">
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Label dots meeting<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
      <select v-model="dotLabelScore" class="form-control form-control-sm">
        <option :value="1">
          1 condition
        </option>
        <option :value="2">
          2 conditions
        </option>
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-md-2">
      Width
    </div>
    <div class="col-md-4">
      <input v-model="width" class="form-control form-control-sm" type="number">
    </div>
    <div class="col-md-2">
      Height
    </div>
    <div class="col-md-4">
      <input v-model="height" class="form-control form-control-sm" type="number">
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
const label = ref("");
const xAxisField = ref("");
const xAxisLabel = ref("");
const yAxisField = ref("");
const yAxisLabel = ref("");
const renderBy = ref("");
const dotLabelScore = ref(1);
const xAxisCondition = ref("");
const yAxisCondition = ref("");
const GREATER_THANS = ["greater than", "and", "or"];
const LOWER_THANS = ["lower than", "and", "or"];
const xGT = ref("");
const xLT = ref("");
const yGT = ref("");
const yLT = ref("");
const width = ref("");
const height = ref("");
const CHECK_DONE = Object.freeze({
  VOLCANO_PLOT_LABEL: {
    id: "volcano-plot-label",
    text: "Plot label",
    condition: () => !label.value, 
    msg: "Specify a label for the plot."
  },
  VOLCANO_X: {
    id: "volcano-x",
    text: "X-axis field",
    condition: () => !xAxisField.value || !xAxisLabel.value || !xAxisCondition.value ||
      (GREATER_THANS.includes(xAxisCondition.value) && xGT.value === null) ||
      (LOWER_THANS.includes(xAxisCondition.value) && xLT.value === null) ||
      (xAxisCondition.value === "and" && xGT.value >= xLT.value),
    msg: "Specify field, label, condition, and thresholds for X-axis."
  },
  VOLCANO_Y: {
    id: "volcano-y",
    text: "Y-axis field",
    condition: () => !yAxisField.value || !yAxisLabel.value || !yAxisCondition.value ||
      (GREATER_THANS.includes(yAxisCondition.value) && yGT.value === null) ||
      (LOWER_THANS.includes(yAxisCondition.value) && yLT.value === null) ||
      (yAxisCondition.value === "and" && yGT.value >= yLT.value),
    msg: "Specify field, label, and condition for Y-axis."
  },
  VOLCANO_RENDER_BY: {
    id: "volcano-render-by",
    text: "Render by",
    condition: () => renderBy.value === "", 
    msg: "Specify field to render by."  
  },

});
const configString = computed(() => {
  const config = {
    type: "volcano plot",
    label: label.value,
    "x axis field": xAxisField.value,
    "x axis label": xAxisLabel.value,
    "y axis field": yAxisField.value,
    "y axis label": yAxisLabel.value,
    "render by": renderBy.value,
    "x condition": {
      combination: xAxisCondition.value,
    },
    "y condition": {
      combination: yAxisCondition.value,
    },
    "dot label score": dotLabelScore.value,
  };
  if (GREATER_THANS.includes(xAxisCondition.value)) {
    config["x condition"]["greater than"] = xGT.value;
  }
  if (LOWER_THANS.includes(xAxisCondition.value)) {
    config["x condition"]["lower than"] = xLT.value;
  }
  if (GREATER_THANS.includes(yAxisCondition.value)) {
    config["y condition"]["greater than"] = yGT.value;
  }
  if (LOWER_THANS.includes(yAxisCondition.value)) {
    config["y condition"]["lower than"] = yLT.value;
  }
  if (width.value !== null) {
    config.width = width.value;
  }
  if (height.value !== null) {
    config.height = height.value;
  }
  return JSON.stringify(config);
});
watch(configString, () => {
  emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
});
</script>
