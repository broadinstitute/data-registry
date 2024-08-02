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
            <div class="col col-span-3">
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
            <div class="col col-span-3 d-flex items-end">
                <button
                    :disabled="reviewStatus === ''"
                    class="btn btn-primary"
                    @click="reviewDataset()"
                >
                    Review Dataset
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col col-md-12 mb-6">
                <h3>Log Output</h3>
                <div
                    class="text-box"
                    style="
                        overflow-y: scroll;
                        height: 400px;
                        white-space: pre-wrap;
                    "
                >
                    <p>{{ logText }}</p>
                </div>
            </div>

            <div class="col-span-6">
                <h3>QQ Plot</h3>
                <img
                    :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/qq_plot.png`"
                    alt="QQ Plot"
                    style="width: 600px; height: 600px; object-fit: contain"
                />
            </div>

            <div class="col-span-6">
                <h3>Manhattan Plot</h3>
                <img
                    :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/manhattan_plot.png`"
                    alt="Manhattan Plot"
                    style="width: 600px; height: 600px; object-fit: contain"
                />
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
