import { defineStore } from 'pinia'

const config = useRuntimeConfig()

const configuredAxios = useAxios(config, undefined, (error) => {
  console.log(JSON.stringify(error))
  const store = useDatasetStore()
  store.processing = false
  store.errorMessage = error.message || error.errorMessage
  store.serverSuccess = false
  store.showNotification = true
  throw new Error("Server error")
});

function onUpload(progressEvent) {
  const store = useDatasetStore();
  store.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
}


function getPhenotypeDataSetUploadUrl(dataset_id, pType) {
  let url = `/api/uploadfile/${dataset_id}/${pType.name}/${pType.dichotomous}/${pType.sampleSize}`;
  if (!pType.dichotomous) {
    return url;
  }
  return url + `?controls=${pType.controls}&cases=${pType.cases}`;
}

function readFilePart(file, partSize) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, partSize));
  });
}

async function savePhenotype(dataset_id, pType) {
  const formData = new FormData();
  formData.append("file", pType.file);
  const { data } = await configuredAxios.post(getPhenotypeDataSetUploadUrl(dataset_id, pType),
    formData, { headers: { "Content-Type": "multipart/form-data", "Filename": pType.fileName },
      onUploadProgress: onUpload })
  return data.phenotype_data_set_id;
}

async function saveCredibleSet(saved_phenotype_id, cs) {
  const formData = new FormData();
  formData.append("file", cs.credibleSetFile);
  const { data } = await configuredAxios.post(`/api/crediblesetupload/${saved_phenotype_id}/${cs.name}`,
    formData, { headers: { "Content-Type": "multipart/form-data", "Filename": cs.fileName },
      onUploadProgress: onUpload })
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
      credibleSets: credibleSets[p.id] || [{}],
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
      successMessage: '',
      isServerSuccess: false,
      processing: false,
      modalMsg: '',
      savedDataSetId: null,
      uploadProgress: 0,
      showProgressBar: false,
    }
  },
  getters: {
    savedDataSets: (state) => {
      return state.combinedPhenotypesAndCredibleSets
    },
    hasNoSavedData: (state) => {
      return Object.keys(state.combinedPhenotypesAndCredibleSets[0]).length === 1
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
      if(Object.keys(this.phenotypes).length > 0){
        return
      }
      const { data, error  } = await useFetch(config.public["phenotypesUrl"])
      if (error.value) {
        this.showNotification = true
        this.errorMessage = error.value.errorMessage
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
      this.savedDataSetId = data.dataset.id
      this.combinedPhenotypesAndCredibleSets = mapCredibleSets()
      return data
    },
    async sampleTextFile(file) {
      this.showProgressBar = false;
      this.processing = true;
      this.modalMsg = "Sampling File";
      const part = await readFilePart(file, 2048);
      const formData = new FormData();
      formData.append("file", new Blob([part]), file.name);

      const { data } = await configuredAxios.post("/api/preview-delimited-file", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      this.processing = false;
      return data;
    },
    async trackBioindex(request) {
      const { data } = await configuredAxios.post("/api/trackbioindex", JSON.stringify(request));
      return data;
    },
    async updateBioindexCreationStatus(id, status) {
      await configuredAxios.patch(`/api/trackbioindex/${id}/${status}`);
    },
    async enqueueCsvProcess(id, s3_path, schema, alreadySorted, mapping) {
      const request = {
       "name": id,
       "column": schema,
       "already_sorted": alreadySorted,
       "status": "SUBMITTED FOR PROCESSING",
       "s3_path": s3_path,
       "data_types": mapping,
      }
      await configuredAxios.post("/api/enqueue-csv-process", JSON.stringify(request));
    },
    async uploadFileForBioindex(file, fileName) {
      this.showProgressBar = true;
      this.processing = true;
      this.modalMsg = "Uploading File";
      this.uploadProgress = 0;
      const formData = new FormData();
      formData.append("file", file);
      const {data} = await configuredAxios.post("/api/upload-csv", formData,
        { headers: { "Content-Type": "multipart/form-data", "FileName": fileName },
          onUploadProgress: onUpload})
      this.processing = false;
      return data;
    },
    async fetchPubInfo(pubId) {
      const { data } = await configuredAxios.get(`/api/publications?pub_id=${pubId.trim()}`)
      return data
    },
    async saveDataset(dataset) {
      this.processing = true
      this.modalMsg = "Saving dataset metadata";
      this.showProgressBar = false;
      if (dataset.id) {
        await configuredAxios.patch("/api/datasets", JSON.stringify(dataset))
      } else {
        const { data } = await configuredAxios.post("/api/datasets", JSON.stringify(dataset))
        this.savedDataSetId = data.id
      }
      if(this.combinedPhenotypesAndCredibleSets.length === 0){
        this.addPhenoBlankDataset()
      }
      this.processing = false
      this.showNotification = true
      this.isServerSuccess = true
      this.successMessage = "Metadata saved, you can now upload files."
    },
    async uploadFiles(dataset_id) {
      this.processing = true;
      this.showProgressBar = true;
      for (const phenotype of this.savedDataSets) {
        if(!phenotype.id){
          this.modalMsg = `Uploading data for ${phenotype.description}`;
          this.uploadProgress = 0;
          phenotype.id  = await savePhenotype(dataset_id.replaceAll('-', ''), phenotype)
        }
        for (const cs of phenotype.credibleSets) {
          if (!cs.id && cs.credibleSetFile) {
            this.modalMsg = `Uploading credible set ${cs.name}`;
            this.uploadProgress = 0;
            cs.id = await saveCredibleSet(phenotype.id.replaceAll('-', ''), cs);
          }
        }
        if(Object.keys(phenotype.credibleSets[0]).length === 0 && phenotype.credibleSets.length === 1){
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
