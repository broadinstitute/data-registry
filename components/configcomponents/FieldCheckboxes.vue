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
  const fieldNameOld = computed(() => store.latestFieldRename[0]);
  const fieldNameNew = computed(() => store.latestFieldRename[1]);
  const fields = defineModel();
  watch([availableFields, fieldNameOld], () => {
    // Name changes and deletions.
    // Applying map/filters does not work; we must rebuild the list.
    let newFields = [];
    fields.value.forEach(field => {
      if (field === fieldNameOld.value){
        newFields.push(fieldNameNew.value);
      } else if(availableFields.value.includes(field)){
        newFields.push(field);
      }
    });
    fields.value = newFields;
});
  // Reset select-all toggle box if selection is empty
  watch (fields, ()=> {
    if (fields.value.length === 0){
      selectAllBox.value = false;
    }
  });
</script>