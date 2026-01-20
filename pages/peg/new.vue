<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, computed, onMounted, watch } from "vue";
import { useForm } from 'vee-validate';
import * as yup from 'yup';

definePageMeta({
  layout: 'peg'
});

const route = useRouter();
const store = useDatasetStore();

// Form validation schema
const formSchema = yup.object({
  name: yup.string().required().label('Study Name'),
  study_author: yup.string().required().label('Study Author'),
  phenotype: yup.string().required().label('Phenotype'),
  citation: yup.string().label('Citation'),
});

const { defineField, errors, values, validate, resetForm } = useForm({
  validationSchema: formSchema,
});

// Form fields
const [name] = defineField('name');
const [study_author] = defineField('study_author');
const [phenotype] = defineField('phenotype');
const [citation] = defineField('citation');

// Phenotype autocomplete
const phenotypeObj = ref({});
const filteredPhenotypes = ref([]);
const allPhenotypes = ref([]);

// File upload state
const pegListFile = ref(null);
const pegMatrixFile = ref(null);
const pegMetadataFile = ref(null);
const pegListInput = ref(null);
const pegMatrixInput = ref(null);
const pegMetadataInput = ref(null);

const submitting = ref(false);

// Load phenotypes on mount
onMounted(async () => {
  try {
    const response = await fetch('https://bioindex.hugeamp.org/api/portal/phenotypes?q=md');
    const data = await response.json();
    allPhenotypes.value = data.data;
  } catch (error) {
    console.error('Error fetching phenotypes:', error);
    store.errorMessage = 'Failed to load phenotypes';
    store.showNotification = true;
  }
});

// Active accordion sections
const activeAccordionIndex = ref(0);

const isMetadataValid = computed(() => {
  return !!(values.name && values.study_author && values.phenotype);
});

// Phenotype autocomplete filter function
function filterPhenotypes(event) {
  filteredPhenotypes.value = allPhenotypes.value.filter((p) => {
    if (event.query.length < 2) { return false; }
    const words = event.query.split(" ");
    let matches = 0;
    words.forEach((word) => {
      if (p.description.toLowerCase().includes(word.toLowerCase())) { matches++; }
    });
    return matches === words.length;
  });
}

// Watch for phenotype object changes to update the form value
watch(phenotypeObj, (newValue) => {
  phenotype.value = newValue?.name || '';
});

const canSubmit = computed(() => {
  return isMetadataValid.value && pegListFile.value && pegMatrixFile.value && pegMetadataFile.value;
});

const handlePEGListFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    pegListFile.value = file;
  }
};

const handlePEGMatrixFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    pegMatrixFile.value = file;
  }
};

const removePEGListFile = () => {
  pegListFile.value = null;
  if (pegListInput.value) {
    pegListInput.value.value = '';
  }
};

const removePEGMatrixFile = () => {
  pegMatrixFile.value = null;
  if (pegMatrixInput.value) {
    pegMatrixInput.value.value = '';
  }
};

const handlePEGMetadataFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    pegMetadataFile.value = file;
  }
};

const removePEGMetadataFile = () => {
  pegMetadataFile.value = null;
  if (pegMetadataInput.value) {
    pegMetadataInput.value.value = '';
  }
};

const handleContinueToFiles = async () => {
  const isValid = await validate();

  if (!isValid.valid) {
    return;
  }

  // Move to files accordion
  activeAccordionIndex.value = 1;
};

const handleSubmitStudy = async () => {
  // Validate metadata first
  const isValid = await validate();
  if (!isValid.valid) {
    activeAccordionIndex.value = 0;
    return;
  }

  // Ensure all files are selected
  if (!pegListFile.value || !pegMatrixFile.value || !pegMetadataFile.value) {
    store.errorMessage = 'All three files (PEG List, PEG Matrix, and PEG Metadata) are required';
    store.showNotification = true;
    return;
  }

  submitting.value = true;
  let createdStudyId = null;

  try {
    // Step 1: Create the study with metadata
    const metadata = {
      name: values.name,
      metadata: {
        study_author: values.study_author,
        phenotype: values.phenotype,
        citation: values.citation || '',
      }
    };

    const response = await store.createPEGStudy(metadata);
    createdStudyId = response.id;

    // Step 2: Upload PEG List
    try {
      await store.uploadPEGList(createdStudyId, pegListFile.value);
    } catch (error) {
      console.error('Error uploading PEG List:', error);
      handleUploadError(error, 'PEG List');
      // Rollback: delete the created study
      await rollbackStudy(createdStudyId);
      return;
    }

    // Step 3: Upload PEG Matrix
    try {
      await store.uploadPEGMatrix(createdStudyId, pegMatrixFile.value);
    } catch (error) {
      console.error('Error uploading PEG Matrix:', error);
      handleUploadError(error, 'PEG Matrix');
      // Rollback: delete the created study
      await rollbackStudy(createdStudyId);
      return;
    }

    // Step 4: Upload PEG Metadata
    try {
      await store.uploadPEGMetadata(createdStudyId, pegMetadataFile.value);
    } catch (error) {
      console.error('Error uploading PEG Metadata:', error);
      handleUploadError(error, 'PEG Metadata');
      // Rollback: delete the created study
      await rollbackStudy(createdStudyId);
      return;
    }

    // Success! Redirect to the study detail page
    route.push(`/peg/${createdStudyId}`);

  } catch (error) {
    console.error('Error creating PEG study:', error);

    // Handle error using same pattern as file uploads
    let errorMessage = 'Failed to create PEG study';

    if (error.status === 400 || error.response?.status === 400) {
      const errorData = error.data || error.response?.data;

      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
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
    console.log('Study rolled back successfully');
  } catch (rollbackError) {
    console.error('Error rolling back study:', rollbackError);
    // Don't show error to user - the main error is more important
  }
};

const handleUploadError = (error, fileType) => {
  store.processing = false;

  // Handle server validation errors - same pattern as SGC
  let errorMessage = `Failed to upload ${fileType} file`;

  if (error.status === 400 || error.response?.status === 400) {
    // Server returned validation errors - check both error.data and error.response.data
    const errorData = error.data || error.response?.data;

    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData?.detail) {
      errorMessage = errorData.detail;
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Show error in store notification dialog (consistent with SGC pattern)
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
      <Button
        label="OK"
        icon="pi pi-check"
        @click="store.showNotification = false"
        autofocus
      />
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
            <div class="card">
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

              <div class="field">
                <label for="citation">Citation</label>
                <InputText
                  id="citation"
                  v-model="citation"
                  :class="{ 'p-invalid': errors.citation }"
                  placeholder="e.g., Aragam et al., Nature Genetics, 2021"
                />
                <small class="p-error">{{ errors.citation }}</small>
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
                      <Button
                        icon="bi-x"
                        class="p-button-rounded p-button-text p-button-danger"
                        @click="removePEGListFile"
                      />
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
                      <Button
                        icon="bi-x"
                        class="p-button-rounded p-button-text p-button-danger"
                        @click="removePEGMetadataFile"
                      />
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
                      <Button
                        icon="bi-x"
                        class="p-button-rounded p-button-text p-button-danger"
                        @click="removePEGMatrixFile"
                      />
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
.text-red-500 {
  color: #ef4444;
}

.hidden {
  display: none;
}
</style>
