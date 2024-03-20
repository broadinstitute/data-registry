<template>
    <div class="container-fluid">
        <Accordion :activeIndex="0">
            <AccordionTab header="Metadata">
                <DRMetaData :dataset-id="route.params.id" />
            </AccordionTab>
            <AccordionTab header="Files">
                <DataTable>
                    <Column field="name" header="File Name" />
                    <Column field="size" header="File Size" />
                    <Column field="type" header="File Type" />
                    <Column field="phenotype" header="Phenotype" />
                    <Column field="uploader" header="Uploader" />
                    <Column field="status" header="Status" />
                    <Column field="actions" header="Actions" />
                </DataTable>
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
</script>
