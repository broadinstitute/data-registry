<template>
  <div class="container-fluid">
    <div v-if="isPublic">
      <h6>Shared data for {{dsName}}</h6>
      <ul>
        <li v-for="file in files" :key="file.name">
          <a :href="`${baseUrl}/api/files/${route.params.id}/${file.name}?filepath=${file.path}`" target="_blank">{{ file.name }}</a>
        </li>
      </ul>
    </div>
    <div v-else>
      Files aren't public
    </div>

  </div>
</template>
<script setup>
  import { useDatasetStore } from '~/stores/DatasetStore'

  const route = useRoute()
  const config = useRuntimeConfig()
  const store = useDatasetStore()
  const isPublic = ref(null)
  const files = ref([])
  const dsName = ref(null)
  const baseUrl = config.public['apiBaseUrl']


  onMounted(async () => {
      const { dataset } = await store.fetchExistingDataset(route.params.id)
      isPublic.value = dataset.publicly_available
      if(dataset.publicly_available){
        files.value = await store.fetchDatasetFiles(route.params.id)
        dsName.value = dataset.name
      }
  })
</script>
