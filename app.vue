<template>
  <div class="container">
    <DataRegistryDataset/>
  </div>
</template>

<script setup>
  import "bootstrap/dist/css/bootstrap.min.css"
  import "bootstrap-icons/font/bootstrap-icons.css"
  import { onBeforeMount } from 'vue'
  const phenotypes = useState("phenotypes",  () => [])
  const phenotypeOptions = useState("phenotypeOptions",  () => [])
  const studies = useState("studies", () => [])
  const config = useRuntimeConfig()

  onBeforeMount(() => {
    getPhenotypes()
    fetchStudies()
  })

  async function getPhenotypes() {
    const { data } = await $fetch('https://bioindex.hugeamp.org/api/portal/phenotypes?q=md')
    phenotypes.value = data
    phenotypeOptions.value = data.map(p => {return {"label": p.description, "value": p.name}})
  }

  async function fetchStudies(){
    const data = await $fetch('http://localhost:8000/api/studies',
        { headers: {"access-token": config.apiSecret}})
    studies.value = data.map(s => {return {label: s.name, value: s.id, institution: s.institution}})
  }


</script>
