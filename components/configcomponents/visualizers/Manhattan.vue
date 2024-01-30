<template>
  <div class="row">
    <div id="leftFieldWrapper">
      <div id="leftField" v-if="editingFieldset !== ''">
        <div v-if="editingFieldset === CHECK_DONE.MANHATTAN_X.id">
          <tbody class="pad-field">
            <tr>
              <td class="popup-field-label">
                X-axis field:
              </td>
              <td>
                <FieldSelect v-model="configObject['x axis field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Label:
              </td>
              <td>
                <input v-model="configObject['x axis label']" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_Y.id">
          <tbody class="pad-field">
            <tr>
              <td class="popup-field-label">
                Y-axis field:
              </td>
              <td>
                <FieldSelect v-model="configObject['y axis field']"></FieldSelect>
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Label:
              </td>
              <td>
                <input v-model="configObject['y axis label']" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
          </tbody>
        </div>
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_RENDER.id">
          <tbody>
            <tr class="pad-field">
              <td class="popup-field-label">
                Render by:
              </td>
              <td>
                <FieldSelect v-model="configObject['render by']"></FieldSelect>
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
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_GRAPHIC.id">
          <tbody class="pad-field">
            <tr>
              <td class="popup-field-label">
                Graphic format:
              </td>
              <td>
                <select v-model="configObject['type']" class="form-control form-control-sm">
                  <option value="" selected>Select format</option>
                  <option :value="GRAPHIC_FORMATS.VECTOR">Vector</option>
                  <option :value="GRAPHIC_FORMATS.BITMAP">Bitmap</option>
                </select>
              </td>
            </tr>
            <tr v-if="configObject['type'] === GRAPHIC_FORMATS.VECTOR">
              <td class="popup-field-label">
                Link to:
              </td>
              <td>
                <input v-model="configObject['link to']" type="text" class="form-control input-default form-control-sm">
              </td>
            </tr>
            <tr>
              <td class="popup-field-label">
                Plot height:
              </td>
              <td>
                <input v-model="configObject['height']" class="form-control form-control-sm" type="number">
              </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    <div id="manhattan-gui" class="viz-gui">
      <GuiButton :info="CHECK_DONE.MANHATTAN_X"></GuiButton>
      <GuiButton :info="CHECK_DONE.MANHATTAN_Y"></GuiButton>
      <GuiButton :info="CHECK_DONE.MANHATTAN_RENDER"></GuiButton>
      <GuiButton :info="CHECK_DONE.MANHATTAN_GRAPHIC"></GuiButton>
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
  const editingManhattan = computed(() => props.editing);
  const configObject = ref({
    // Pre-fill empty strings so that 'select field' is preselected
    "type": "",
    "x axis field": "",
    "y axis field": "",
    "render by": "",
    "hover content": []
  });
  const GRAPHIC_FORMATS = Object.freeze({
    VECTOR: "manhattan vector",
    BITMAP: "manhattan bitmap"
  });
  const configString = computed(() => {
    // Clean up optional fields
    let outputObject = JSON.parse(JSON.stringify(configObject.value)); // Deep copy
    if (!outputObject["height"]){
      delete outputObject["height"];
    }
    if (outputObject["hover content"].length === 0){
      delete outputObject["hover content"];
    }
    if (!outputObject["link to"]){
      delete outputObject["link to"];
    }
    return JSON.stringify(outputObject);
  });
  const CHECK_DONE = {
    MANHATTAN_X: {
      id: "manhattan-x",
      text: "X-axis field",
      condition: () => !configObject.value["x axis field"] || !configObject.value["x axis label"],
      msg: "Specify field and label for X-axis."
    },
    MANHATTAN_Y: {
      id: "manhattan-y",
      text: "Y-axis field",
      condition: () => !configObject.value["y axis field"] || !configObject.value["y axis label"],
      msg: "Specify field and label for Y-axis."
    },
    MANHATTAN_RENDER: {
      id: "manhattan-render",
      text: "Render by",
      condition: () => !configObject.value["render by"],
      msg: "Specify field to render by."
    },
    MANHATTAN_GRAPHIC: {
      id: "manhattan-graphic",
      text: "Graphic format",
      condition: () => !configObject.value["type"],
      msg: "Specify graphic format."
    }
  };
  onMounted(() => {
    if (editingManhattan.value){
      loadConfig();
    }
  });
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
  watch(editingManhattan, () => {
    if (editingManhattan.value){
      loadConfig();
    }
  });
  function loadConfig(){
    configObject.value = JSON.parse(props.configToLoad);
  }
</script>