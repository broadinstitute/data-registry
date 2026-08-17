<script setup>
import MultiSelect from "primevue/multiselect";
import { useDatasetStore } from "~/stores/DatasetStore";
import { composeKpBodyPreview, kpDefaultsFromDataset } from "~/utils/kpDataset";

const props = defineProps({
    datasetId: { type: String },
    editMode: { type: Boolean, default: true },
});
const store = useDatasetStore();
const isReadOnly = computed(() => !props.editMode && !!props.datasetId);

const title = ref("");
const selectedPortals = ref([]);
const experimentSummary = ref("");
const publication = ref("");
const phenotypeNames = ref([]);
const loaded = ref(false);

const preview = computed(() =>
    composeKpBodyPreview(publication.value, phenotypeNames.value, experimentSummary.value));
const canSave = computed(() =>
    title.value.trim().length > 0 && selectedPortals.value.length > 0);

onMounted(async () => {
    await store.fetchKpPortals();
    await store.fetchPhenotypes();
    const dsId = props.datasetId || store.dataSetId;
    if (!dsId) return;
    const info = await store.fetchExistingDataset(dsId);
    publication.value = info.dataset.publication || "";
    phenotypeNames.value = (info.phenotypes || []).map(
        (p) => store.phenotypes[p.phenotype]?.description || p.phenotype);
    const existing = await store.fetchKpDatasetInfo(dsId);
    if (existing) {
        title.value = existing.title;
        selectedPortals.value = existing.portals;
        // A migrated Drupal body is replaced on first save through this form;
        // the summary starts empty so the user writes/pastes the new text
        // deliberately, with the preview showing exactly what will be stored.
        experimentSummary.value = "";
    } else {
        const defaults = kpDefaultsFromDataset(info.dataset);
        title.value = defaults.title;
        experimentSummary.value = defaults.experimentSummary;
    }
    loaded.value = true;
});

async function save() {
    await store.saveKpDatasetInfo({
        dataset_id: props.datasetId || store.dataSetId,
        title: title.value.trim(),
        portals: selectedPortals.value,
        experiment_summary: experimentSummary.value,
    });
}
</script>

<template>
  <div v-if="loaded" class="dr-form">
    <div class="row">
      <div class="col col-8">
        <div class="label">Display title<sup>*</sup></div>
        <input v-model="title" type="text" class="form-control input-default"
               placeholder="e.g., TG to HDL ratio 2024 GWAS: East Asian"
               :disabled="isReadOnly">
      </div>
      <div class="col col-4">
        <div class="label">Portals<sup>*</sup></div>
        <MultiSelect v-model="selectedPortals" :options="store.kpPortals"
                     :maxSelectedLabels="3" placeholder="Select portals"
                     class="w-100" :disabled="isReadOnly" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label">Experiment summary<sup>*</sup></div>
        <textarea v-model="experimentSummary" rows="4" class="form-control"
                  :disabled="isReadOnly" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label">Preview</div>
        <div class="border rounded p-3" v-html="preview" />
      </div>
    </div>
    <button v-if="!isReadOnly" type="button" class="btn btn-primary"
            :disabled="!canSave" @click="save">
      Save portal display
    </button>
  </div>
</template>
