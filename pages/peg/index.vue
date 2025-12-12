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

          <Column field="metadata.trait_description" header="Trait" sortable>
            <template #body="{ data }">
              {{ data.metadata?.trait_description || '-' }}
            </template>
          </Column>

          <Column field="metadata.genome_build" header="Genome Build" sortable>
            <template #body="{ data }">
              <Tag :value="data.metadata?.genome_build || 'N/A'" severity="info" />
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
