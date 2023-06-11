<script setup>
  import Modal from '~/components/Modal.vue'


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

  const phenotypeDataSets = ref([{ credibleSets: [{}] }])
  const phenotypes = useState("phenotypes", () => [])
  const config = useRuntimeConfig()
  const { modalMsg, processing, errorMessage, serverSuccess, showNotification } = useModal()

  async function getPhenotypes() {
    const { data } = await $fetch(config.public["phenotypesUrl"]);
    const mappedPhenotypes = {};
    data.forEach((d) => (mappedPhenotypes[d.name] = d));
    phenotypes.value = mappedPhenotypes;
  }

  const configuredAxios = useAxios(config, undefined, (error) => {
    console.log(JSON.stringify(error))
    processing.value = false
    errorMessage.value = error.message
    serverSuccess.value = false
    showNotification.value = true
    throw new Error("Server error")
  });

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
    for (const phenotype of phenotypeDataSets.value) {
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
    processing.value = false
    serverSuccess.value = true;
    showNotification.value = true;
  }

  async function loadSavedFiles(){
    const { data } = await configuredAxios.get(
        `/api/datasets/${props.datasetId.replaceAll("-", "")}`,
    );
    phenotypeDataSets.value = []
    const credibleSets = {};
    data.credible_sets.map((cs) => {
      if (!credibleSets[cs.phenotype_data_set_id])
        credibleSets[cs.phenotype_data_set_id] = [];
      credibleSets[cs.phenotype_data_set_id].push({
        name: cs.name,
        id: cs.id,
      });
    });
    data.phenotypes.map((p) => {
      phenotypeDataSets.value.push({
        name: phenotypes.value[p.phenotype]
            ? phenotypes.value[p.phenotype].name
            : p.phenotype,
        dichotomous: p.dichotomous,
        sampleSize: p.sample_size,
        cases: p.cases,
        controls: p.controls,
        credibleSets: credibleSets[p.id] || [{}],
        id: p.id,
        fileName: p.file_name,
        description: phenotypes.value[p.phenotype]
            ? phenotypes.value[p.phenotype].description
            : p.phenotype,
      });
    });
    if(phenotypeDataSets.value.length === 0){
      phenotypeDataSets.value = [{ credibleSets: [{}] }]
    }
  }



  onMounted(async () => {
    await getPhenotypes()
    if(props.datasetId){
      await loadSavedFiles()
    }
  })

  async function removePhenotypeDataset(e) {
    const pheno = phenotypeDataSets.value[e.id]
    if(pheno.id){
      //make api call to delete
      await configuredAxios.delete(`${config.public["apiBaseUrl"]}/api/phenotypes/${pheno.id}`)
    }
    if(phenotypeDataSets.value.length === 1){
      phenotypeDataSets.value = [{ credibleSets: [{}] }]
    } else {
      phenotypeDataSets.value.splice(e.id, 1)
    }
  }

</script>

<template>
  <ServerNotification
      :show-notification="showNotification"
      :message="errorMessage"
      :success="serverSuccess"
  />
  <div>
  <div v-if="datasetId">
      <div class="row dr-data-section">
        <form class="needs-validation" novalidate id="filesForm">
          <div class="col-md-12"><h4>Data</h4></div>
          <ul>
            <li v-for="(phenotypeDataset, index) in phenotypeDataSets">
              <PhenotypeDataset :dataset-data-type="dataType" :key="index" :phenotypeDataset="phenotypeDataset"
                                :identifier="index" @remove-phenotype-dataset="removePhenotypeDataset"
                                :disabled="isReadOnly"/>
            </li>
          </ul>
          <div style="display: inline; margin-top: -25px" v-if="!isReadOnly">
            <a href="#" @click.prevent="phenotypeDataSets.push({credibleSets: [{}]})">Add Additional Phenotype</a>
          </div>
        </form>
      </div>
      <div class="row">
        <div class="col col-md-2">
          <button type="button" class="btn btn-primary" @click="save" v-if="phenotypeDataSets.filter(p => !p.id).length > 0">Add Data</button>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col col-md-12">
        You need to save the required info in the 'Metadata' section above before you can upload data files.
      </div>
    </div>
  <Modal :status-message="modalMsg" v-if="processing" />
  </div>
</template>

<style scoped>

</style>
