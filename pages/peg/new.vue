<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, computed, onUnmounted, watch } from "vue";
import { useForm } from 'vee-validate';
import * as yup from 'yup';

definePageMeta({
  layout: 'peg'
});

const route = useRouter();
const store = useDatasetStore();

// Form validation schema (name/author/phenotype only — sources handled via refs)
const formSchema = yup.object({
  name: yup.string().required().label('Study Name'),
  study_author: yup.string().required().label('Study Author'),
  phenotype: yup.string().required().label('Phenotype'),
});

const { defineField, errors, values, validate } = useForm({
  validationSchema: formSchema,
});

const [name] = defineField('name');
const [study_author] = defineField('study_author');
const [phenotype] = defineField('phenotype');

// --- PEG Source ---
const pegSourceType = ref(''); // 'published' | 'pre-published' | 'unpublished'
const pegSourceValue = ref('');
const pegSourceOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Pre-published', value: 'pre-published' },
  { label: 'Unpublished', value: 'unpublished' },
];
const pegSourcePlaceholder = computed(() => {
  if (pegSourceType.value === 'published') return 'e.g., 12345678';
  if (pegSourceType.value === 'pre-published') return 'e.g., 10.1038/s41586-021-03819-2';
  return 'Enter pre-print or manuscript info';
});
const pegSourceLabel = computed(() => {
  if (pegSourceType.value === 'published') return 'PMID';
  if (pegSourceType.value === 'pre-published') return 'DOI';
  return 'Description';
});
watch(pegSourceType, () => { pegSourceValue.value = ''; });

// --- GWAS Source ---
// 'catalog' | 'portal' | 'same' | 'pre-published' | 'unpublished'
const gwasSourceType = ref('');
const gwasSourceValue = ref('');
watch(gwasSourceType, () => { gwasSourceValue.value = ''; });

const gwasSourcePlaceholder = computed(() => {
  if (gwasSourceType.value === 'catalog') return 'e.g., GCST90002409';
  if (gwasSourceType.value === 'portal') return 'e.g., https://biobank.ndph.ox.ac.uk/';
  if (gwasSourceType.value === 'published') return 'e.g., 12345678';
  if (gwasSourceType.value === 'pre-published') return 'e.g., 10.1038/s41586-021-03819-2';
  return 'Enter manuscript or pre-print info';
});

const effectiveGwasValue = computed(() => {
  if (gwasSourceType.value === 'same') return pegSourceValue.value;
  return gwasSourceValue.value;
});

// --- Validation ---
const isPegSourceValid = computed(() => !!(pegSourceType.value && pegSourceValue.value));
const isGwasSourceValid = computed(() => {
  if (!gwasSourceType.value) return false;
  if (gwasSourceType.value === 'same') return !!pegSourceValue.value;
  return !!gwasSourceValue.value;
});

// Phenotype autocomplete
const phenotypeObj = ref({});
const filteredPhenotypes = ref([]);
const phenotypeIsCustom = ref(false);
let _phenotypeTimer = null;
let _phenotypeAbort = null;

// File upload state
const pegListFile = ref(null);
const pegMatrixFile = ref(null);
const pegMetadataFile = ref(null);
const pegListInput = ref(null);
const pegMatrixInput = ref(null);
const pegMetadataInput = ref(null);

const submitting = ref(false);
const activeAccordionIndex = ref(0);

const isMetadataValid = computed(() => {
  return !!(values.name && values.study_author && values.phenotype && isPegSourceValid.value && isGwasSourceValid.value);
});

function filterPhenotypes(event) {
  if (event.query.length < 2) {
    filteredPhenotypes.value = [];
    return;
  }
  clearTimeout(_phenotypeTimer);
  _phenotypeTimer = setTimeout(async () => {
    if (_phenotypeAbort) _phenotypeAbort.abort();
    _phenotypeAbort = new AbortController();
    try {
      const response = await fetch(
        `https://www.ebi.ac.uk/ols4/api/search?q=${encodeURIComponent(event.query)}&ontology=mondo&type=class&isObsolete=false&isDefiningOntology=true&rows=20`,
        { signal: _phenotypeAbort.signal }
      );
      if (!response.ok) throw new Error(`OLS4 search failed: ${response.status}`);
      const data = await response.json();
      filteredPhenotypes.value = (data.response?.docs || [])
        .filter(doc => doc.obo_id?.startsWith('MONDO:'))
        .map(doc => ({
          name: doc.obo_id,
          description: doc.label,
        }));
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error searching MONDO phenotypes:', error);
      filteredPhenotypes.value = [];
    }
  }, 300);
}

onUnmounted(() => {
  clearTimeout(_phenotypeTimer);
  if (_phenotypeAbort) _phenotypeAbort.abort();
});

watch(phenotypeObj, (newValue) => {
  if (typeof newValue === 'string') {
    phenotype.value = newValue;
    phenotypeIsCustom.value = true;
  } else {
    phenotype.value = newValue?.name || '';
    phenotypeIsCustom.value = false;
  }
});

const canSubmit = computed(() => {
  return isMetadataValid.value && pegListFile.value && pegMatrixFile.value && pegMetadataFile.value;
});

const handlePEGListFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) pegListFile.value = file;
};
const handlePEGMatrixFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) pegMatrixFile.value = file;
};
const handlePEGMetadataFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) pegMetadataFile.value = file;
};

const removePEGListFile = () => {
  pegListFile.value = null;
  if (pegListInput.value) pegListInput.value.value = '';
};
const removePEGMatrixFile = () => {
  pegMatrixFile.value = null;
  if (pegMatrixInput.value) pegMatrixInput.value.value = '';
};
const removePEGMetadataFile = () => {
  pegMetadataFile.value = null;
  if (pegMetadataInput.value) pegMetadataInput.value.value = '';
};

const handleContinueToFiles = async () => {
  const isValid = await validate();
  if (!isValid.valid || !isPegSourceValid.value || !isGwasSourceValid.value) return;
  activeAccordionIndex.value = 1;
};

const handleSubmitStudy = async () => {
  const isValid = await validate();
  if (!isValid.valid || !isPegSourceValid.value || !isGwasSourceValid.value) {
    activeAccordionIndex.value = 0;
    return;
  }

  if (!pegListFile.value || !pegMatrixFile.value || !pegMetadataFile.value) {
    store.errorMessage = 'All three files (PEG List, PEG Matrix, and PEG Metadata) are required';
    store.showNotification = true;
    return;
  }

  submitting.value = true;
  let createdStudyId = null;

  try {
    const metadata = {
      name: values.name,
      metadata: {
        study_author: values.study_author,
        phenotype: values.phenotype,
        citation: pegSourceValue.value,
        published: pegSourceType.value,
        publication_ref: pegSourceValue.value,
        gwas_source: effectiveGwasValue.value,
        gwas_source_type: gwasSourceType.value === 'same' ? 'same_as_pgs' : gwasSourceType.value,
        phenotype_is_custom: phenotypeIsCustom.value,
      }
    };

    const response = await store.createPEGStudy(metadata);
    createdStudyId = response.id;

    try {
      await store.uploadPEGList(createdStudyId, pegListFile.value);
    } catch (error) {
      handleUploadError(error, 'PEG List');
      await rollbackStudy(createdStudyId);
      return;
    }

    try {
      await store.uploadPEGMatrix(createdStudyId, pegMatrixFile.value);
    } catch (error) {
      handleUploadError(error, 'PEG Matrix');
      await rollbackStudy(createdStudyId);
      return;
    }

    try {
      await store.uploadPEGMetadata(createdStudyId, pegMetadataFile.value);
    } catch (error) {
      handleUploadError(error, 'PEG Metadata');
      await rollbackStudy(createdStudyId);
      return;
    }

    route.push(`/peg/${createdStudyId}`);

  } catch (error) {
    console.error('Error creating PEG study:', error);
    let errorMessage = 'Failed to create PEG study';
    if (error.status === 400 || error.response?.status === 400) {
      const errorData = error.data || error.response?.data;
      if (typeof errorData === 'string') errorMessage = errorData;
      else if (errorData?.detail) errorMessage = errorData.detail;
      else if (errorData?.message) errorMessage = errorData.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    store.errorMessage = errorMessage;
    store.showNotification = true;
  } finally {
    submitting.value = false;
  }
};

const rollbackStudy = async (studyId) => {
  try {
    await store.deletePEGStudy(studyId);
  } catch (rollbackError) {
    console.error('Error rolling back study:', rollbackError);
  }
};

const handleUploadError = (error, fileType) => {
  store.processing = false;
  let errorMessage = `Failed to upload ${fileType} file`;
  if (error.status === 400 || error.response?.status === 400) {
    const errorData = error.data || error.response?.data;
    if (typeof errorData === 'string') errorMessage = errorData;
    else if (errorData?.detail) errorMessage = errorData.detail;
    else if (errorData?.message) errorMessage = errorData.message;
  } else if (error.message) {
    errorMessage = error.message;
  }
  store.errorMessage = errorMessage;
  store.showNotification = true;
};

const handleCancel = () => {
  route.push('/peg');
};
</script>

<template>
  <!-- Processing Dialog -->
  <Dialog
    v-if="store.processing || submitting"
    :visible="true"
    :header="store.modalMsg || 'Processing...'"
    :closable="false"
    :modal="true"
    :draggable="false"
    :resizable="false"
  >
    <ProgressSpinner />
  </Dialog>

  <!-- Error Dialog -->
  <Dialog
    v-model:visible="store.showNotification"
    modal
    header="Error"
    :style="{ width: '600px' }"
    :closable="true"
    @hide="store.showNotification = false"
  >
    <div class="flex align-items-start">
      <i class="pi pi-exclamation-triangle text-red-500 mr-3 mt-1" style="font-size: 2rem"></i>
      <div class="flex-1">
        <p class="text-lg mb-3">{{ store.errorMessage }}</p>
      </div>
    </div>
    <template #footer>
      <Button label="OK" icon="pi pi-check" @click="store.showNotification = false" autofocus />
    </template>
  </Dialog>

  <div class="grid">
    <div class="col mb-4">
      <h2 class="text-center mb-4">Create New PEG Study</h2>
      <p class="text-center text-gray-600">
        Enter metadata and upload files for your Prioritized Evidence Gene study
      </p>
    </div>
  </div>

  <div class="grid">
    <div class="col-12 md:col-10 md:col-offset-1">
      <Accordion :activeIndex="activeAccordionIndex" @update:activeIndex="activeAccordionIndex = $event">
        <!-- Metadata Accordion Section -->
        <AccordionTab header="Study Metadata">
          <div class="p-fluid">

            <!-- Study Info Card -->
            <div class="card mb-4">
              <h5>Study Information</h5>

              <div class="field">
                <label for="name">Study Name <span class="text-red-500">*</span></label>
                <InputText
                  id="name"
                  v-model="name"
                  :class="{ 'p-invalid': errors.name }"
                  placeholder="e.g., Aragam2021_CAD"
                />
                <small class="p-error">{{ errors.name }}</small>
              </div>

              <div class="field">
                <label for="study_author">Study Author <span class="text-red-500">*</span></label>
                <InputText
                  id="study_author"
                  v-model="study_author"
                  :class="{ 'p-invalid': errors.study_author }"
                  placeholder="e.g., John Doe"
                />
                <small class="p-error">{{ errors.study_author }}</small>
              </div>

              <div class="field">
                <label for="phenotype">Phenotype <span class="text-red-500">*</span></label>
                <AutoComplete
                  id="phenotype"
                  v-model="phenotypeObj"
                  :suggestions="filteredPhenotypes"
                  optionLabel="description"
                  placeholder="Type to search phenotypes"
                  @complete="filterPhenotypes"
                  :class="{ 'p-invalid': errors.phenotype }"
                />
                <small class="p-error">{{ errors.phenotype }}</small>
              </div>
            </div>

            <!-- Sources Card -->
            <div class="card mb-4">
              <h5>Sources</h5>

              <!-- PEG Source -->
              <div class="field">
                <div class="flex align-items-center gap-2 mb-2">
                  <span class="source-badge source-badge--pgs">PGS SOURCE</span>
                  <label class="mb-0">Publication <span class="text-red-500">*</span></label>
                </div>
                <SelectButton
                  v-model="pegSourceType"
                  :options="pegSourceOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="mb-3"
                />
                <div v-if="pegSourceType" class="mt-1">
                  <InputText
                    v-model="pegSourceValue"
                    :placeholder="pegSourcePlaceholder"
                    class="w-full"
                    :class="{ 'p-invalid': pegSourceType && !pegSourceValue }"
                  />
                  <small v-if="pegSourceType === 'published'" class="text-gray-400 block">PubMed ID of the paper.</small>
                  <small v-else-if="pegSourceType === 'pre-published'" class="text-gray-400 block">DOI of the pre-print.</small>
                  <small class="text-gray-400 block">The paper describing this predicted effector gene.</small>
                </div>
              </div>

              <Divider />

              <!-- GWAS Source -->
              <div class="field">
                <div class="flex align-items-center gap-2 mb-2">
                  <span class="source-badge source-badge--gwas">GWAS SOURCE</span>
                  <label class="mb-0">GWAS Data Source <span class="text-red-500">*</span></label>
                </div>

                <div class="mb-1">
                  <span class="source-group-label">Preferred</span>
                  <div class="flex gap-2 flex-wrap mt-1">
                    <button
                      v-for="opt in [
                        { value: 'catalog', label: 'GWAS Catalog ID' },
                        { value: 'portal', label: 'Knowledge Portal' },
                        { value: 'same', label: 'Same as PGS source' },
                      ]"
                      :key="opt.value"
                      type="button"
                      class="source-chip"
                      :class="{ 'source-chip--active': gwasSourceType === opt.value }"
                      @click="gwasSourceType = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <div class="mt-3 mb-1">
                  <span class="source-group-label source-group-label--fallback">If unavailable above</span>
                  <div class="flex gap-2 flex-wrap mt-1">
                    <button
                      v-for="opt in [
                        { value: 'published', label: 'Published (PMID)' },
                        { value: 'pre-published', label: 'Pre-published (DOI)' },
                        { value: 'unpublished', label: 'Unpublished' },
                      ]"
                      :key="opt.value"
                      type="button"
                      class="source-chip source-chip--fallback"
                      :class="{ 'source-chip--active': gwasSourceType === opt.value }"
                      @click="gwasSourceType = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Conditional GWAS inputs -->
                <div v-if="gwasSourceType === 'catalog'" class="mt-3">
                  <InputText
                    v-model="gwasSourceValue"
                    placeholder="e.g., GCST90002409"
                    class="w-full"
                    :class="{ 'p-invalid': !gwasSourceValue }"
                  />
                  <small class="text-gray-400">Preferred — find it at ebi.ac.uk/gwas</small>
                </div>

                <div v-else-if="gwasSourceType === 'portal'" class="mt-3">
                  <Message severity="warn" :closable="false" class="mb-2 text-sm">
                    Use only when a GWAS Catalog ID is not available
                  </Message>
                  <InputText
                    v-model="gwasSourceValue"
                    :placeholder="gwasSourcePlaceholder"
                    class="w-full"
                    :class="{ 'p-invalid': !gwasSourceValue }"
                  />
                  <small class="text-gray-400">Knowledge portal URL</small>
                </div>

                <div v-else-if="gwasSourceType === 'same'" class="mt-3">
                  <Message severity="warn" :closable="false" class="mb-2 text-sm">
                    Last resort — use only when no catalog ID or portal is available
                  </Message>
                  <div class="p-3 surface-100 border-round">
                    <small class="text-gray-500 block mb-1">Will inherit from PGS source:</small>
                    <span v-if="pegSourceValue" class="font-semibold">{{ pegSourceValue }}</span>
                    <span v-else class="text-gray-400 italic">Fill in PGS source above first</span>
                  </div>
                </div>

                <div v-else-if="gwasSourceType === 'published'" class="mt-3">
                  <InputText
                    v-model="gwasSourceValue"
                    :placeholder="gwasSourcePlaceholder"
                    class="w-full"
                    :class="{ 'p-invalid': !gwasSourceValue }"
                  />
                  <small class="text-gray-400">PubMed ID of the paper.</small>
                </div>

                <div v-else-if="gwasSourceType === 'pre-published'" class="mt-3">
                  <InputText
                    v-model="gwasSourceValue"
                    :placeholder="gwasSourcePlaceholder"
                    class="w-full"
                    :class="{ 'p-invalid': !gwasSourceValue }"
                  />
                  <small class="text-gray-400">DOI</small>
                </div>

                <div v-else-if="gwasSourceType === 'unpublished'" class="mt-3">
                  <InputText
                    v-model="gwasSourceValue"
                    :placeholder="gwasSourcePlaceholder"
                    class="w-full"
                    :class="{ 'p-invalid': !gwasSourceValue }"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <Button
                label="Continue to Files"
                icon="bi-arrow-right"
                @click="handleContinueToFiles"
                class="p-button-primary"
                :disabled="!isMetadataValid"
              />
            </div>
            <div v-if="!isMetadataValid" class="text-sm text-gray-500 mt-2 text-right">
              Please fill in all required fields to continue
            </div>
          </div>
        </AccordionTab>

        <!-- Files Accordion Section -->
        <AccordionTab header="File Uploads">
          <div class="card p-fluid">
            <Message v-if="!isMetadataValid" severity="warn" :closable="false" class="mb-4">
              Please complete the metadata section first before uploading files.
            </Message>

            <p class="mb-4 text-gray-600">
              Upload PEG List and PEG Matrix (TSV files), and PEG Metadata (XLSX file with multiple sheets).
            </p>

            <!-- PEG List Upload -->
            <div class="field">
              <label for="peg-list">PEG List (TSV)</label>
              <div class="flex gap-2 align-items-start">
                <div class="flex-grow-1">
                  <input
                    ref="pegListInput"
                    type="file"
                    id="peg-list"
                    accept=".tsv,.txt"
                    @change="handlePEGListFileSelect"
                    class="hidden"
                  />
                  <Button
                    label="Choose PEG List File"
                    icon="bi-upload"
                    class="p-button-outlined w-full"
                    @click="$refs.pegListInput.click()"
                  />
                  <small class="block mt-2 text-gray-600">
                    <i class="bi-info-circle mr-1"></i>Typical columns include: rsID, Gene, GWAS, FM, PROX, FUNC, QTL, PHEWAS, GENEBASE, PERTUB, DB, Author_conclusion
                  </small>
                  <div v-if="pegListFile" class="mt-2 p-3 surface-100 border-round">
                    <div class="flex justify-content-between align-items-center">
                      <span class="font-semibold">{{ pegListFile.name }}</span>
                      <Button icon="bi-x" class="p-button-rounded p-button-text p-button-danger" @click="removePEGListFile" />
                    </div>
                    <small class="text-gray-600">{{ (pegListFile.size / 1024).toFixed(2) }} KB</small>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <!-- PEG Metadata Upload -->
            <div class="field">
              <label for="peg-metadata">PEG Metadata (XLSX)</label>
              <div class="flex gap-2 align-items-start">
                <div class="flex-grow-1">
                  <input
                    ref="pegMetadataInput"
                    type="file"
                    id="peg-metadata"
                    accept=".xlsx"
                    @change="handlePEGMetadataFileSelect"
                    class="hidden"
                  />
                  <Button
                    label="Choose PEG Metadata File"
                    icon="bi-upload"
                    class="p-button-outlined w-full"
                    @click="$refs.pegMetadataInput.click()"
                  />
                  <small class="block mt-2 text-gray-600">
                    <i class="bi-info-circle mr-1"></i>Excel file with multiple sheets (Dataset_description, Genomic_identifier, Evidence, Integration, source, method)
                  </small>
                  <div v-if="pegMetadataFile" class="mt-2 p-3 surface-100 border-round">
                    <div class="flex justify-content-between align-items-center">
                      <span class="font-semibold">{{ pegMetadataFile.name }}</span>
                      <Button icon="bi-x" class="p-button-rounded p-button-text p-button-danger" @click="removePEGMetadataFile" />
                    </div>
                    <small class="text-gray-600">{{ (pegMetadataFile.size / 1024).toFixed(2) }} KB</small>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <!-- PEG Matrix Upload -->
            <div class="field">
              <label for="peg-matrix">PEG Matrix (TSV)</label>
              <div class="flex gap-2 align-items-start">
                <div class="flex-grow-1">
                  <input
                    ref="pegMatrixInput"
                    type="file"
                    id="peg-matrix"
                    accept=".tsv,.txt"
                    @change="handlePEGMatrixFileSelect"
                    class="hidden"
                  />
                  <Button
                    label="Choose PEG Matrix File"
                    icon="bi-upload"
                    class="p-button-outlined w-full"
                    @click="$refs.pegMatrixInput.click()"
                  />
                  <small class="block mt-2 text-gray-600">
                    <i class="bi-info-circle mr-1"></i>Typical columns include: rsID, Locus_name, Locus_number, Gene_symbol, GWAS_pvalue, GWAS_beta, FM_PPA, FM_FGWAS_Most_enriched_tissue, PROX, FUNC_VEP_consequence, QTL_eQTL_gtex_pvalue, QTL_eQTL_gtex_slope, QTL_eQTL_gtex_tissue, PHEWAS_ukbb_diseases, GENEBASE_rare5_SKATO, PERTURB_mouse_phenotype, PERTURB_mouse_model, DB_ClinVar, INT_PoPS_score, INT_PoPS_feature1, INT_author_conclusion
                  </small>
                  <div v-if="pegMatrixFile" class="mt-2 p-3 surface-100 border-round">
                    <div class="flex justify-content-between align-items-center">
                      <span class="font-semibold">{{ pegMatrixFile.name }}</span>
                      <Button icon="bi-x" class="p-button-rounded p-button-text p-button-danger" @click="removePEGMatrixFile" />
                    </div>
                    <small class="text-gray-600">{{ (pegMatrixFile.size / 1024).toFixed(2) }} KB</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <Button
                label="Cancel"
                icon="bi-x-circle"
                @click="handleCancel"
                class="p-button-secondary p-button-outlined"
                :disabled="submitting"
              />
              <Button
                label="Submit Study"
                icon="bi-check-circle"
                @click="handleSubmitStudy"
                :loading="submitting"
                :disabled="!canSubmit"
                class="p-button-primary"
              />
            </div>
            <div v-if="!canSubmit && isMetadataValid" class="text-sm text-gray-500 mt-2 text-right">
              All three files (PEG List, PEG Matrix, and PEG Metadata) are required
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<style scoped>
/* Fix: The aura theme adds a white ::before inset box on the highlighted SelectButton,
   while the lara-light-blue theme (loaded later) overrides the label color to white.
   White text on a white ::before box = invisible. Fix both issues:
   - z-index: 1 ensures the label stacks above the ::before pseudo-element
   - explicit dark color on the highlighted state overrides the lara white-text rule */
:deep(.p-selectbutton .p-button .p-button-label),
:deep(.p-selectbutton .p-button .pi) {
  position: relative;
  z-index: 1;
}

:deep(.p-selectbutton .p-button.p-highlight .p-button-label),
:deep(.p-selectbutton .p-button.p-highlight .pi) {
  color: #1e293b;
}

.text-red-500 {
  color: #ef4444;
}

.hidden {
  display: none;
}

.source-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.source-badge--pgs {
  background: #ede9fe;
  color: #7c3aed;
}

.source-badge--gwas {
  background: #fef3c7;
  color: #b45309;
}

.source-group-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6366f1;
}

.source-group-label--fallback {
  color: #d97706;
}

.source-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  border: 1.5px solid #d1d5db;
  background: transparent;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #374151;
}

.source-chip:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.source-chip--active {
  border-color: #6366f1;
  background: #6366f1;
  color: #ffffff;
}

.source-chip--fallback {
  border-color: #d1d5db;
}

.source-chip--fallback:hover {
  border-color: #d97706;
  color: #d97706;
}

.source-chip--fallback.source-chip--active {
  border-color: #d97706;
  background: #d97706;
  color: #ffffff;
}
</style>
