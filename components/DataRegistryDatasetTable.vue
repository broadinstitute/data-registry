<script setup>
const props = defineProps({dataSets: Array})
const route = useRouter();


</script>

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
      <th scope="col">Global Sample Size</th>
      <th scope="col">Status</th>
      <th scope="col">Submitter</th>
      <th scope="col">Email</th>
      <th scope="col">Uploaded At</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="dataset in props.dataSets" :key="dataset.id" @click="route.push({path: `/datasets/${dataset.id}`})">
      <td>{{dataset.name}}</td>
      <td>{{dataset.description.length <= 20 ? dataset.description : dataset.description.substring(0, 20) + "..."}}</td>
      <td>{{dataset.pub_id}}</td>
      <td>{{dataset.data_type}}</td>
      <td>{{dataset.ancestry}}</td>
      <td>{{dataset.sex}}</td>
      <td>{{dataset.global_sample_size}}</td>
      <td>{{dataset.status}}</td>
      <td>{{dataset.data_submitter}}</td>
      <td>{{dataset.data_submitter_email}}</td>
      <td>{{dataset.created_at}}</td>
    </tr>
    </tbody>

  </table>

</template>

<style scoped>

</style>
