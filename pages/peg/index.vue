<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted } from "vue";

definePageMeta({
  layout: 'peg'
});

const route = useRouter();
const store = useDatasetStore();
const studies = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    studies.value = await store.fetchPEGStudies();
  } catch (error) {
    console.error('Error fetching PEG studies:', error);
    studies.value = [];
  }
  loading.value = false;
});

const viewStudy = (studyId) => {
  route.push(`/peg/${studyId}`);
};

const createStudy = () => {
  route.push('/peg/new');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatGuid = (guid) => {
  if (!guid) return '-';
  // Convert plain hex string to UUID format with dashes
  const cleaned = guid.replace(/-/g, '');
  if (cleaned.length === 32) {
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`;
  }
  return guid;
};
</script>

<template>
  <div class="grid">
    <div class="col mb-4">
      <div class="flex justify-content-between align-items-center">
        <h2>PEG Studies</h2>
        <Button 
          label="Create New Study" 
          icon="bi-plus-circle"
          @click="createStudy"
          class="p-button-primary"
        />
      </div>
      <p class="text-gray-600 mt-2">
        Prioritized Evidence Gene (PEG) studies with gene prioritization data
      </p>
    </div>
  </div>

  <div class="grid">
    <div class="col-12">
      <div class="card">
        <DataTable 
          :value="studies" 
          :loading="loading"
          paginator 
          :rows="10"
          dataKey="id"
          stripedRows
          :rowHover="true"
        >
          <template #empty>
            <div class="text-center p-4">
              <i class="bi-folder text-4xl text-gray-400 mb-3"></i>
              <p class="text-gray-600">No PEG studies found</p>
              <Button 
                label="Create Your First Study" 
                icon="bi-plus-circle"
                @click="createStudy"
                class="p-button-outlined mt-2"
              />
            </div>
          </template>

          <Column field="name" header="Study Name" sortable>
            <template #body="{ data }">
              <NuxtLink
                :to="`/peg/${data.id}`"
                class="text-primary cursor-pointer font-medium"
              >
                {{ data.name }}
              </NuxtLink>
            </template>
          </Column>

          <Column field="id" header="Accession ID" sortable>
            <template #body="{ data }">
              <span class="font-mono text-sm">PEG-{{ formatGuid(data.id) }}</span>
            </template>
          </Column>

          <Column field="metadata.study_author" header="Author" sortable>
            <template #body="{ data }">
              {{ data.metadata?.study_author || '-' }}
            </template>
          </Column>

          <Column field="created_at" header="Created" sortable>
            <template #body="{ data }">
              {{ formatDate(data.created_at) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
