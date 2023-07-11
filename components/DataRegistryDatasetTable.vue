<template>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Pub Id</th>
                <th scope="col">Data Type</th>
                <th scope="col">Ancestry</th>
                <th scope="col">Sex</th>
                <th scope="col">Samples</th>
                <th scope="col">Status</th>
                <th scope="col">Submitter</th>
                <th scope="col">Files</th>
                <th scope="col">Uploaded</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <template v-for="dataset in datasets" :key="dataset.id">
              <tr>
                <td>
                    <a class="link-primary" @click="route.push({ path: `/datasets/${dataset.id}` })">{{ dataset.name }}</a>
                </td>
                <td>
                    {{
                        dataset.description.length <= 20
                            ? dataset.description
                            : dataset.description.substring(0, 20) + "..."
                    }}
                </td>
                <td v-html="formatPubLink(dataset.pub_id)"></td>
                <td>{{ dataset.data_type }}</td>
                <td>{{ dataset.ancestry }}</td>
                <td v-html="formatSex(dataset.sex)"></td>
                <td>{{ dataset.global_sample_size }}</td>
                <td>{{ dataset.status }}</td>
                <td>{{ dataset.data_submitter }}</td>
                <td v-if="dataset.publicly_available">
                  <button class="btn btn-secondary" @click="toggleFiles(dataset)">
                    {{ dataset.showFiles ? "Hide" : "Show" }} Files
                  </button>
                </td>
                <td v-else>
                  Not Shared
                </td>
                <td>
                    {{
                        dataset.created_at
                            ? dataset.created_at.split("T")[0]
                            : ""
                    }}
                </td>
                <td>
                    <nuxt-link :to="`/datasets/${dataset.id}?edit=true`"
                        ><i class="bi bi-pencil" style="cursor: pointer"></i>
                    </nuxt-link>
                    &nbsp;
                    <i
                        @click="deleteDataSet(dataset.id)"
                        class="bi bi-trash"
                        style="cursor: pointer; color: red"
                    ></i>
                </td>
            </tr>
            <tr v-if="dataset.showFiles">
              <td colspan="12">
              <table class="table table-striped table-hover">
               <thead>
                <tr>
                  <th>File</th>
                  <th>Phenotype</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Path</th>
                  <th>Uploaded On</th>
                  <th>Access</th>
                  <th>Access Credentials</th>
                </tr>
               </thead>
                <tbody class="table-group-divider">
                <tr v-for="file in dataset.files">
                  <td>{{ file.name }}</td>
                  <td>{{ file.phenotype }}</td>
                  <td>{{ file.type}}</td>
                  <td>{{ file.size }}</td>
                  <td><button class="btn btn-secondary" @click="copyToClip(file)">{{ file.copyMsg ? file.copyMsg : 'Copy'}}</button></td>
                  <td>{{ file.createdAt }}</td>
                  <td>
                    <select class="form-select" disabled title="will be enabled later">
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="review">Review</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn btn-secondary" disabled title="will be enabled later">Set</button>
                  </td>
                </tr>
                </tbody>
              </table>
              </td>
            </tr>
            </template>
        </tbody>
    </table>
</template>

<script setup>
import useAxios from '~/composables/useAxios'
import { useDatasetStore } from '~/stores/DatasetStore'


const route = useRouter();
const config = useRuntimeConfig();
const store = useDatasetStore()
const datasets = ref([]);

const axios = useAxios(config, undefined, (error) => {
    console.log(error)
    throw new Error("Server Error")
})

onMounted(async () => {
    await fetchDataSets();
    await store.fetchPhenotypes()
});

async function toggleFiles(dataSet) {
  if(!dataSet.files) {
    dataSet.files = (await axios.get(`/api/filelist/${dataSet.id}`)).data
    for (const file of dataSet.files) {
      file.phenotype = store.phenotypes[file.phenotype].description
      const urlParts = file.path.split('/')
      urlParts[2] = encodeURIComponent(file.phenotype)
      file.path = urlParts.join('/')
      file.copyMsg = ''
    }
  }
  dataSet.showFiles = !dataSet.showFiles
}
async function copyToClip(file){
  const fullPath = `${config.public['apiBaseUrl']}/api/${file.path}`
  await navigator.clipboard.writeText(fullPath)
  file.copyMsg = 'Copied!'

  setTimeout(() => {
    file.copyMsg = ''
  }, 2000)
}

async function deleteDataSet(id) {
    await axios.delete(`/api/datasets/${id}`)
    datasets.value = datasets.value.filter((dataset) => dataset.id !== id);
}

async function fetchDataSets() {
  datasets.value = (await axios.get(`/api/datasets`)).data.map(ds => {return {...ds, showFiles: false}})
}
function formatSex(gender) {
    if (!gender) return "";
    else {
        switch (gender) {
            case "female":
                return '<span class="badge rounded-pill bg-info"><i class="bi bi-gender-female"></i> Female</span>';
            case "male":
                return '<span class="badge rounded-pill bg-warning"><i class="bi bi-gender-male"></i> Male</span>';
            case "mixed":
                return '<span class="badge rounded-pill bg-danger"><i class="bi bi-gender-ambiguous"></i> Mixed</span>';
            default:
                return "";
        }
    }
}

function formatPubLink(pubId) {
    if (!pubId) return "";
    else {
        return `<a href="https://pubmed.ncbi.nlm.nih.gov/${pubId}" target="_blank">${pubId}</a>`;
    }
}
</script>
<style scoped>
tr > td:first-child {
    cursor: pointer;
}
a {
    text-decoration: none;
}
</style>
