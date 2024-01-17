<template>
  <button :id="buttonId" class="btn btn-primary btn-sm gui-btn neutral" @click="emitEditFieldset()">
    <span class="pencil">&#9998;</span>
    <span class="item-done">&check;</span>
    <span class="item-undone">&#9888;</span>
    {{ buttonText }}
  </button>
</template>
<script setup>
  const props = defineProps({buttonId: String, buttonText: String});
  const emit = defineEmits(["editFields"]);
  const buttonId = ref(props.buttonId);
  const buttonText = ref(props.buttonText);
  function emitEditFieldset(){
    emit("editFields", buttonId.value);
  }
</script>