<template>
  <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
    Tool tips tutorial
  </a>
  <div class="row dr-builder-ui">
    <div class="col-md-12 col">
      <div class="label">
        Tool tips
      </div>
      <ul class="dr-byor-data-columns">
        <li v-for="field in availableFields" :key="field">
          <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
          <input
            type="text"
            class="form-control input-default"
            placeholder="tool tip"
            :value="toolTipConfig[field]"
            @change="(event) => updateToolTips(field, event.target.value)"
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

const store = useConfigBuilderStore();
const emit = defineEmits(["toolTipsChanged"]);
const availableFields = computed(() => store.allFields);
const fieldNameOld = computed(() => store.latestFieldRename[0]);
const fieldNameNew = computed(() => store.latestFieldRename[1]);
const toolTipConfig = ref({});
function updateToolTips (field, text) {
  if (text === "") {
    delete toolTipConfig.value[field];
  } else {
    toolTipConfig.value[field] = text;
  }
  emitToolTips();
}
watch([availableFields, fieldNameOld], (newValues, oldValues) => {
  // Handle name changes first
  if (toolTipConfig.value[fieldNameOld.value]) {
    const toolTip = toolTipConfig.value[fieldNameOld.value];
    // do we need to do this part?
    if (!availableFields.value.includes(fieldNameOld.value)) {
      delete toolTipConfig.value[fieldNameOld.value];
    }
    toolTipConfig.value[fieldNameNew.value] = toolTip;
  }
  // Then handle deletions
  const oldFields = oldValues[0];
  const newFields = newValues[0];
  oldFields.forEach((oldField) => {
    if (!newFields.includes(oldField)) {
      delete toolTipConfig.value[oldField];
    }
  });
});
function emitToolTips () {
  emit("toolTipsChanged", toolTipConfig.value);
}
</script>
