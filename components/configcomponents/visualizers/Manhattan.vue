<template>
  <div class="row">
    <div class="col-md-2" id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset !== ''">
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
    <div id="viz-gui" class="col-md-9">
      <button id="y-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('y-button')">
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Y-axis field
      </button>
      <button id="x-button" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('x-button')">
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        X-axis field
      </button>
      <button id="render-by" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('render-by')">
        <span class="item-done" hidden>&check;</span>
        <span class="item-undone" hidden>&#9888;</span>
        Render by
      </button>
      <button id="graphic-format" class="btn btn-primary btn-sm gui-btn" @click="editFieldset('graphic-format')">
        <span class="item-done" hidden></span>
        <span class="item-undone" hidden>&#9888;</span>
        Graphic format
      </button>
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
      "y axis label": yAxisLabel.value
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
  const CHECK_DONE = {
    "x-button": {
        condition: () => xAxisField.value === "" || xAxisLabel.value === "",
        msg: "Specify field and label for X-axis."
      },
    "y-button": {
        condition: () => yAxisField.value === "" || yAxisLabel.value === "",
        msg: "Specify field and label for Y-axis."
      },
    "render-by": {
      condition: () => renderBy.value === "",
      msg: "Specify field to render by."
    }
  };
  const VALIDATORS = Object.values(CHECK_DONE);
  watch(configString, () => {
    // Add and remove 'done' flags from gui buttons
    Object.keys(CHECK_DONE).forEach((buttonId) => {
      let thisButton = document.getElementById(buttonId);
      if (!CHECK_DONE[buttonId].condition()){
        thisButton.classList.add("done");
        thisButton.classList.remove("undone");
        thisButton.getElementsByClassName("item-done")[0].hidden = false;
        thisButton.getElementsByClassName("item-undone")[0].hidden = true;
      } else if (thisButton.classList.contains("done")){
        thisButton.classList.remove("done");
        thisButton.classList.add("undone");
        thisButton.getElementsByClassName("item-done")[0].hidden = true;
        thisButton.getElementsByClassName("item-undone")[0].hidden = false;
      }
    });
    emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
  });
  function editFieldset(fieldsetId){
    editingFieldset.value = fieldsetId;
  }
</script>
<style>
  .gui-btn {
    background-color: #eeeeee;
    border: 1px solid #dddddd;
    border-radius: 15px;
    color: #333333;
  }
  #y-button {
    position: relative;
    top: 165px;
    left: -5px;
  }
  #x-button {
    position: relative;
    top: 240px;
    left: 330px;
  }
  #render-by {
    position: relative;
    top: 160px;
    left: 115px;
  }
  #graphic-format {
    position: relative;
    top: 11px;
    left: -270px;
  }
  .pad-field td {
    padding: 5px;
  }
  .compact td {
    font-size: smaller;
  }
  .compact input {
    margin-left: 5px;
  }
  #viz-gui {
    min-height: 300px;
    background-image: url("assets/images/manhattan_model_crop.jpg");
    background-size: 800px;
    background-position: left;
    background-repeat: no-repeat;
    background-color: white;
  }
  #leftFieldWrapper {
    width: 25%;
  }
  #leftField {
    margin-top: 20px;
    background-color: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 15px;
    padding: 5px;
  }
  .done {
    background-color: green;
    border: 1px solid darkgreen;
    color: white;
  }
  .undone {
    background-color: orange;
    border: 1px solid orangered;
    color: black;
  }
</style>