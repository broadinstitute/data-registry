<script setup>
  import 'bootstrap/dist/js/bootstrap.bundle.min.js'
  import { useDatasetStore } from '~/stores/DatasetStore'
  const props = defineProps({
    dsId: {
      type: String,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  })
  const datasetId = useState("dsId", props.dsId)
  const store = useDatasetStore()
  store.fetchPhenotypes()
  store.fetchStudies()
</script>

<template>
  <ServerNotification
      :show-notification="store.showNotification"
      :message="store.errorMessage"
      :success="store.isServerSuccess"
  />
  <div class="accordion" id="dsAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#drmetadata" aria-expanded="true" aria-controls="drmetadata">
          Metadata
        </button>
      </h2>
      <div id="drmetadata" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#dsAccordion">
        <div class="accordion-body">
          <DRMetaData :dataset-id="datasetId" :edit-mode="props.editMode"/>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#drfiles" aria-expanded="false" aria-controls="drfiles">
          Files
        </button>
      </h2>
      <div id="drfiles" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#dsAccordion">
        <div class="accordion-body">
          <DRFiles data-type="file" :is-read-only="false" :dataset-id="datasetId"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
