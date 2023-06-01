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
                <th scope="col">Uploaded</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="dataset in datasets" :key="dataset.id">
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

                <td>
                    {{
                        dataset.created_at
                            ? dataset.created_at.split("T")[0]
                            : ""
                    }}
                </td>
                <td>
                    <nuxt-link :to="`/datasets/${dataset.id}?edit=true`"><i class="bi bi-pencil" style="cursor: pointer;"></i></nuxt-link>
                    &nbsp;
                    <i @click="deleteDataSet(dataset.id)" class="bi bi-trash" style="cursor: pointer; color: red;"></i>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
const route = useRouter();
const config = useRuntimeConfig();
const datasets = ref([])

onMounted(() => {
  fetchDataSets()
})


async function deleteDataSet(id){
  await $fetch(`${config.public['apiBaseUrl']}/api/datasets/${id}`, {
    method: 'DELETE',
    headers: { "access-token": config.public['apiSecret'] }
  })
  datasets.value = datasets.value.filter((dataset) => dataset.id !== id)
}

async function fetchDataSets() {
  datasets.value = await $fetch(`${config.public['apiBaseUrl']}/api/datasets`, {
    headers: { "access-token": config.public['apiSecret'] },
  });
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
