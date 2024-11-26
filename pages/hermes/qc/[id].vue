<script setup>
import { useDatasetStore } from '~/stores/DatasetStore';
import { useToast } from 'primevue/usetoast';


const route = useRoute();
const id = route.params.id;
const store = useDatasetStore();
const reviewStatus = ref('');
const dsName = ref('');
const toast = useToast();
const showReview = ref(true);
const indels = ref(null);
const adjustment = ref(null);
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const config = useRuntimeConfig();

const logText = ref(
    'This is a long text that will be displayed in the text box.'
);

const downloadUrl = computed(() => `${config.public.apiBaseUrl}/api/hermes/download/${id}`);

const formSchema = yup.object({
  frequencyDifferential: yup.number().label("Frequency Differential").min(0).max(1).required(),
  infoThreshold: yup.number().label("Info Threshold").min(0).max(1).nullable()
      .transform((value) => (isNaN(value) ? null : value))
});

const { defineField, errors, validate } = useForm({
  validationSchema: formSchema,
});

const [frequencyDifferential] = defineField('frequencyDifferential');
const [infoThreshold] = defineField('infoThreshold');


onMounted(async () => {
  const response = await store.fetchFileUpload(id);
  logText.value = response.log;
  reviewStatus.value = response.status;
  dsName.value = response.dataset_name;
  const scriptOptions = response.qc_script_options;
  indels.value = scriptOptions.noind ?? false;
  adjustment.value = !scriptOptions.adj ? 'no adjustment' : scriptOptions.adj;
  frequencyDifferential.value = scriptOptions.fd;
  if (scriptOptions.it) {
    infoThreshold.value = scriptOptions.it;
  }
});

function openDownloadLink() {
  window.open(downloadUrl.value, '_blank');
}

async function rerunQC() {
  const validationResult = await validate();

  if(!validationResult.valid){
    return;
  }

  const scriptOptions = {
    fd: frequencyDifferential.value,
    ...(indels.value && {noind: true}),
    ...(adjustment.value !== 'no adjustment' && { adj : adjustment.value }),
    ...(infoThreshold.value && { it: infoThreshold.value })
  };

  try {
    await store.rerunQC(id, scriptOptions);
    reviewStatus.value = 'SUBMITTED TO QC';
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'QC Job Re-submitted for this dataset',
      life: '5000'
    });
  } catch (error) {
    console.error('Error running QC:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to rerun QC for this dataset',
      life: '5000'
    });
  }


}

async function reviewDataset(id, value) {
  await store.reviewDataset(id, value);
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Dataset status updated successfully',
    life: '3000'
  });
  showReview.value = false;
}
</script>

<template>
  <div class="flex justify-content-between align-items-center mb-3">
  <Breadcrumb
      :home="{ icon: 'bi-house', url: '/hermes/dashboard/' }"
      :model="[{ label: 'Datasets', url: '/hermes/' }, { label: dsName }]"
      class="mb-3"
  />
  <Button v-can="'approveUpload'"
      label="Download Dataset"
      icon="bi-download"
      class="w-auto"
      @click="openDownloadLink"
  />
  </div>
  <div class="grid" v-can="'approveUpload'">
    <div class="col col-md-12 mb-4">
      <Card>
        <template #title>QC Settings</template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="w-full">
              <label class="block mb-2">Adjustment</label>
              <Dropdown
                  v-model="adjustment"
                  :options="['no adjustment', 'lambda', 'ldsc']"
                  placeholder="Select Adjustment"
                  class="w-full"
              />
            </div>
            <div class="w-full">
              <label class="block mb-2">Remove Indel Alleles</label>
              <Dropdown
                  v-model="indels"
                  :options="[{ value: true, text: 'yes' }, { value: false, text: 'no' }]"
                  optionLabel="text"
                  optionValue="value"
                  placeholder="Remove Indel Alleles"
                  class="w-full"
              />
            </div>
            <div class="w-full">
              <label class="block mb-2">Frequency Differential</label>
              <InputText type="number"
                  v-model="frequencyDifferential"
                  placeholder="Frequency Differential"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  class="w-full"
                  v-tooltip.top="'Retain variants with GWAS:REF allele frequency different less than the value specified'"
                  :class="{ 'p-invalid': errors.frequencyDifferential }"
              />
              <small class="p-error" v-if="errors.frequencyDifferential">
                {{ errors.frequencyDifferential }}
              </small>
            </div>
            <div class="w-full">
              <label class="block mb-2">Info Threshold</label>
              <InputText type="number"
                         v-model="infoThreshold"
                         placeholder="Info Threshold (optional)"
                         :min="0"
                         :max="1"
                         :step="0.01"
                         class="w-full"
                         v-tooltip.top="'Retain variants with info score greater than'"
                         :class="{ 'p-invalid': errors.infoThreshold }"
              />
              <small class="p-error" v-if="errors.infoThreshold">
                {{ errors.infoThreshold }}
              </small>
            </div>
            <div class="w-full" >
              <Button
                  label="Re-run QC"
                  icon="bi-arrow-clockwise"
                  class="w-full"
                  @click="rerunQC"
                  :disabled="reviewStatus === 'SUBMITTED TO QC'"
              />
              </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div class="grid" v-if="!['FAILED QC', 'SUBMITTED TO QC'].includes(reviewStatus)">
    <div class="col col-md-12 mb-4">
      <Card>
        <template #title>QC Report</template>
        <template #content>
          <iframe
              :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/gwas_qc.html`"
              style="width: 100%; height: 600px;">
          </iframe>
        </template>
      </Card>
    </div>
  </div>
  <div class="grid">
    <div class="col col-md-12 mb-4">
      <Card>
        <template #title>Log Output</template>
        <template #content>
          <Shiki
              :code="logText"
              lang="r"
              :theme="'nord'"
              style="
                            height: 400px;
                            overflow-y: scroll;
                            white-space: pre-wrap;
                        "
          />
        </template>
      </Card>
    </div>
  </div>

  <div class="grid" v-can="'approveUpload'" v-if="reviewStatus === 'READY FOR REVIEW' && showReview">
    <div class="col-4 col-offset-4 mt-2 mb-4">
      <InputGroup>
        <Button
            label="Fail"
            icon="bi-x-lg"
            severity="danger"
            @click="reviewDataset(id, 'REVIEW REJECTED')"
        />
        <InputText placeholder="Approve this dataset?" disabled/>
        <Button
            label="Pass"
            icon="bi-check-lg"
            severity="success"
            @click="reviewDataset(id, 'REVIEW APPROVED')"
        />
      </InputGroup>
    </div>
  </div>
  <Toast position="bottom-right"/>
</template>


