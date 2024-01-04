<template>
  <ul class="dr-byor-data-columns">
    <li v-for="field in fieldColumnNames" class="form-check form-check-inline" :key="field">
      <input
        v-model="selectedField"
        class="form-check-input"
        type="radio"
        :value="field['raw field']"
      >
      <span class="form-check-label" for="flexCheckDefault">
        {{ field["field name"] }}
      </span>
    </li>
  </ul>
</template>
<script setup>
import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

const store = useConfigBuilderStore();
const props = defineProps({ selectedField: String });
const emit = defineEmits(["fieldSelected"]);
const fieldColumnNames = computed(() => store.selectedColumns);
const selectedField = ref(props.selectedField);
watch(selectedField, (newField, oldField) => {
  if (newField !== oldField) {
    emit("fieldSelected", selectedField.value);
  }
});
</script>
