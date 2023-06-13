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


export const useDatasetStore = defineStore('DatasetStore', {
  state: () => {
    return {
      phenotypes: {},
      studies: [],
      savedCredibleSets: [],
      savedPhenotypes: [],
      showNotification: false,
      errorMessage: '',
      isServerSuccess: false,
      processing: false,
    }
  },
  getters: {
    savedDataSets: (state) => {
      const result = []
      const credibleSets = {};
      state.savedCredibleSets.map((cs) => {
        if (!credibleSets[cs.phenotype_data_set_id])
          credibleSets[cs.phenotype_data_set_id] = [];
        credibleSets[cs.phenotype_data_set_id].push({ name: cs.name, id: cs.id })
      })
      state.savedPhenotypes.map((p) => {
        result.push({
          name: state.phenotypes[p.phenotype]
            ? state.phenotypes[p.phenotype].name
            : p.phenotype,
          dichotomous: p.dichotomous,
          sampleSize: p.sample_size,
          cases: p.cases,
          controls: p.controls,
          credibleSets: credibleSets[p.id] || [{}],
          id: p.id,
          fileName: p.file_name,
          description: state.phenotypes[p.phenotype]
            ? state.phenotypes[p.phenotype].description
            : p.phenotype,
        })
      })
      if(result.length === 0){
        result[0] = { credibleSets: [{}] }
      }
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
      return data
    },
    async fetchPubInfo(pubId) {
      const { data } = await configuredAxios.get(`/api/publications?pub_id=${pubId.trim()}`)
      return data
    },
    async saveDataset(dataset) {
      if (dataset.id) {
        const { data } = await configuredAxios.patch("/api/datasets", JSON.stringify(dataset))
        this.processing = false
        this.showNotification = true
        this.isServerSuccess = true
        return data
      } else {
        const { data } = await configuredAxios.post("/api/datasets", JSON.stringify(dataset))
        this.processing = false
        this.showNotification = true
        this.isServerSuccess = true
        return data
      }
    },
    addStudy(study) {
      this.studies.push(study)
    },
    addPhenoDataset() {
      this.savedPhenotypes.push({ credibleSets: [{}] })
    },
    resetPhenoDatasets() {
      this.savedPhenotypes = [{ credibleSets: [{}] }]
    },
    removePhenoDataset(index) {
      this.savedPhenotypes.splice(index, 1)
    }
  }
})
