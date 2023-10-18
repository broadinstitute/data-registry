<script setup>
  import Modal from '~/components/Modal.vue'
  import { useDatasetStore } from '~/stores/DatasetStore'
  const props = defineProps({
    dsId: {
      type: String,
    },
    editMode: {
      type: Boolean,
      default: true,
    },
  })
  const store = useDatasetStore()
  const localEditMode = ref(props.editMode)
</script>

<template>
  <ServerNotification
      :show-notification="store.showNotification"
      :errorMessage="store.errorMessage"
      :success="store.isServerSuccess"
      :successMessage="store.successMessage"
  />
  <div class="row" v-if="store.dataSetId">
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
          <button class="accordion-button large-accordion-heading dataset-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#drmetadata" aria-expanded="true" aria-controls="drmetadata">
            Metadata
          </button>
        </h2>
        <div id="drmetadata" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRMetaData :dataset-id="store.dataSetId" :edit-mode="localEditMode"/>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button class="accordion-button collapsed large-accordion-heading dataset-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#drfiles" aria-expanded="false" aria-controls="drfiles">
            Files
          </button>
        </h2>
        <div id="drfiles" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRFiles data-type="file" :edit-mode="localEditMode" :dataset-id="store.dataSetId" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingThree">
          <button class="accordion-button collapsed large-accordion-heading dataset-accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#drindex" aria-expanded="false" aria-controls="drindex">
            Query API
          </button>
        </h2>
        <div id="drindex" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRIndex :dataset-id="store.dataSetId" />
          </div>
        </div>
    </div>
  </div>
  </div>
  <Modal :status-message="store.modalMsg" v-if="store.processing" :progress="store.uploadProgress" :show-progress="store.showProgressBar"/>
</template>

<style scoped>

</style>
