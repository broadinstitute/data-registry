<script setup>
import Modal from '~/components/Modal.vue'
import { useDatasetStore } from '~/stores/DatasetStore'


const store = useDatasetStore();
const route = useRouter();
const fileInfo = ref({});
let file = null;
let fileName = null;
let phenotypes = {};
const colMap = ref({});
const selectedPhenotype = ref({});
const cases = ref(0);
const subjects = ref(0);
const controls = ref(0);
const dataSetName = ref("");
const colOptions = ref([]);


onMounted(async () => {
  await store.fetchPhenotypes();
  colOptions.value = await store.fetchColumnOptions();
  phenotypes = store.phenotypes;
});
async function sampleFile (e) {
  colMap.value = {};
  store.showNotification = false;
  file = e.target.files[0];
  fileName = e.target.files[0].name;
  try {
    fileInfo.value = await store.sampleTextFile(e.target.files[0]);
  } catch (e) {
    console.log(e);
    fileInfo.value = {};
  }
}

function updateColumnMapping(name, event) {
  if(event.target.value === ""){
    Object.entries(colMap.value).forEach(([key, value]) => {
      if(value === name){
        delete colMap.value[key];
      }
    });
  } else {
    colMap.value[event.target.value] = name;
  }
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

async function upload() {
  if (!useFormValidation("uploadGwasForm")) {
    return;
  }

  const metadata = {
    original_data: fileName,
    phenotype: selectedPhenotype.value.name,
    dataset: dataSetName.value,
    cases: cases.value,
    controls: controls.value,
    subjects: subjects.value,
    column_map: colMap.value
  };

  const errors = await store.validateMetadata(metadata);
  if (errors.length > 0) {
    store.showNotification = true;
    store.errorMessage = `<ul class="dotted">${errors.map((e) => `<li>${e}</li>`).join("")}</ul>`;
  } else {
    store.showNotification = false;
    try {
      await store.uploadFileForHermes(file, fileName, dataSetName.value, metadata);
      await route.push({ path: '/hermes' });
    } catch (e){
      console.log(e);
    }
  }
}

</script>

<template>
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
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label class="label" for="subjects">Subjects:</label>
            <input
                v-model="subjects"
                type="number"
                placeholder="Subjects"
                class="form-control input-default"
                min="1"
                required
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
                  min="1"
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
                  <select class="form-control" @change="updateColumnMapping(col, $event)">
                    <option value="">
                    </option>
                    <option v-for="option in colOptions" :key="option" :value="option" :disabled="Object.keys(colMap).includes(option)">
                      {{ option }}
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
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <ServerNotification
              :show-notification="store.showNotification"
              :error-message="store.errorMessage"
              :success="store.isServerSuccess"
              :success-message="store.successMessage"
              :auto-hide="false"
          />
        </div>
      </div>
    </form>
  </div>
  <Modal v-if="store.processing" :status-message="store.modalMsg"
         :progress="store.uploadProgress" :show-progress="store.showProgressBar" />
</template>

<style scoped>

</style>
