<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, computed } from "vue";
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
  peg_source: yup.string().required().label('PEG Source'),
  gwas_source: yup.string().required().label('GWAS Source'),
  trait_description: yup.string().required().label('Trait Description'),
  trait_ontology_id: yup.string().label('Trait Ontology ID'),
  variant_type: yup.string().required().label('Variant Type'),
  genome_build: yup.string().required().label('Genome Build'),
  variant_information: yup.string().label('Variant Information'),
  gene_information: yup.string().label('Gene Information'),
});

const { defineField, errors, values, validate, resetForm } = useForm({
  validationSchema: formSchema,
});

// Form fields
const [name] = defineField('name');
const [peg_source] = defineField('peg_source');
const [gwas_source] = defineField('gwas_source');
const [trait_description] = defineField('trait_description');
const [trait_ontology_id] = defineField('trait_ontology_id');
const [variant_type] = defineField('variant_type');
const [genome_build] = defineField('genome_build');
const [variant_information] = defineField('variant_information');
const [gene_information] = defineField('gene_information');

// Dropdown options
const genomeBuildOptions = ref([
  { label: 'GRCh37', value: 'GRCh37' },
  { label: 'GRCh38', value: 'GRCh38' },
]);

const variantTypeOptions = ref([
  { label: 'Significant', value: 'significant' },
  { label: 'All', value: 'all' },
]);

// File upload state
const pegListFile = ref(null);
const pegMatrixFile = ref(null);
const pegListInput = ref(null);
const pegMatrixInput = ref(null);

const submitting = ref(false);

// Active accordion sections
const activeAccordionIndex = ref(0);

const isMetadataValid = computed(() => {
  return !!(
    values.name &&
    values.peg_source &&
    values.gwas_source &&
    values.trait_description &&
    values.variant_type &&
    values.genome_build
  );
});

const canSubmit = computed(() => {
  return isMetadataValid.value && pegListFile.value && pegMatrixFile.value;
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

  // Ensure both files are selected
  if (!pegListFile.value || !pegMatrixFile.value) {
    store.errorMessage = 'Both PEG List and PEG Matrix files are required';
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
        peg_source: values.peg_source,
        gwas_source: values.gwas_source,
        trait_description: values.trait_description,
        trait_ontology_id: values.trait_ontology_id || null,
        variant_type: values.variant_type,
        genome_build: values.genome_build,
        variant_information: values.variant_information || null,
        gene_information: values.gene_information || null,
        evidence_streams: [],
        integration_analyses: [],
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

              <Divider />
              <h5>Dataset Description</h5>

              <div class="field">
                <label for="peg_source">PEG Source <span class="text-red-500">*</span></label>
                <InputText
                  id="peg_source"
                  v-model="peg_source"
                  :class="{ 'p-invalid': errors.peg_source }"
                  placeholder="e.g., PMID: 36474045"
                  v-tooltip="'Publication identifier (e.g., PMID, DOI)'"
                />
                <small class="p-error">{{ errors.peg_source }}</small>
              </div>

              <div class="field">
                <label for="gwas_source">GWAS Source <span class="text-red-500">*</span></label>
                <InputText
                  id="gwas_source"
                  v-model="gwas_source"
                  :class="{ 'p-invalid': errors.gwas_source }"
                  placeholder="e.g., GCST90132315"
                  v-tooltip="'GWAS catalog or study identifier'"
                />
                <small class="p-error">{{ errors.gwas_source }}</small>
              </div>

              <div class="field">
                <label for="trait_description">Trait Description <span class="text-red-500">*</span></label>
                <InputText
                  id="trait_description"
                  v-model="trait_description"
                  :class="{ 'p-invalid': errors.trait_description }"
                  placeholder="e.g., coronary artery disease"
                />
                <small class="p-error">{{ errors.trait_description }}</small>
              </div>

              <div class="field">
                <label for="trait_ontology_id">Trait Ontology ID</label>
                <InputText
                  id="trait_ontology_id"
                  v-model="trait_ontology_id"
                  placeholder="e.g., EFO_0001645"
                  v-tooltip="'Optional: EFO, HPO, or other ontology ID'"
                />
              </div>

              <Divider />
              <h5>Genomic Information</h5>

              <div class="field">
                <label for="variant_type">Variant Type <span class="text-red-500">*</span></label>
                <Dropdown
                  id="variant_type"
                  v-model="variant_type"
                  :options="variantTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select variant type"
                  :class="{ 'p-invalid': errors.variant_type }"
                />
                <small class="p-error">{{ errors.variant_type }}</small>
              </div>

              <div class="field">
                <label for="genome_build">Genome Build <span class="text-red-500">*</span></label>
                <Dropdown
                  id="genome_build"
                  v-model="genome_build"
                  :options="genomeBuildOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select genome build"
                  :class="{ 'p-invalid': errors.genome_build }"
                />
                <small class="p-error">{{ errors.genome_build }}</small>
              </div>

              <div class="field">
                <label for="variant_information">Variant Information</label>
                <Textarea
                  id="variant_information"
                  v-model="variant_information"
                  rows="3"
                  placeholder="e.g., 279 significant associations from GWAS meta-analysis"
                />
              </div>

              <div class="field">
                <label for="gene_information">Gene Information</label>
                <Textarea
                  id="gene_information"
                  v-model="gene_information"
                  rows="3"
                  placeholder="e.g., All protein-coding genes within 500 kb of all 279 genome-wide associations"
                />
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
              Upload PEG List and PEG Matrix TSV files. Both files are required and will be validated.
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
                    Expected columns: rsID, Gene, GWAS, FM, PROX, FUNC, QTL, PHEWAS, GENEBASE, PERTUB, DB, Author_conclusion
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
                    Expected columns: rsID, Locus_name, Locus_number, Gene_symbol, GWAS_pvalue, GWAS_beta, FM_PPA, FM_FGWAS_Most_enriched_tissue, PROX, FUNC_VEP_consequence, QTL_eQTL_gtex_pvalue, QTL_eQTL_gtex_slope, QTL_eQTL_gtex_tissue, PHEWAS_ukbb_diseases, GENEBASE_rare5_SKATO, PERTURB_mouse_phenotype, PERTURB_mouse_model, DB_ClinVar, INT_PoPS_score, INT_PoPS_feature1, INT_author_conclusion
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

            <div class="flex justify-content-between align-items-center mt-4">
              <Button
                label="Back to Metadata"
                icon="bi-arrow-left"
                @click="activeAccordionIndex = 0"
                class="p-button-secondary p-button-text"
                :disabled="submitting"
              />
              <div class="flex gap-2">
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
            </div>
            <div v-if="!canSubmit && isMetadataValid" class="text-sm text-gray-500 mt-2 text-right">
              Both PEG List and PEG Matrix files are required
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
