<template>
  <div class="container-fluid">
    <DRDatasetAccordion :dsId="route.params.id" :edit-mode="route.query.edit === 'true'"/>
    <div class="row mt-2">
    <div class="col text-start">
      <nuxt-link :to="{ name: 'datasets' }">
        <button type="button" class="btn btn-success">
          <i class="bi bi-arrow-left"></i>
          Back to Dataset List
        </button></nuxt-link>
    </div>
    <div class="col text-end">
      <nuxt-link :to="{ name: 'datasets-new' }">
        <button type="button" class="btn btn-primary">
          <i class="bi bi-plus"></i>
          Add New Dataset
        </button>
      </nuxt-link>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useDatasetStore } from '~/stores/DatasetStore'


const route = useRoute()
const store = useDatasetStore()
store.savedDataSetId = route.params.id


</script>
