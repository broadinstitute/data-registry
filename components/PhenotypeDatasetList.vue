<template>
  <ul>
    <li v-for="(phenotypeDataset, index) in props.phenotypeDatasets">
      <PhenotypeDataset :dataset-data-type="props.datasetDataType" :key="index" :phenotypeDataset="phenotypeDataset" :identifier="index"/>
    </li>
  </ul>
  <div style="display: inline; margin-top: -25px">
    <a href="#" @click.prevent="addPhenotype">Add Additional Phenotype</a>
  </div>
</template>

<script setup>
  const props = defineProps({datasetDataType: String, phenotypeDatasets: Array})
  const emit = defineEmits(['add-phenotype-dataset'])

  function addPhenotype(){
    emit('add-phenotype-dataset');
  }
</script>
