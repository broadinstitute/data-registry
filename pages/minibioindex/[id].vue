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
      </tr>
      </thead>
      <tbody class="table-group-divider">
      <tr>
        <td>{{id}}</td>
        <td>{{createdAt}}</td>
        <td>{{schema}}</td>
        <td>{{status}}</td>
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

const createdAt = ref('');
const schema = ref('');
let websocket = null;

onMounted(async () => {
 const {data} = await axios.get(`/api/trackbioindex/${id}`);
  status.value = data.status;
  createdAt.value = data.created_at;
  schema.value = data.column;
});

function initializeWebSocket(ipAddress) {
  console.log('Initializing WebSocket');
  websocket = new WebSocket(`ws://${ipAddress}:8765`);
  websocket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
  });
  websocket.addEventListener('open', (event) => {
    console.log('WebSocket connection established');
    console.log(JSON.stringify(event));
  });
  websocket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
  websocket.addEventListener('close', (event) => {
    console.log(JSON.stringify(event));
    console.log('WebSocket connection closed');
  });
}

const intervalId = setInterval(async () => {
  try {
    const { data } = await axios.get(`/api/trackbioindex/${id}`);
    status.value = data.status;

    if (data.ip_address && !websocket && status.value !== 'FAILED' && status.value !== 'FINISHED') {
      clearInterval(intervalId);
      initializeWebSocket(data.ip_address);
    } else if (status.value === 'FAILED' || status.value === 'FINISHED') {
      clearInterval(intervalId);
      if (websocket) {
        console.log("Closing websocket due to status change");
        websocket.close();
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    clearInterval(intervalId);
    if (websocket) {
      console.log("Closing websocket due to error");
      websocket.close();
    }
  }
}, 10000);


</script>
