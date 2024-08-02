<template>
  <ServerNotification
    :show-notification="store.showNotification"
    :error-message="store.errorMessage"
    :success="store.isServerSuccess"
    :success-message="store.successMessage"
  />
  <div class="container-fluid">
    <form id="createBioIndexForm" enctype="multipart/form-data">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h2 class="text-center mb-6">
            Create Query API
          </h2>

          <div class="form-group">
            <label class="label" for="fileInput">Select file:</label>
            <input
              id="fileInput"
              type="file"
              class="form-control-file form-control"
              name="file"
              accept=".csv, .tsv"
              @change="sampleFile"
            >
          </div>
        </div>
      </div>
      <div v-if="Object.keys(mapping).length > 0">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <table class="table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Data Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key in Object.keys(mapping.headers)" :key="key">
                  <td>{{ key }}</td>
                  <td>
                    <select v-model="mapping.headers[key]" class="form-control">
                      <option value="TEXT">
                        TEXT
                      </option>
                      <option value="INTEGER">
                        INTEGER
                      </option>
                      <option value="DECIMAL">
                        DECIMAL
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
            <div class="form-group">
              <div class="label">
                Query Column:
              </div>
              <input
                id="schema"
                v-model="schema"
                type="text"
                class="form-control input-default"
                placeholder="Column"
                required
              >
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div class="form-group form-check">
              <input id="sortedCheckbox" v-model="alreadySorted" type="checkbox" class="form-check-input">
              <label class="form-check-label" for="sortedCheckbox">Data are already sorted by column specified above.</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <button class="btn btn-primary" @click="uploadFileAndEnqueueSortingAndIndexing">
              Generate
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <Modal v-if="store.processing" :status-message="store.modalMsg" :progress="store.uploadProgress" :show-progress="store.showProgressBar" />
</template>
<script setup>
import Modal from '~/components/Modal.vue';
import { useDatasetStore } from '~/stores/DatasetStore';

const store = useDatasetStore();
const route = useRouter();
const alreadySorted = ref(false);
const mapping = ref({});
const schema = ref("");
let file = null;
let fileName = null;

async function uploadFileAndEnqueueSortingAndIndexing (e) {
  e.preventDefault();
  if (!useFormValidation("createBioIndexForm")) {
    return;
  }
  const { s3_path } = await store.uploadFileForBioindex(file, fileName);
  const { id } = await store.trackBioindex({
    column: schema.value,
    status: "FILE UPLOADED",
    already_sorted: alreadySorted.value,
    s3_path
  });
  await store.enqueueCsvProcess(id, s3_path, schema.value, alreadySorted.value, mapping.value.headers);
  await route.push({ path: `/minibioindex/${id}` });
}

async function sampleFile (e) {
  file = e.target.files[0];
  fileName = e.target.files[0].name;
  mapping.value = await store.sampleTextFile(e.target.files[0]);
}
</script>
