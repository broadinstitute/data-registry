<script setup>
  import 'bootstrap/dist/js/bootstrap.bundle.min.js'
  import Modal from '~/components/Modal.vue'
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
  const localEditMode = ref(props.editMode)
</script>

<template>
  <ServerNotification
      :show-notification="store.showNotification"
      :message="store.errorMessage"
      :success="store.isServerSuccess"
  />
  <div class="row" v-if="props.dsId">
    <div class="col">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
               @click="() => localEditMode = !localEditMode" :checked="localEditMode"/>
        <label class="form-check-label label" for="flexSwitchCheckDefault">Allow Edits</label>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="accordion" id="dsAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button large-accordion-heading" type="button" data-bs-toggle="collapse" data-bs-target="#drmetadata" aria-expanded="true" aria-controls="drmetadata">
            Metadata
          </button>
        </h2>
        <div id="drmetadata" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRMetaData :dataset-id="datasetId" :edit-mode="localEditMode"/>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button class="accordion-button collapsed large-accordion-heading" type="button" data-bs-toggle="collapse" data-bs-target="#drfiles" aria-expanded="false" aria-controls="drfiles">
            Files
          </button>
        </h2>
        <div id="drfiles" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRFiles data-type="file" :edit-mode="localEditMode" :dataset-id="datasetId" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal :status-message="store.modalMsg" v-if="store.processing" />
</template>

<style scoped>

</style>
