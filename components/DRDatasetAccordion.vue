<script setup>
import Modal from '~/components/Modal.vue';
import { useDatasetStore } from '~/stores/DatasetStore';
const props = defineProps({
  dsId: {
    type: String,
  },
  editMode: {
    type: Boolean,
    default: true,
  },
});
const store = useDatasetStore();
const localEditMode = ref(props.editMode);
</script>

<template>
  <ServerNotification
    :show-notification="store.showNotification"
    :error-message="store.errorMessage"
    :success="store.isServerSuccess"
    :success-message="store.successMessage"
  />
  <div v-if="store.dataSetId" class="row" v-can="'editDataset'">
    <div class="col">
      <div class="form-check form-switch">
        <input
          id="flexSwitchCheckDefault"
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="localEditMode"
          @click="() => localEditMode = !localEditMode"
        >
        <label class="form-check-label label" for="flexSwitchCheckDefault">Allow Edits</label>
      </div>
    </div>
  </div>
  <div class="row">
    <div id="dsAccordion" class="accordion">
      <div class="accordion-item">
        <h2 id="headingOne" class="accordion-header">
          <button
            class="accordion-button large-accordion-heading dataset-accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#drmetadata"
            aria-expanded="true"
            aria-controls="drmetadata"
          >
            Metadata
          </button>
        </h2>
        <div id="drmetadata" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRMetaData :dataset-id="store.dataSetId" :edit-mode="localEditMode" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 id="headingTwo" class="accordion-header">
          <button
            class="accordion-button collapsed large-accordion-heading dataset-accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#drfiles"
            aria-expanded="false"
            aria-controls="drfiles"
          >
            Files
          </button>
        </h2>
        <div id="drfiles" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#dsAccordion">
          <div class="accordion-body">
            <DRFiles data-type="file" :edit-mode="localEditMode" :dataset-id="store.dataSetId" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal v-if="store.processing" :status-message="store.modalMsg" :progress="store.uploadProgress" :show-progress="store.showProgressBar" />
</template>

<style scoped>

</style>
