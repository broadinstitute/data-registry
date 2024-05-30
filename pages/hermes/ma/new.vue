<template>
    <h2>+ New Meta-Analysis</h2>
    <div class="card">
        <Stepper orientation="vertical">
            <StepperPanel header="Select Phenotype">
                <template #content="{ nextCallback }">
                    <div class="flex flex-column h-6rem">
                        <div
                            class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
                        >
                            <AutoComplete
                                id="phenotype"
                                v-model="selectedPhenotype"
                                optionLabel="description"
                                :suggestions="filteredPhenotypes"
                                @complete="matchPhenotypes"
                                @item-select="fetchFileUploads"
                                dataKey="name"
                                dropdown
                                forceSelection
                                dropdown-mode="current"
                                auto-option-focus
                            />
                        </div>
                    </div>
                    <div class="flex py-4">
                        <Button label="Next" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>
            <StepperPanel header="Select Datasets">
                <template #content="{ prevCallback, nextCallback }">
                    <div class="flex flex-column">
                        <div
                            class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
                        >
                            <!-- <Button @click="fetchFileUploads" label="Fetch" /> -->
                            <DataTable
                                :value="fileUploads"
                                :loading="tableLoading"
                                :paginator="true"
                                :rows="5"
                                :rowsPerPageOptions="[5, 10, 20]"
                                sortField="uploaded_at"
                                :sortOrder="-1"
                                v-model:selection="selectedDatasets"
                                data-key="id"
                                style="width: 100%"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle="width: 3rem"
                                ></Column>
                                <Column
                                    field="dataset_name"
                                    header="Dataset"
                                ></Column>
                                <Column
                                    field="file_name"
                                    header="File Name"
                                ></Column>
                                <Column field="file_size" header="File Size">
                                    <template #body="{ data }">
                                        {{
                                            (
                                                data.file_size /
                                                (1024 * 1024)
                                            ).toFixed(2) + " mb"
                                        }}
                                    </template>
                                </Column>
                                <Column
                                    field="uploaded_at"
                                    header="Date Uploaded"
                                >
                                    <template #body="{ data }">
                                        {{
                                            formatDate(
                                                new Date(data.uploaded_at),
                                            )
                                        }}
                                    </template>
                                </Column>
                                <Column
                                    field="uploaded_by"
                                    header="Uploader"
                                ></Column>
                                <Column
                                    field="phenotype"
                                    header="Phenotype"
                                ></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div class="flex py-4 gap-2">
                        <Button
                            label="Back"
                            severity="secondary"
                            @click="prevCallback"
                        />
                        <Button label="Next" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>
            <StepperPanel header="Configure Options">
                <template #content="{ prevCallback }">
                    <div class="flex flex-column h-6rem">
                        <div
                            class="grid border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center font-medium"
                        >
                            <div class="col-8 p-4">
                                <div class="field p-fluid">
                                    <InputText
                                        type="text"
                                        v-model="name"
                                        placeholder="Name of analysis"
                                        floatLabel="Name"
                                        aria-describedby="name-help"
                                    ></InputText>
                                    <small id="name-help"
                                        >Enter a descriptive name for this
                                        analysis.</small
                                    >
                                </div>
                            </div>
                            <div class="col-4 p-4">
                                <!-- Group 2 items go here -->
                                <div class="flex align-items-center">
                                    <InputSwitch
                                        v-model="overlap"
                                        inputId="overlap"
                                        class="mr-2"
                                    /><label for="overlap" class="font-medium"
                                        >Overlap {{ overlap ? "ON" : "OFF" }}
                                    </label>
                                </div>
                                <div class="flex align-items-center">
                                    <span
                                        >Analysis:
                                        {{ overlap ? "Bottom-line" : "Naive" }}
                                    </span>
                                    <Button
                                        icon="bi-info-circle-fill"
                                        rounded
                                        text
                                        class="ml-1"
                                        @click="showSidebar = true"
                                        title="More information"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex py-4 gap-2">
                        <Button
                            label="Back"
                            severity="secondary"
                            @click="prevCallback"
                        />
                        <Button
                            label="Run Analysis"
                            severity="success"
                            @click="runAnalysis"
                        />
                    </div>
                </template>
            </StepperPanel> </Stepper
        ><Sidebar
            v-model:visible="showSidebar"
            header="Meta-Analyses"
            position="right"
            ><h5>Bottom-line</h5>
            <p>
                Our bottom-line integrative analysis estimates the sample
                overlap between each pair of studies/datasets and accounts for
                it when weighting each study’s contribution to the final effect
                estimate. The method is implemented in METAL (documented
                <a
                    href="https://genome.sph.umich.edu/wiki/METAL_Documentation#Sample_Overlap_Correction"
                    target="_blank"
                    >here</a
                >) and was developed at the University of Michigan.
            </p>
            <p>
                More information
                <a href="https://hugeamp.org/help.html?page=911" target="_blank"
                    >here</a
                >.
            </p>

            <h5>Naive</h5>
            <p>
                Our naive analysis conducts an fixed-effect inverse variance
                weighted meta-analysis, assuming that all studies are
                independent.
            </p>
        </Sidebar>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useDatasetStore } from "@/stores/DatasetStore";

const store = useDatasetStore();
let phenotypes = {};
const selectedPhenotype = ref({});
const filteredPhenotypes = ref();
const overlap = ref(false);
const showSidebar = ref(false);
const name = ref("");
const fileUploads = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const selectedDatasets = ref([]);

onMounted(async () => {
    let params = {
        statuses: "REVIEW+APPROVED",
    };
    let query = paramsToString(params);
    phenotypes = await store.fetchHermesPhenotypes(query);
});

function matchPhenotypes(event) {
    setTimeout(() => {
        filteredPhenotypes.value = Object.values(phenotypes)
            .filter((p) => {
                return p.description
                    .toLowerCase()
                    .includes(event.query.toLowerCase());
            })
            .sort((a, b) => a.description.length - b.description.length);
    }, 250);
}

const fetchFileUploads = async () => {
    tableLoading.value = true;
    let params = {
        phenotype: selectedPhenotype.value.name,
        statuses: "REVIEW+APPROVED",
    };
    let query = paramsToString(params);
    fileUploads.value = await store.fetchFileUploads(query);
    tableLoading.value = false;
    finished.value = true;
};

const getSeverity = (status) => {
    switch (status) {
        case "FAILED QC":
            return "danger";
        case "READY FOR REVIEW":
            return "success";
        case "SUBMITTED TO QC":
            return "secondary";
        case "REVIEW REJECTED":
            return "warning";
        default:
            return "info";
    }
};

const formatDate = (value) => {
    return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const paramsToString = (params) => {
    return Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
};

const runAnalysis = async () => {
    console.log("Running analysis...");
    let dsIDs = selectedDatasets.value.length
        ? selectedDatasets.value.map((ds) => ds.id)
        : [];
    console.log("Selected datasets:", dsIDs);
    console.log("Name:", name.value);
    console.log("Overlap:", overlap.value);
};
</script>
