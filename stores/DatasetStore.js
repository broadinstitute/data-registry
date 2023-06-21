import { defineStore } from 'pinia'

const config = useRuntimeConfig()

const configuredAxios = useAxios(config, undefined, (error) => {
  console.log(JSON.stringify(error))
  const store = useDatasetStore()
  store.processing = false
  store.errorMessage = error.message
  store.serverSuccess = false
  store.showNotification = true
  throw new Error("Server error")
});

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
  const { data } = await configuredAxios.post(getPhenotypeDataSetUploadUrl(dataset_id, pType),
    formData, { headers: { "Content-Type": "multipart/form-data" } })
  return data.phenotype_data_set_id;
}

async function saveCredibleSet(saved_phenotype_id, cs) {
  const formData = new FormData();
  formData.append("file", cs.credibleSetFile);
  const { data } = await configuredAxios.post(`/api/crediblesetupload/${saved_phenotype_id}/${cs.name}`,
    formData, { headers: { "Content-Type": "multipart/form-data" }})
  return data.credible_set_id;
}

function mapCredibleSets(){
  const result = []
  const credibleSets = {}
  const store = useDatasetStore()
  store.savedCredibleSets.map((cs) => {
    if (!credibleSets[cs.phenotype_data_set_id])
      credibleSets[cs.phenotype_data_set_id] = []
    credibleSets[cs.phenotype_data_set_id].push({ name: cs.name, id: cs.id, fileName: cs.file_name })
  })
  store.savedPhenotypes.map((p) => {
    result.push({
      name: store.phenotypes[p.phenotype]
        ? store.phenotypes[p.phenotype].name
        : p.phenotype,
      dichotomous: p.dichotomous,
      sampleSize: p.sample_size,
      cases: p.cases,
      controls: p.controls,
      credibleSets: credibleSets[p.id] || [],
      id: p.id,
      fileName: p.file_name,
      description: store.phenotypes[p.phenotype]
        ? store.phenotypes[p.phenotype].description
        : p.phenotype,
    })
  })
  if(result.length === 0){
    result.push({credibleSets: [{}]})
  }
  return result
}



export const useDatasetStore = defineStore('DatasetStore', {
  state: () => {
    return {
      phenotypes: {},
      studies: [],
      savedCredibleSets: [],
      savedPhenotypes: [],
      combinedPhenotypesAndCredibleSets: [],
      showNotification: false,
      errorMessage: '',
      isServerSuccess: false,
      processing: false,
      modalMsg: '',
      savedDataSetId: null,
    }
  },
  getters: {
    savedDataSets: (state) => {
      return state.combinedPhenotypesAndCredibleSets
    },
    dataSetId: (state) => {
      return state.savedDataSetId
    },
    credibleSetsToAdd: (state) => {
      let result = false
      state.combinedPhenotypesAndCredibleSets.forEach((p) => {
        if (p.credibleSets.filter((cs) => !cs.id).length > 0) {
          result = true
        }
      })
      return result
    }
  },
  actions: {
    async fetchPhenotypes() {
      const { data, error  } = await useFetch(config.public["phenotypesUrl"])
      if (error.value) {
        this.showNotification = true
        this.errorMessage = error.value.message
      } else {
        const mappedPhenotypes = {}
        data.value.data.forEach((d) => (mappedPhenotypes[d.name] = d))
        this.phenotypes = mappedPhenotypes
      }
    },
    async fetchStudies() {
      const { data } = await configuredAxios.get('/api/studies')
      this.studies = data.map((s) => {
        return { label: s.name, value: s.id, institution: s.institution }
      })
    },
    async saveStudy(study) {
      const { data } =  await configuredAxios.post("/api/studies", JSON.stringify(study))
      return data
    },
    async fetchExistingDataset(dsId) {
      const { data } = await configuredAxios.get(`/api/datasets/${dsId}`)
      this.savedPhenotypes = data.phenotypes
      this.savedCredibleSets = data.credible_sets
      this.combinedPhenotypesAndCredibleSets = mapCredibleSets()
      return data
    },
    async fetchPubInfo(pubId) {
      const { data } = await configuredAxios.get(`/api/publications?pub_id=${pubId.trim()}`)
      return data
    },
    async saveDataset(dataset) {
      this.processing = true
      if (dataset.id) {
        await configuredAxios.patch("/api/datasets", JSON.stringify(dataset))
      } else {
        const { data } = await configuredAxios.post("/api/datasets", JSON.stringify(dataset))
        this.savedDataSetId = data.dataset_id
      }
      this.addPhenoBlankDataset()
      this.processing = false
      this.showNotification = true
      this.isServerSuccess = true
    },
    async uploadFiles(dataset_id) {
      this.processing = true
      for (const phenotype of this.savedDataSets) {
        this.modalMsg = `Uploading data for ${phenotype.description}`
        if(!phenotype.id){
          phenotype.id  = await savePhenotype(dataset_id.replaceAll('-', ''), phenotype)
        }
        for (const cs of phenotype.credibleSets) {
          if (!cs.id && cs.credibleSetFile) {
            cs.id = await saveCredibleSet(phenotype.id.replaceAll('-', ''), cs)
          }
        }
        if(phenotype.credibleSets === [{}]){
          phenotype.credibleSets = []
        }
      }
      this.showNotification = true
      this.isServerSuccess = true
      this.processing = false
    },
    async deletePhenotypeDataSet(save_phenotype_id) {
      await configuredAxios.delete(`/api/phenotypes/${save_phenotype_id}`)
    },
    addStudy(study) {
      this.studies.push(study)
    },
    addPhenoBlankDataset() {
      this.combinedPhenotypesAndCredibleSets.push({ credibleSets: [{}] })
    },
    resetPhenoDatasets() {
      this.combinedPhenotypesAndCredibleSets = [{ credibleSets: [{}] }]
    },
    removePhenoDataset(index) {
      this.combinedPhenotypesAndCredibleSets.splice(index, 1)
    }
  }
})
