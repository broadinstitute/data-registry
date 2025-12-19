<template>
  <div class="grid">
    <div class="col mb-4">
      <div class="flex justify-content-between align-items-center">
        <div>
          <Button
            label="Back to Studies"
            icon="pi pi-arrow-left"
            @click="navigateTo('/peg')"
            text
            class="mb-2"
          />
          <h2 class="mb-0">{{ studyData?.name || 'PEG Study' }}</h2>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div class="grid" v-if="loading">
    <div class="col-12">
      <div class="text-center p-4">
        <ProgressSpinner />
        <p>Loading study information...</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="grid" v-else-if="studyData">
    <div class="col-12">
      <!-- Study Metadata -->
      <div class="card p-fluid mb-4">
        <h5>Study Information</h5>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="field">
              <label>Study Name</label>
              <p class="font-semibold">{{ studyData.name }}</p>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label>Accession ID</label>
              <p class="font-semibold">PEG-{{ formatGuid(studyData.id) }}</p>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label>Study Author</label>
              <p>{{ studyData.metadata?.study_author || '-' }}</p>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label>Created</label>
              <p>{{ formatDate(studyData.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div class="card">
        <h5>Uploaded Files</h5>

        <DataTable :value="filesList" class="mt-3">
          <template #empty>
            <div class="text-center p-4 text-gray-500">
              No files uploaded yet
            </div>
          </template>

          <Column field="label" header="File Type" class="font-semibold"></Column>
          <Column field="fileName" header="File Name">
            <template #body="{ data }">
              <span v-if="data.fileName">{{ data.fileName }}</span>
              <span v-else class="text-gray-400">Not uploaded</span>
            </template>
          </Column>
          <Column field="uploadedAt" header="Uploaded">
            <template #body="{ data }">
              <span v-if="data.uploadedAt">
                {{ formatDateTime(data.uploadedAt) }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </Column>
          <Column field="fileSize" header="Size">
            <template #body="{ data }">
              <span v-if="data.fileSize">
                {{ formatFileSize(data.fileSize) }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </Column>
          <Column header="Actions" style="width: 8rem">
            <template #body="{ data }">
              <Button
                v-if="data.fileId"
                icon="pi pi-download"
                severity="secondary"
                text
                rounded
                @click="downloadFile(data.fileId)"
                title="Download file"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div class="grid" v-else>
    <div class="col-12">
      <div class="card text-center p-4">
        <i class="pi pi-exclamation-triangle text-orange-500 mb-3" style="font-size: 3rem"></i>
        <h3>Study Not Found</h3>
        <p class="text-gray-600">The requested PEG study could not be found.</p>
        <Button
          label="Back to Studies"
          icon="pi pi-arrow-left"
          @click="navigateTo('/peg')"
          class="mt-3"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted, computed } from "vue";

definePageMeta({
  layout: 'peg'
});

const route = useRoute();
const store = useDatasetStore();

const studyId = route.params.id;
const loading = ref(true);
const studyData = ref(null);
const filesData = ref([]);

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch study data
    studyData.value = await store.fetchPEGStudy(studyId);

    // Fetch files data
    filesData.value = await store.fetchPEGFiles(studyId);
  } catch (error) {
    console.error('Error fetching PEG study:', error);
    studyData.value = null;
  }
  loading.value = false;
});

const filesList = computed(() => {
  const pegListFile = filesData.value.find(f => f.file_type === 'peg_list');
  const pegMatrixFile = filesData.value.find(f => f.file_type === 'peg_matrix');
  const pegMetadataFile = filesData.value.find(f => f.file_type === 'peg_metadata');

  return [
    {
      label: 'PEG List',
      fileName: pegListFile?.file_name || null,
      uploadedAt: pegListFile?.uploaded_at || null,
      fileSize: pegListFile?.file_size || null,
      uploaded: !!pegListFile,
      fileId: pegListFile?.id || null
    },
    {
      label: 'PEG Matrix',
      fileName: pegMatrixFile?.file_name || null,
      uploadedAt: pegMatrixFile?.uploaded_at || null,
      fileSize: pegMatrixFile?.file_size || null,
      uploaded: !!pegMatrixFile,
      fileId: pegMatrixFile?.id || null
    },
    {
      label: 'PEG Metadata',
      fileName: pegMetadataFile?.file_name || null,
      uploadedAt: pegMetadataFile?.uploaded_at || null,
      fileSize: pegMetadataFile?.file_size || null,
      uploaded: !!pegMetadataFile,
      fileId: pegMetadataFile?.id || null
    }
  ];
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const formatGuid = (guid) => {
  if (!guid) return '-';
  // Convert plain hex string to UUID format with dashes
  // e.g., 0f7af7f752434a2b90d6ffe1683c4241 -> 0f7af7f7-5243-4a2b-90d6-ffe1683c4241
  const cleaned = guid.replace(/-/g, '');
  if (cleaned.length === 32) {
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`;
  }
  return guid; // Return as-is if already formatted or invalid length
};

const downloadFile = async (fileId) => {
  try {
    await store.downloadPEGFile(fileId);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Error downloading file. Please try again.');
  }
};
</script>

<style scoped>
.field label {
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
}

.field p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
}
</style>
