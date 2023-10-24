<script setup>

import { useDatasetStore } from '~/stores/DatasetStore'


const config = useRuntimeConfig();
const files = ref([]);
const schema = ref('');
const existingBioIndex = ref('');
const schemaDesc = ref('');
const store = useDatasetStore()

const props = defineProps({
  datasetId: {
    type: String,
    required: false,
  }
})


const axios = useAxios(config, undefined, (error) => {
  console.log(error);
  throw new Error("Server Error");
});

async function populateIndexInfo() {
  const { url: bioIndexUrl, schema } = await getExistingBiondex()
  if (bioIndexUrl) {
    existingBioIndex.value = bioIndexUrl
    schemaDesc.value = schema
  }
}

onMounted(async () => {
  if(props.datasetId) {
    const all_files = (await axios.get(`/api/filelist/${props.datasetId}`)).data;
    files.value = all_files.filter(file => file.name.endsWith('.json'));
    await populateIndexInfo();
  }
});

async function getExistingBiondex(){
  const resp = (await axios.get(`/api/bioindex/${props.datasetId}`)).data;
  if ("url" in resp) {
    return resp;
  } else {
    return { };
  }
}

async function createBioIndex(){
  if(!useFormValidation("indexForm")){
    return
  }
  await store.createBioIndex(props.datasetId, schemaDesc.value);
  await populateIndexInfo();
}

</script>

<template>
  <div class="container-fluid">
  <template v-if="files.length === 0">
    <div>No files uploaded.</div>
  </template>
  <template v-else>
    <div class="alert alert-primary" role="alert">
      <i class="bi-info-circle"></i>
      <span class="small"> Currently, only .json are supported for indexing and querying.  Here are the eligible json files in your dataset:</span>
      <ul v-for="file in files" class="file-list">
        <li>{{file.name}}</li>
      </ul>
    </div>
    <form class="needs-validation" id="indexForm" novalidate>
      <div class="row g-3 align-items-center">
        <div class="col-auto">
        <label for="schema" class="col-sm-2 col-form-label">schema:</label>
          </div>
        <div class="col-auto">
          <input class="col-sm-8 form-control input-default" name="schema" id="schema" type="text"
                 required placeholder="schema" v-model="schemaDesc">
        </div>
      </div>
      <div class="row g-3 align-items-center" v-if="existingBioIndex">
        <div class="col-auto">
          <label>query url:</label>
        </div>
        <div class="col-auto">
          <span>{{existingBioIndex}}</span>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="createBioIndex()">{{ existingBioIndex ? "Update" : "Create"}}</button>
    </form>
  </template>
  </div>
</template>

<style scoped>

</style>
