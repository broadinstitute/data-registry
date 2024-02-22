<script setup>
import Modal from '~/components/Modal.vue'
import { useDatasetStore } from '~/stores/DatasetStore'


const store = useDatasetStore();
const fileInfo = ref({});
let file = null;
let fileName = null;
let phenotypes = {};
const colMap = ref({});
const selectedPhenotype = ref({});
const cases = ref(0);
const controls = ref(0);
const dataSetName = ref("");

onMounted(async () => {
  await store.fetchPhenotypes();
  phenotypes = store.phenotypes;
});
async function sampleFile (e) {
  file = e.target.files[0];
  fileName = e.target.files[0].name;
  fileInfo.value = await store.sampleTextFile(e.target.files[0]);
}

function ptypeBlur (event) {
  if(!event.value){
    return;
  }
  selectedPhenotype.value.name = event.value.name;
  selectedPhenotype.value.description = event.value.description;
  selectedPhenotype.value.dichotomous = event.value.dichotomous;

}

function filterFunc (q) {
  return Object.values(phenotypes).filter((p) => {
    if (q.length < 2) { return false; }
    const words = q.split(" ");
    let matches = 0;
    words.forEach((word) => {
      if (p.description.toLowerCase().includes(word.toLowerCase())) { matches++; }
    });
    return matches === words.length;
  });
}

function updateColumnMapping (e) {
  const col = e.target.parentElement.parentElement.firstChild.innerText;
  colMap.value[e.target.value] = col;
  console.log(Object.keys(colMap.value));
}

function upload(){
  if (!useFormValidation("uploadGwasForm")) {
    return;
  }
  store.uploadFileForHermes(file, fileName, dataSetName.value, {
    phenotype: selectedPhenotype.value.name,
    cases: cases.value,
    controls: controls.value,
    colMap: colMap.value
  });
}

</script>

<template>
  <ServerNotification
      :show-notification="store.showNotification"
      :error-message="store.errorMessage"
      :success="store.isServerSuccess"
      :success-message="store.successMessage"
  />
  <div class="container-fluid">
    <form id="uploadGwasForm" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h2 class="text-center mb-4">
            Upload GWAS for Analysis
          </h2>

          <div class="form-group">
            <label class="label" for="fileInput">Select file, must be text based or (b)gzip:</label>
            <input
                id="fileInput"
                type="file"
                class="form-control-file form-control"
                name="file"
                required
                accept=".csv, .tsv, .gz, .bgzip, .gzip"
                @change="sampleFile"
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label class="label" for="datasetName">Dataset Name:</label>
            <input
                v-model="dataSetName"
                type="text"
                placeholder="Dataset Name"
                class="form-control input-default"
                required
            />
          </div>
      </div>
      </div>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label class="label" for="phenotype">Phenotype:</label>
            <AutoCompleteDialog
                id="phenotype"
                placeholder="Phenotype"
                :items="Object.values(phenotypes)"
                :filter-function="filterFunc"
                :disabled="false"
                :allow-only-list-values="true"
                :item-display="i => i.description"
                @blur="ptypeBlur"
            />
          </div>
        </div>
      </div>
      <div class="row" v-if="selectedPhenotype.dichotomous">
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label class="label" for="cases">Cases:</label>
              <input
                  v-model="cases"
                  type="number"
                  placeholder="Cases"
                  class="form-control input-default"
                  min="0"
                  required
              />
            </div>
          </div>
      </div>
      <div class="row" v-if="selectedPhenotype.dichotomous">
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label class="label" for="cases">Controls:</label>
            <input
                v-model="controls"
                type="number"
                placeholder="Controls"
                class="form-control input-default"
                min="0"
                required
            />
          </div>
        </div>
      </div>
      <div v-if="fileInfo.columns" class="row">
        <div class="col-md-6 offset-md-3">
          <table class="table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Represents</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="col in fileInfo.columns" :key="col">
                <td>{{ col }}</td>
                <td>
                  <select class="form-control" @change="updateColumnMapping">
                    <option value="">
                    </option>
                    <option value="chromosome">
                      chromosome
                    </option>
                    <option value="position">
                      position
                    </option>
                    <option value="reference">
                      reference
                    </option>
                    <option value="alt">
                      alt
                    </option>
                    <option value="pValue">
                      pValue
                    </option>
                    <option value="beta">
                      beta
                    </option>
                    <option value="oddsRatio">
                      odds ratio
                    </option>
                    <option value="stdErr">
                      standard error
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <button type="button" class="btn btn-primary" @click="upload">
            Upload
          </button>
        </div>
      </div>
    </form>
  </div>
  <Modal v-if="store.processing" :status-message="store.modalMsg" :progress="store.uploadProgress" :show-progress="store.showProgressBar" />
</template>

<style scoped>

</style>
