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
  // Watch/monitor available fields? (Name changes, deletions, etc.)
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const props = defineProps({
    noneOption: Boolean
  });
  const store = useConfigBuilderStore();
  const availableFields = computed(() => store.allFields);
  const field = defineModel();
</script>