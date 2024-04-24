<script setup>
import { useDatasetStore } from '~/stores/DatasetStore';

const store = useDatasetStore();
const fileUploads = ref([]);

onMounted(async () => {
  fileUploads.value = await store.fetchFileUploads();
});

</script>

<template>
  <div class="container-fluid">
    <h3>Uploaded Datasets</h3>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Dataset</th>
          <th>File Name</th>
          <th>File Size</th>
          <th>Date Uploaded</th>
          <th>Uploader</th>
          <th>Phenotype</th>
          <th>QC Status</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fu in fileUploads" :key="fu.id">
          <tr>
            <td>{{ fu.dataset_name }}</td>
            <td>{{ fu.file_name }}</td>
            <td>{{ (fu.file_size / 1024**2).toFixed(2) + ' mb' }}</td>
            <td>{{ fu.uploaded_at }}</td>
            <td>{{ fu.uploaded_by }}</td>
            <td>{{ fu.phenotype }}</td>
            <td>
              <nuxt-link v-if="fu.qc_status !== 'SUBMITTED TO QC'" :to="`/hermes/${fu.id}`">{{ fu.qc_status }}</nuxt-link>
              <span v-else>{{ fu.qc_status }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="row">
      <div class="col">
        <nuxt-link to="/hermes/new" class="btn btn-primary">Upload Dataset</nuxt-link>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
