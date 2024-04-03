<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";

const route = useRoute();
const id = route.params.id;
const store = useDatasetStore();

const logText = ref(
    "This is a long text that will be displayed in the text box.",
);

onMounted(async () => {
    const response = await store.fetchFileUpload(id);
    logText.value = response.log;
});
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col col-md-12 mb-4">
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

            <div class="col col-md-12">
                <h3>QQ Plot</h3>
                <img
                    :src="`https://hermes-qc.s3.amazonaws.com/images/${id}/qq_plot.png`"
                    alt="Your Image"
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
