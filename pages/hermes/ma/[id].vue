<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col">
            <Breadcrumb
                :home="{ icon: 'bi-house', url: '/hermes/' }"
                :model="[
                    { label: 'Meta-Analyses', url: '/hermes/ma/' },
                    { label: id },
                ]"
                class="mb-4"
            />
            <Card>
                <template #content>
                    <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                        <div class="text-surface-700 dark:text-surface-100 text-center">
                            <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">
                                Create a meta analysis.
                            </div>
                            <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">
                                You don't have any meta analysis running. Start
                                by creating a new analysis.
                            </div>
                            <Button
                                label="Meta-Analysis"
                                icon="bi-plus-lg"
                                class="mr-2"
                                @click="router.push('/hermes/ma/new')"
                            ></Button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
  <div class="col text-center">
    <Card>
      <template #title>Meta-Analysis Data</template>
      <template #content>
        <a :href="`${config.public.apiBaseUrl}/api/hermes-ma/results/${id}`"
           target="_blank"
           class="link-primary">
          Download
        </a>
      </template>
    </Card>
  </div>
  <div class="grid">
    <div class="col col-md-12 mb-4">
      <Card>
        <template #title>Log Output</template>
        <template #content>
          <Shiki
              :code="analysis.log"
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

</template>
<script setup>
const route = useRoute();
const id = route.params.id;

import { useDatasetStore } from "~/stores/DatasetStore";
const store = useDatasetStore();
const analysis = ref({});
const config = useRuntimeConfig();


onMounted(async () => {
  await store.fetchPhenotypes();
  analysis.value = await store.fetchMetaAnalysis(id);
});
</script>
