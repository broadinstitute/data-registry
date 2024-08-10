<template>
    <h2>+ New Meta-Analysis</h2>
    <div class="card">
        <Stepper orientation="vertical" value="1">
            <StepItem value="1">
                <Step>Select Phenotype</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex flex-col h-24">
                        <div
                            class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
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
                                placeholder="Select a phenotype"
                                clearButton
                            />
                        </div>
                    </div>
                    <div class="flex py-6">
                        <Button label="Next" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
            </StepItem>
            <StepItem value="2">
                <Step>Select Datasets</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="columns-1">
                        <Message
                            v-if="fileUploads.length < 2"
                            severity="warn"
                            class="mb-4"
                            closable
                            icon="bi-exclamation-triangle"
                        >
                            <p>
                                You need at least two datasets to run a
                                meta-analysis. Please upload more datasets or
                                approve existing ones.
                            </p>
                        </Message>
                        <Message
                            v-else
                            severity="info"
                            class="mb-4"
                            closable
                            icon="bi-info-circle"
                        >
                            <p>
                                Select the datasets you want to include in the
                                meta-analysis.
                            </p>
                        </Message>

                        <div
                            class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
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
                    <div class="flex py-6 gap-2">
                        <Button
                            label="Back"
                            severity="secondary"
                            @click="activateCallback('1')"
                        />
                        <Button label="Next" @click="activateCallback('3')" />
                    </div>
                </StepPanel>
            </StepItem>
            <StepItem value="3">
                <Step>Configure Options</Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex flex-col">
                        <div
                            class="grid grid-cols-12 gap-4 border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center font-medium"
                        >
                            <div class="col-span-8 p-6">
                                <div class="flex flex-col gap-2">
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
                            <div class="col-span-4 p-6">
                                <!-- Group 2 items go here -->
                                <div class="flex items-center">
                                    <ToggleSwitch
                                        v-model="overlap"
                                        inputId="overlap"
                                        class="mr-2"
                                    /><label for="overlap" class="font-medium"
                                        >Overlap
                                        {{ overlap ? "ON" : "OFF" }}
                                    </label>
                                </div>
                                <div class="flex items-center">
                                    <span
                                        >Analysis:
                                        {{ overlap ? "Bottom-line" : "Naive" }}
                                    </span>
                                    <Button
                                        icon="bi-info-circle-fill"
                                        rounded
                                        text
                                        class="ml-1"
                                        @click="showDrawer = true"
                                        title="More information"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex py-6 gap-2">
                        <Button
                            label="Back"
                            severity="secondary"
                            @click="activateCallback('2')"
                        />
                        <Button
                            label="Run Analysis"
                            severity="success"
                            @click="runAnalysis"
                        />
                    </div>
                </StepPanel>
            </StepItem> </Stepper
        ><Drawer
            v-model:visible="showDrawer"
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
        </Drawer>
        <Toast position="top-center" />
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useDatasetStore } from "@/stores/DatasetStore";
const route = useRouter();
const store = useDatasetStore();
import { useToast } from "primevue/usetoast";
const toast = useToast();
let phenotypes = {};
const selectedPhenotype = ref({});
const filteredPhenotypes = ref();
const overlap = ref(false);
const showDrawer = ref(false);
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

const runAnalysis = async () => {
    let dsIDs = selectedDatasets.value.length
        ? selectedDatasets.value.map((ds) => ds.id)
        : [];
    toast.add({
        severity: "warn",
        summary: "Alert",
        detail: "Copying data files. This may take a moment.",
        life: 0,
    });
    await store.startMetaAnalysis({
        name: name.value,
        method: "intake",
        datasets: dsIDs,
        phenotype: selectedPhenotype.value.name,
    });
    await route.push({ path: "/hermes/ma" });
};
</script>
