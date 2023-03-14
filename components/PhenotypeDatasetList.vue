<template>
  <ul>
    <li v-for="(value, key, index) in phenotypeDatasets">
      <PhenotypeDataset :dataset-data-type="props.datasetDataType" :key="index" :identifier="key"/>
    </li>
  </ul>
  <div style="display: inline; margin-top: -25px">
    <a href="#" @click.prevent="addPhenotype">Add Additional Phenotype</a>
  </div>
</template>

<script setup>
  const phenotypeDatasets = useState("selectedPhenotypes", () => {return {'p1':{}}})
  const props = defineProps({datasetDataType: String})

  function addPhenotype(){
    let keys = Object.keys(phenotypeDatasets.value)
    const newIdx = keys.length + 1
    phenotypeDatasets.value['p'+newIdx] = {}
  }
</script>
