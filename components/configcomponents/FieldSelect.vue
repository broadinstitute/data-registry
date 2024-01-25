<template>
  <select class="form-control form-control-sm" v-model="field">
    <option value="">
      <span v-if="props.noneOption">None</span>
      <span v-else>Select a field</span>
    </option>
    <option v-for="field in availableFields" :key="field">
      {{ field }}
    </option>
  </select>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const props = defineProps({
    noneOption: Boolean
  });
  const store = useConfigBuilderStore();
  const availableFields = computed(() => store.allFields);
  const fieldNameOld = computed(() => store.latestFieldRename[0]);
  const fieldNameNew = computed(() => store.latestFieldRename[1]);
  const field = defineModel();
  watch([availableFields, fieldNameOld], () => {
    // Deletions and name changes
    if (field.value === fieldNameOld.value) {
      field.value = fieldNameNew.value;
    } else if (!availableFields.value.includes(field.value)) {
      field.value = "";
    }
  });
</script>