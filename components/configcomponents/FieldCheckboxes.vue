<template>
  <tr class="compact">
    <td class="popup-field-label small-label">
      Select all fields
    </td>
    <td>
      <input
      v-model="selectAllBox"
      class="form-check-input"
      type="checkbox"
      @change="fields = !selectAllBox ? [] : availableFields"
      >
    </td>
  </tr>
  <tr v-for="field in availableFields" :key="field" class="compact">
    <td class="popup-field-label small-label">
      {{ field }}
    </td>
    <td>
      <input id="flexCheckDefault" v-model="fields" class="form-check-input" type="checkbox" :value="field">
    </td>
  </tr>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const store = useConfigBuilderStore();
  const selectAllBox = ref(false);
  const availableFields = computed(() => store.allFields);
  const fields = defineModel();
  watch (fields, ()=> {
    if (fields.value.length === 0){
      selectAllBox.value = false;
    }
  });
  // Watch/monitor available fields? (Name changes, deletions, etc.)
</script>