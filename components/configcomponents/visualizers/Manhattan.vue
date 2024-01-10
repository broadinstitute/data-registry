<template>
  <div class="row">
      <div id="viz-gui" class="col-md-12">
        <button id="y-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('y-button')">
          Y-axis field
        </button>
        <button id="x-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('x-button')">
          X-axis field
        </button>
        <button id="render-by" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('render-by')">
          Render by
        </button>
        <button id="graphic-format" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('graphic-format')">
          Graphic format
        </button>
        <div v-if="editingFieldset !== ''" id="popup-fields">
          <div v-if="editingFieldset === 'x-button'">
            <tbody class="pad-field">
              <tr>
                <td class="popup-field-label">
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
                <td class="popup-field-label">
                  Label:
                </td>
                <td>
                  <input v-model="xAxisLabel" type="text" class="form-control input-default form-control-sm">
                </td>
              </tr>
            </tbody>
          </div>
          <div v-else-if="editingFieldset === 'y-button'">
            <tbody class="pad-field">
              <tr>
                <td class="popup-field-label">
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
                <td class="popup-field-label">
                  Label:
                </td>
                <td>
                  <input v-model="yAxisLabel" type="text" class="form-control input-default form-control-sm">
                </td>
              </tr>
            </tbody>
          </div>
          <div v-else-if="editingFieldset === 'render-by'">
            <tbody>
              <tr class="pad-field">
                <td class="popup-field-label">
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
              <tr>
                <td class="popup-field-label">
                  Hover content:
                </td>
              </tr>
              <tr class="compact">
                <td class="popup-field-label small-label">
                  Select all fields
                </td>
                <td>
                  <input
                  v-model="selectAllBox"
                  class="form-check-input"
                  type="checkbox"
                  @change="hoverContent = !selectAllBox ? [] : availableFields"
                  >
                </td>
              </tr>
              <tr v-for="field in availableFields" :key="field" class="compact">
                <td class="popup-field-label small-label">
                  {{ field }}
                </td>
                <td>
                  <input id="flexCheckDefault" v-model="hoverContent" class="form-check-input" type="checkbox" :value="field">
                </td>
              </tr>
            </tbody>
          </div>
          <div v-else-if="editingFieldset === 'graphic-format'">
            <tbody class="pad-field">
              <tr>
                <td class="popup-field-label">
                  Graphic format:
                </td>
                <td>
                  <select v-model="graphicFormat" class="form-control form-control-sm">
                    <option>Vector</option>
                    <option>Bitmap</option>
                  </select>
                </td>
              </tr>
              <tr v-if="graphicFormat === 'Vector'">
                <td class="popup-field-label">
                  Link to:
                </td>
                <td>
                  <input v-model="linkTo" type="text" class="form-control input-default form-control-sm">
                </td>
              </tr>
              <tr>
                <td class="popup-field-label">
                  Plot height:
                </td>
                <td>
                  <input v-model="height" class="form-control form-control-sm" type="number">
                </td>
              </tr>
            </tbody>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const store = useConfigBuilderStore();
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = ref("");
  const availableFields = computed(() => store.allFields);
  const selectAllBox = ref(false);
  const graphicFormat = ref("Bitmap");
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
  #render-by {
    position: relative;
    top: 160px;
    left: 160px;
  }
  #graphic-format {
    position: relative;
    top: 11px;
    left: -260px;
  }
  #popup-fields {
    position: relative;
    width: 360px;
    top: -20px;
    left: 225px;
    padding: 5px;
    overflow: scroll;
    max-height: 150px;
  }
  .pad-field td {
    padding: 5px;
  }
  .popup-field-label {
    text-align: right;
    min-width: 125px;
  }
  .compact td {
    font-size: smaller;
  }
  .compact input {
    margin-left: 5px;
  }
  #viz-gui {
    min-height: 300px;
    margin: 20px;
    background-clip: padding-box;
    background-image: url("assets/images/manhattan_model_crop.jpg");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: white;
  }
</style>