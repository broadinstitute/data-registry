<script setup>
import { useDatasetStore } from '~/stores/DatasetStore';
import { useUserStore } from '~/stores/UserStore';
import { useToast } from 'primevue/usetoast';

const store = useDatasetStore();
const userStore = useUserStore();
const toast = useToast();

const currentBuild = ref(null);
const selectedBuild = ref(null);
const saving = ref(false);

const buildOptions = [
  { name: 'GRCh37 / hg19', value: 'hg19' },
  { name: 'GRCh38 / hg38', value: 'grch38' },
];

const isAdmin = computed(() => userStore.user?.roles?.includes('admin'));

onMounted(async () => {
  if (!isAdmin.value) {
    return navigateTo('/hermes');
  }
  const config = await store.getPortalConfig();
  currentBuild.value = config?.target_genome_build ?? null;
  selectedBuild.value = currentBuild.value;
});

async function saveBuild() {
  if (!selectedBuild.value) return;
  saving.value = true;
  try {
    const result = await store.updatePortalConfig(selectedBuild.value);
    currentBuild.value = result.target_genome_build;
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Portal target build updated.', life: 3000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update portal target build.', life: 5000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="isAdmin" class="grid">
    <div class="col-6 col-offset-3">
      <Card>
        <template #title>Portal Liftover Configuration</template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div>
              <strong>Current target genome build:</strong>
              {{ currentBuild ? buildOptions.find(o => o.value === currentBuild)?.name ?? currentBuild : 'Not set' }}
            </div>
            <div class="field">
              <label for="targetBuild">Set target genome build</label>
              <Dropdown
                id="targetBuild"
                v-model="selectedBuild"
                :options="buildOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select target build"
                class="w-full mt-1"
              />
            </div>
            <Button
              label="Save"
              icon="bi-save"
              :loading="saving"
              :disabled="!selectedBuild || selectedBuild === currentBuild"
              @click="saveBuild"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
  <Toast position="top-center" />
</template>
