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
                <FieldSelect v-model="xAxisField"></FieldSelect>
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
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_Y.id">
          <tbody class="pad-field">
            <tr>
              <td class="popup-field-label">
                Y-axis field:
              </td>
              <td>
                <FieldSelect v-model="yAxisField"></FieldSelect>
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
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_RENDER.id">
          <tbody>
            <tr class="pad-field">
              <td class="popup-field-label">
                Render by:
              </td>
              <td>
                <FieldSelect v-model="renderBy"></FieldSelect>
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
        <div v-else-if="editingFieldset === CHECK_DONE.MANHATTAN_GRAPHIC.id">
          <tbody class="pad-field">
            <tr>
              <td class="popup-field-label">
                Graphic format:
              </td>
              <td>
                <select v-model="graphicFormat" class="form-control form-control-sm">
                  <option :value="GRAPHIC_FORMATS.VECTOR">Vector</option>
                  <option :value="GRAPHIC_FORMATS.BITMAP">Bitmap</option>
                </select>
              </td>
            </tr>
            <tr v-if="graphicFormat === GRAPHIC_FORMATS.VECTOR">
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
  import FieldSelect from '../FieldSelect.vue';
  import GuiButton from '../GuiButton.vue';
  const store = useConfigBuilderStore();
  const emit = defineEmits(["updateVisualizer"]);
  const editingFieldset = computed(() => store.vizEditingFieldset);
  const availableFields = computed(() => store.allFields);
  const selectAllBox = ref(false);
  const graphicFormat = ref("");
  const xAxisField = ref("");
  const yAxisField = ref("");
  const renderBy = ref("");
  const xAxisLabel = ref("");
  const yAxisLabel = ref("");
  const height = ref("");
  const linkTo = ref("");
  const hoverContent = ref([]);
  const GRAPHIC_FORMATS = Object.freeze({
    VECTOR: "vector",
    BITMAP: "bitmap"
  });
  const configString = computed(() => {
    const type = graphicFormat.value;
    const config = {
      type,
      "x axis field": xAxisField.value,
      "y axis field": yAxisField.value,
      "render by": renderBy.value,
      "x axis label": xAxisLabel.value,
      "y axis label": yAxisLabel.value
    };
    if (height.value) {
      config.height = height.value;
    }
    if (linkTo.value) {
      config["link to"] = linkTo.value;
    }
    if (hoverContent.value.length > 0) {
      config["hover content"] = hoverContent.value;
    }
    return JSON.stringify(config);
  });
  const CHECK_DONE = {
    MANHATTAN_X: {
      id: "manhattan-x",
      text: "X-axis field",
      condition: () => !xAxisField.value || !xAxisLabel.value,
      msg: "Specify field and label for X-axis."
    },
    MANHATTAN_Y: {
      id: "manhattan-y",
      text: "Y-axis field",
      condition: () => !yAxisField.value || !yAxisLabel.value,
      msg: "Specify field and label for Y-axis."
    },
    MANHATTAN_RENDER: {
      id: "manhattan-render",
      text: "Render by",
      condition: () => !renderBy.value,
      msg: "Specify field to render by."
    },
    MANHATTAN_GRAPHIC: {
      id: "manhattan-graphic",
      text: "Graphic format",
      condition: () => !graphicFormat.value,
      msg: "Specify graphic format."
    }
  };
  watch(configString, () => {
    emit('updateVisualizer', configString.value, readyToSave(Object.values(CHECK_DONE)));
  });
</script>