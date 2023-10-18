<script setup>

const config = useRuntimeConfig();
const files = ref([]);

const props = defineProps({
  datasetId: {
    type: String,
    required: false,
  }
})


const axios = useAxios(config, undefined, (error) => {
  console.log(error)
  throw new Error("Server Error")
});

onMounted(async () => {
  files.value = (await axios.get(`/api/filelist/${props.datasetId}`)).data;
  console.log(files.value);
});

</script>

<template>

</template>

<style scoped>

</style>
