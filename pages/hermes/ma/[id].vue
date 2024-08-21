<template>
    <div class="grid" >
      <div class="col text-center">
        <Card>
          <template #title>QQ Plot</template>
          <template #content>
            <Image
                :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/qq.png`"
                alt="QQ Plot"
                width="400"
                preview
            />
          </template>
        </Card>
      </div>

      <div class="col text-center">
        <Card>
          <template #title>Manhattan Plot</template>
          <template #content>
            <Image
                :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/manhattan.png`"
                alt="Manhattan Plot"
                width="400"
                preview
            />
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
