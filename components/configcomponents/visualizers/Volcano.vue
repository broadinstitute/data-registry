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
                  v-model="label"
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
                <input v-model="width" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Height:
              </td>
              <td>
                <input v-model="height" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr>
              <td>
                Label dots meeting:
              </td>
              <td>
                <select v-model="dotLabelScore" class="form-control form-control-sm">
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
            <tr>
              <td>
                Condition:
              </td>
              <td>
                <select v-model="xAxisCondition" class="form-control form-control-sm">
                  <option value="">Select condition</option>
                  <option v-for="objVal in CONDITION_OPTIONS" :key="objVal.text" :value="objVal.text">
                    {{ objVal.display }}
                  </option>
                </select>
                <!-- v-bind entries in list-->
              </td>
            </tr>
            <tr v-if="requiresGreaterThan(xAxisCondition)">
              <td>
                Greater than:
              </td>
              <td>
                <input v-model="xGT" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr v-if="requiresLessThan(xAxisCondition)">
              <td>
                <span v-if="xAxisCondition === CONDITION_OPTIONS.AND.text">AND</span>
                <span v-else-if="xAxisCondition === CONDITION_OPTIONS.OR.text">OR</span>
                Less than:
              </td>
              <td>
                <input v-model="xLT" class="form-control form-control-sm" type="number">
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
                <select v-model="yAxisField" class="form-control form-control-sm">
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
                Y-axis label:
              </td>
              <td>
                <input v-model="yAxisLabel" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
            <tr>
              <td>
                Condition:
              </td>
              <td>
                <select v-model="yAxisCondition" class="form-control form-control-sm">
                  <option value="">Select condition</option>
                  <option v-for="objVal in CONDITION_OPTIONS" :key="objVal.text" :value="objVal.text">
                    {{ objVal.display }}
                  </option>
                </select>
                <!-- v-bind entries in list-->
              </td>
            </tr>
            <tr v-if="requiresGreaterThan(yAxisCondition)">
              <td>
                Greater than:
              </td>
              <td>
                <input v-model="yGT" class="form-control form-control-sm" type="number">
              </td>
            </tr>
            <tr v-if="requiresLessThan(yAxisCondition)">
              <td>
                <span v-if="yAxisCondition === CONDITION_OPTIONS.AND.text">AND</span>
                <span v-else-if="yAxisCondition === CONDITION_OPTIONS.OR.text">OR</span>
                Less than:
              </td>
              <td>
                <input v-model="yLT" class="form-control form-control-sm" type="number">
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
                <select v-model="renderBy" class="form-control form-control-sm">
                  <option value="">
                    Select a field
                  </option>
                  <option v-for="field in availableFields" :key="field">
                    {{ field }}
                  </option>
                </select>
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
  const dotLabelScore = ref("");
  const xAxisCondition = ref("");
  const yAxisCondition = ref("");
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
  const xGT = ref("");
  const xLT = ref("");
  const yGT = ref("");
  const yLT = ref("");
  const width = ref("");
  const height = ref("");
  const CHECK_DONE = Object.freeze({
    VOLCANO_PLOT_LABEL: {
      id: "volcano-plot-label",
      text: "Plot setup",
      condition: () => !label.value || !dotLabelScore.value, 
      msg: "Specify a plot label and dot labeling conditions."
    },
    VOLCANO_X: {
      id: "volcano-x",
      text: "X-axis field",
      // Empty string comparisons are necessary for number field which accepts zeroes
      condition: () => !xAxisField.value || !xAxisLabel.value || !xAxisCondition.value ||
        (requiresGreaterThan(xAxisCondition.value) && xGT.value === "") ||
        (requiresLessThan(xAxisCondition.value) && xLT.value === "") ||
        (xAxisCondition.value === "and" && xGT.value >= xLT.value),
      msg: "Specify field, label, condition, and thresholds for X-axis."
    },
    VOLCANO_Y: {
      id: "volcano-y",
      text: "Y-axis field",
      // Empty string comparisons are necessary for number field which accepts zeroes
      condition: () => !yAxisField.value || !yAxisLabel.value || !yAxisCondition.value ||
        (requiresGreaterThan(yAxisCondition.value) && yGT.value === "") ||
        (requiresLessThan(yAxisCondition.value) && yLT.value === "") ||
        (yAxisCondition.value === "and" && yGT.value >= yLT.value),
      msg: "Specify field, label, and condition for Y-axis."
    },
    VOLCANO_RENDER_BY: {
      id: "volcano-render-by",
      text: "Render by",
      condition: () => !renderBy.value, 
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
    if (requiresGreaterThan(xAxisCondition.value)) {
      config["x condition"]["greater than"] = xGT.value;
    }
    if (requiresLessThan(xAxisCondition.value)) {
      config["x condition"]["lower than"] = xLT.value;
    }
    if (requiresGreaterThan(yAxisCondition.value)) {
      config["y condition"]["greater than"] = yGT.value;
    }
    if (requiresLessThan(yAxisCondition.value)) {
      config["y condition"]["lower than"] = yLT.value;
    }
    if (width.value) {
      config.width = width.value;
    }
    if (height.value) {
      config.height = height.value;
    }
    return JSON.stringify(config);
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
</script>
