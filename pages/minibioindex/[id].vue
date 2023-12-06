<template>
  <h4>BioIndex Info</h4>
  <div class="container-fluid">
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Requested At</th>
        <th scope="col">Column</th>
        <th scope="col">Status</th>
        <th scope="col">API Endpoint</th>
      </tr>
      </thead>
      <tbody class="table-group-divider">
      <tr>
        <td>{{id}}</td>
        <td>{{createdAt}}</td>
        <td>{{schema}}</td>
        <td>{{status}}</td>
        <td class="small">{{apiUrl}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const axios = useAxios(config);
const id = route.params.id;
const status = ref('');
const apiUrl = ref('Working on it...');
const createdAt = ref('');
const schema = ref('');

onMounted(async () => {
 const {data} = await axios.get(`/api/trackbioindex/${id}`);
  status.value = data.status;
  createdAt.value = data.created_at;
  schema.value = data.column;
  const {data: {url}} = await axios.get(`/api/bioindex/${id}`);
  apiUrl.value = url;
});


const intervalId = setInterval(async () => {
  try {
    const { data } = await axios.get(`/api/trackbioindex/${id}`)
    status.value = data.status

    if (status.value === 'FAILED' || status.value === 'FINISHED') {
      clearInterval(intervalId)
      if(status.value === 'SUCCEEDED'){
        const {data: {url}} = await axios.get(`/api/bioindex/${id}`);
        apiUrl.value = url;
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    clearInterval(intervalId)
  }
}, 10000)


</script>
