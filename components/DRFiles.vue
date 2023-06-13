<script setup>
import { useDatasetStore } from '~/stores/DatasetStore'


const props = defineProps({
    dataType: {
      type: String,
      required: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
            (input) => (input.required = true),
        )
      }
    }
  }

  async function saveCredibleSet(saved_phenotype_id, cs) {
    const formData = new FormData();
    formData.append("file", cs.credibleSetFile);
    await configuredAxios.post(
        `/api/crediblesetupload/${saved_phenotype_id}/${cs.name}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
    );
  }


  function getPhenotypeDataSetUploadUrl(dataset_id, pType) {
    let url = `/api/uploadfile/${dataset_id}/${pType.name}/${pType.dichotomous}/${pType.sampleSize}`;
    if (!pType.dichotomous) {
      return url;
    }
    return url + `?controls=${pType.controls}&cases=${pType.cases}`;
  }

  async function savePhenotype(dataset_id, pType) {
    const formData = new FormData();
    formData.append("file", pType.file);
    const { data } = await configuredAxios.post(
        getPhenotypeDataSetUploadUrl(dataset_id, pType),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
    );
    return data.phenotype_data_set_id;
  }

  async function save(){
    if(!useFormValidation("filesForm", credible_set_validation)){
      return
    }
    processing.value = true
    for (const phenotype of store.savedDataSets) {
      if(phenotype.id) {
        continue
      }
      modalMsg.value = `Uploading data for ${phenotype.description}`;
      const saved_phenotype_id = await savePhenotype(props.datasetId.replaceAll('-', ''), phenotype);
      phenotype.id = saved_phenotype_id
      for (const cs of phenotype.credibleSets) {
        if (cs.name && cs.name !== "") {
          await saveCredibleSet(saved_phenotype_id, cs);
        }
      }
    }
  }


  async function removePhenotypeDataset(e) {
    const pheno = store.savedDataSets[e.id]
    if(pheno.id){
      //make api call to delete
      await configuredAxios.delete(`${config.public["apiBaseUrl"]}/api/phenotypes/${pheno.id}`)
    }
    if(store.savedDataSets.length === 1){
      store.resetPhenoDatasets()
    } else {
      store.removePhenoDataset(e.id)
    }
  }

</script>

<template>
  <div class="dr-form">
  <div v-if="datasetId">
      <div class="row dr-data-section">
        <form class="needs-validation" novalidate id="filesForm">
          <div class="col-md-12"><h4>Data</h4></div>
          <ul>
            <li v-for="(phenotypeDataset, index) in store.savedDataSets">
              <PhenotypeDataset :dataset-data-type="dataType" :key="index" :phenotypeDataset="phenotypeDataset"
                                :identifier="index" @remove-phenotype-dataset="removePhenotypeDataset"
                                :disabled="isReadOnly"/>
            </li>
          </ul>
          <div style="display: inline; margin-top: -25px" v-if="!isReadOnly">
            <a href="#" @click.prevent="store.addPhenoDataset()">Add Additional Phenotype</a>
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col col-md-2">
          <button type="button" class="btn btn-primary" @click="save" v-if="store.savedDataSets.filter(p => !p.id).length > 0">Add Data</button>
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
