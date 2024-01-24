<template>
  <select class="form-control form-control-sm" v-model="field">
    <option value="">
      Select a field
    </option>
    <option v-for="field in availableFields" :key="field">
      {{ field }}
    </option>
  </select>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const store = useConfigBuilderStore();
  const availableFields = computed(() => store.allFields);
  const field = defineModel();
</script>