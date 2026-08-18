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
    title.value.trim().length > 0 && selectedPortals.value.length > 0
    && experimentSummary.value.trim().length > 0);

async function loadData() {
    await store.fetchKpPortals();
    await store.fetchPhenotypes();
    const dsId = props.datasetId || store.dataSetId;
    if (!dsId) return;
    const info = await store.fetchDatasetRaw(dsId);
    publication.value = info.dataset.publication || "";
    phenotypeNames.value = (info.phenotypes || []).map(
        (p) => store.phenotypes[p.phenotype]?.description || p.phenotype);
    const existing = await store.fetchKpDatasetInfo(dsId);
    // Only prefill user-editable fields on the first successful load, so a
    // reload triggered by reopening the accordion doesn't clobber in-progress
    // edits. publication/phenotypeNames above are always refreshed so a
    // preview reflects phenotypes uploaded after the initial load.
    if (!loaded.value) {
        if (existing) {
            title.value = existing.title;
            // Legacy portal codes (e.g. mi/bone/mskkp) aren't in the live
            // portal list; keeping them selected would make every save 422
            // with no way to untoggle them.
            selectedPortals.value = existing.portals.filter((p) => store.kpPortals.includes(p));
            // The API parses the summary back out of a body it generated;
            // a migrated hand-authored body has no parse-back and yields
            // null, so the field starts blank and the user writes/pastes
            // the new text deliberately -- replace, not merge.
            experimentSummary.value = existing.experiment_summary || "";
        } else {
            const defaults = kpDefaultsFromDataset(info.dataset);
            title.value = defaults.title;
            experimentSummary.value = defaults.experimentSummary;
        }
    }
    loaded.value = true;
}

onMounted(async () => {
    await loadData();
    const el = document.getElementById("drportal");
    if (el) el.addEventListener("show.bs.collapse", loadData);
});
onUnmounted(() => {
    const el = document.getElementById("drportal");
    if (el) el.removeEventListener("show.bs.collapse", loadData);
});

async function save() {
    try {
        await store.saveKpDatasetInfo({
            dataset_id: props.datasetId || store.dataSetId,
            title: title.value.trim(),
            portals: selectedPortals.value,
            experiment_summary: experimentSummary.value,
        });
    } catch (error) {
        // store surfaces the notification
    }
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
