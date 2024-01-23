<template>
  <button :id="fieldsetId" class="btn btn-primary btn-sm gui-btn" :class="status" @click="editFieldset">
    <span v-if="status === STATUSES.NEUTRAL">&#9998;</span>
    <span v-if="status === STATUSES.DONE">&check;</span>
    <span v-if="status === STATUSES.UNDONE">&#9888;</span>
    {{ buttonText }}
  </button>
</template>
<script setup>
  import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
  const store = useConfigBuilderStore();
  const props = defineProps({info: Object});
  const STATUSES = Object.freeze({
      NEUTRAL: "neutral",
      DONE: "done",
      UNDONE: "undone"
    });
  const fieldsetId = ref(props.info.id);
  const buttonText = ref(props.info.text);
  const status = ref(STATUSES.NEUTRAL);
  const condition = computed(() => props.info.condition());
  function editFieldset(){
    store.setVizEditingFieldset(fieldsetId.value);
  }
  watch(condition, () => {
    if (condition.value){
        status.value = STATUSES.UNDONE;
    } else {
        status.value = STATUSES.DONE;
    }
  });
</script>