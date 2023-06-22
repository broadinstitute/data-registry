<script setup>
import { useDatasetStore } from '~/stores/DatasetStore'


const props = defineProps({
    dataType: {
      type: String,
      required: true
    },
    editMode: {
      type: Boolean,
      default: true
    },
    datasetId: {
      type: String,
      required: false,
    }
  })

  const config = useRuntimeConfig()
  const store = useDatasetStore()

  function credible_set_validation() {
    //if a credible set name or file is provided, make sure to require the counterpart field
    const credible_set_elements = document.getElementsByClassName("credible-set")
    for (const element of credible_set_elements) {
      element.required = false
    }
    for (const element of credible_set_elements) {
      if (element.value !== "") {
        const credible_set_inputs_for_pheno = document.querySelectorAll(
            '[data-associated-phenotype="' +
            element.dataset.associatedPhenotype +
            '"]',
        )
        credible_set_inputs_for_pheno.forEach(
            (input) => (input.required = true))
      }
    }
  }

  async function save(){
    if(!useFormValidation("filesForm", credible_set_validation)){
      return
    }
    await store.uploadFiles(props.datasetId)
  }

  async function removePhenotypeDataset(e) {
    const pheno = store.savedDataSets[e.id]
    if(pheno.id){
      await store.deletePhenotypeDataSet(pheno.id)
    }
    if(store.savedDataSets.length === 1){
      store.resetPhenoDatasets()
    } else {
      store.removePhenoDataset(e.id)
    }
  }
  const showAddFiles = computed(() => {
    return props.editMode && store.credibleSetsToAdd
  })

</script>

<template>
  <div class="dr-form">
  <div v-if="datasetId">
      <div class="row dr-data-section">
        <form class="needs-validation" novalidate id="filesForm">
          <ul>
            <li v-for="(phenotypeDataset, index) in store.savedDataSets">
              <PhenotypeDataset :dataset-data-type="dataType" :key="index" :phenotypeDataset="phenotypeDataset"
                                :identifier="index" @remove-phenotype-dataset="removePhenotypeDataset"
                                :disabled="!editMode"/>
            </li>
          </ul>
          <div style="display: inline; margin-top: -25px" v-if="editMode">
            <a href="#" @click.prevent="store.addPhenoBlankDataset()">Add Additional Phenotype</a>
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col col-md-2">
          <button type="button" class="btn btn-primary" @click="save" v-if="showAddFiles">Add Data</button>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col col-md-12">
        You need to save the required info in the 'Metadata' section above before you can upload data files.
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
