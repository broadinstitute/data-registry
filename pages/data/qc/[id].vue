<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const id = route.params.id;
const store = useDatasetStore();
const reviewStatus = ref("");
const dsName = ref("");
const toast = useToast();
const showReview = ref(true);

const logText = ref(
    "This is a long text that will be displayed in the text box.",
);

onMounted(async () => {
    const response = await store.fetchFileUpload(id);
    logText.value = response.log;
    reviewStatus.value = response.status;
    dsName.value = response.dataset_name;
});

async function reviewDataset(id, value) {
    await store.reviewDataset(id, value);
    toast.add({
        severity: "success",
        summary: "Success",
        detail: "Dataset status updated successfully",
        life: "3000",
    });
    showReview.value = false;
}
</script>

<template>
    <Breadcrumb
        :home="{ icon: 'bi-house', url: '/data/dashboard/' }"
        :model="[{ label: 'Datasets', url: '/data/' }, { label: dsName }]"
        class="mb-3"
    />
    <div class="grid" v-if="reviewStatus != 'FAILED QC'">
        <div class="col text-center">
            <Card>
                <template #title>QQ Plot</template>
                <template #content>
                    <Image
                        :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/qq_plot.png`"
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
                        :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/manhattan_plot.png`"
                        alt="Manhattan Plot"
                        width="400"
                        preview
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

    <div
        class="grid"
        v-can="'approveUpload'"
        v-if="reviewStatus === 'READY FOR REVIEW' && showReview"
    >
        <div class="col-4 col-offset-4 mt-2 mb-4">
            <InputGroup>
                <Button
                    label="Fail"
                    icon="bi-x-lg"
                    severity="danger"
                    @click="reviewDataset(id, 'REVIEW REJECTED')"
                />
                <InputText placeholder="Approve this dataset?" disabled />
                <Button
                    label="Pass"
                    icon="bi-check-lg"
                    severity="success"
                    @click="reviewDataset(id, 'REVIEW APPROVED')"
                />
            </InputGroup>
        </div>
    </div>
    <Toast position="bottom-right" />
</template>

<style scoped>
.text-box {
    border: 1px solid #ccc;
    padding: 10px;
}
</style>
