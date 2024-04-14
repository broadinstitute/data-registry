<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";

const route = useRoute();
const id = route.params.id;
const store = useDatasetStore();
const reviewStatus = ref("");

const logText = ref(
    "This is a long text that will be displayed in the text box.",
);

onMounted(async () => {
    const response = await store.fetchFileUpload(id);
    logText.value = response.log;
    reviewStatus.value = response.status;
});

async function reviewDataset() {
    await store.reviewDataset(id, reviewStatus.value);
}
</script>

<template>
    <div class="container">
        <div class="row" v-can="'approveUpload'">
            <div class="col col-3">
                <div class="label">Review Status:</div>
                <select
                    class="form-select form-control form-control-sm"
                    v-model="reviewStatus"
                >
                    <option value=""></option>
                    <option value="REVIEW APPROVED">Pass</option>
                    <option value="REVIEW REJECTED">Fail</option>
                </select>
            </div>
            <div class="col col-3 d-flex align-items-end">
                <button
                    :disabled="reviewStatus === ''"
                    class="btn btn-primary"
                    @click="reviewDataset()"
                >
                    Review Dataset
                </button>
            </div>
        </div>
        <div class="grid" v-if="reviewStatus != 'FAILED'">
            <div class="col text-center">
                <Card>
                    <template #title>QQ Plot</template>
                    <template #content>
                        <Image
                            :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/qq_plot.png`"
                            alt="QQ Plot"
                            width="400"
                        />
                    </template>
                </Card>
            </div>

            <div class="col text-center">
                <Card>
                    <template #title>Manhattan Plot</template>
                    <template #content>
                        <Image
                            :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/manhattan_plot.png`"
                            alt="Manhattan Plot"
                            width="400"
                        />
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
                            style="height: 400px; overflow-y: scroll"
                        />
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text-box {
    border: 1px solid #ccc;
    padding: 10px;
}
</style>
