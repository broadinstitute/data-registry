<template>
    <div class="container-fluid">
        <Accordion :activeIndex="0">
            <AccordionTab header="Metadata">
                <DRMetaData :dataset-id="route.params.id" />
            </AccordionTab>
            <AccordionTab header="Files">
                <DataTable
                    :value="store.savedPhenotypes"
                    stripedRows
                    :pt="{
                        table: 'table table-striped',
                    }"
                >
                    <Column field="file_name" header="File Name" />
                    <Column field="file_size" header="File Size" />
                    <Column field="phenotype" header="Phenotype" />
                    <Column field="status" header="Status"
                        ><template #body="{ data }">Uploaded</template></Column
                    >
                    <Column field="actions" header="Actions"
                        ><template #body="{ data }">
                            <i
                                class="bi bi-check-circle mr-2"
                                style="cursor: pointer"
                                title="QC Check"
                            />
                            <i
                                class="bi bi-shuffle mr-2"
                                style="cursor: pointer"
                                title="Aggregate"
                            />
                            <i
                                class="bi bi-list-columns mr-2"
                                style="cursor: pointer"
                                title="Meta Analysis"
                            />
                            <i
                                class="bi bi-journal-medical"
                                style="cursor: pointer"
                                title="Annotate"
                            /> </template
                    ></Column>
                </DataTable>
                <nuxt-link :to="{ name: 'hermes-new' }">
                    <Button label="Upload new file" icon="bi bi-upload" text
                /></nuxt-link>
            </AccordionTab>
        </Accordion>

        <div class="row mt-2">
            <div class="col text-start">
                <nuxt-link :to="{ name: 'datasets' }">
                    <button type="button" class="btn btn-success btn-sm">
                        <i class="bi bi-arrow-left" />
                        Back to Dataset List
                    </button>
                </nuxt-link>
            </div>
            <div class="col text-end">
                <nuxt-link :to="{ name: 'datasets-new' }">
                    <button type="button" class="btn btn-primary btn-sm">
                        <i class="bi bi-plus" />
                        Add New Dataset
                    </button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";

const route = useRoute();
const store = useDatasetStore();
store.savedDataSetId = route.params.id;

const fileUploads = ref([]);
onMounted(async () => {
    fileUploads.value = await store.fetchFileUploads();
});
</script>
