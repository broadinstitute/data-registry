<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted, h } from "vue";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { NuxtLink } from "#components";
import MultiSelect from 'primevue/multiselect';
import { FilterMatchMode, FilterService } from 'primevue/api';


FilterService.register('inArray', (value, filters) => {
  if (!filters || filters.length === 0) return true;
  return filters.some(filter => value === filter);
});


const route = useRouter();
const store = useDatasetStore();
const deleteDialog = ref(false);
const datasetToDelete = ref(null);
const fileUploads = ref([]);
const tableLoading = ref(false);
const finished = ref(false);

const confirmDelete = (dataset) => {
  datasetToDelete.value = dataset;
  deleteDialog.value = true;
};

const canDeleteDataset = computed(() => {
  const user = useUserStore().user;
  return user.roles.includes('admin') || user.permissions.includes('deleteDataset');
});

const handleDelete = async () => {
  try {
    await store.deleteHermesDataset(datasetToDelete.value.id);
    fileUploads.value = fileUploads.value.filter(
        (dataset) => dataset.id !== datasetToDelete.value.id
    );
    deleteDialog.value = false;
    datasetToDelete.value = null;
  } catch (error) {
    console.error('Error deleting dataset:', error);
  }
};

onMounted(async () => {
    tableLoading.value = true;
    fileUploads.value = await store.fetchFileUploads();
    tableLoading.value = false;
    finished.value = true;
});

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

const getIcon = (status) => {
    switch (status) {
        case "FAILED QC":
            return "bi-x";
        case "READY FOR REVIEW":
            return "bi-check";
        case "SUBMITTED TO QC":
            return "bi-plus";
        case "REVIEW REJECTED":
            return "bi-x-square";
        case "REVIEW APPROVED":
            return "bi-check-square";
    }
};

// flat array of possible phenotypes
const uniquePhenotypes = computed(() => {
  return [...new Set(fileUploads.value.map(f => f.phenotype))];
});

// flat array of possible phenotypes
const uniqueAncestries = computed(() => {
  return ["I'm an ancestry", "Me too"];
  //return [...new Set(fileUploads.value.map(f => f.ancestry))];
});

// flat array of possible statuses
const uniqueQCstatuses = computed(() => {
  return [...new Set(fileUploads.value.map(f => f.qc_status))];
});

// columns to dynamically create
const columns = ref([
  {
    header: "Phenotype",
    field: "phenotype",
    filterType: "multiSelect",
    options: uniquePhenotypes,
    sortable: true
  },
  {
    header: "Ancestry",
    field: "ancestry",
    filterType: "multiSelect",
    options: uniqueAncestries,
    sortable: true
  },
  {
    header: "Dataset",
    field: "dataset_name",
    filterType: "text",
    placeholder: "Search datasets",
    sortable: true
  },
  {
    header: "File Name",
    field: "file_name",
    filterType: "text",
    placeholder: "Search file names",
    sortable: true
  },
  {
    header: "File Size",
    field: "file_size",
    format: data => `${(data.file_size / (1024 * 1024)).toFixed(2)} mb`,
    sortable: true
  },
  {
    header: "Date Uploaded",
    field: "uploaded_at",
    format: data => new Date(data.uploaded_at).toISOString().split("T")[0],
    sortable: true
  },
  {
    header: "Uploader",
    field: "uploaded_by",
    filterType: "text",
    placeholder: "Search uploader",
    sortable: true
  },
  {
    header: "Status",
    field: "qc_status",
    filterType: "multiSelect",
    options: uniqueQCstatuses,
    sortable: true,
    component: (data) =>
      h(
        "span",
        {},
        data.qc_status !== "SUBMITTED TO QC"
          ? h(
              NuxtLink,
              { to: `/hermes/qc/${data.id}` },
              () =>
                h(Tag, {
                  severity: getSeverity(data.qc_status),
                  icon: getIcon(data.qc_status),
                  value: data.qc_status.toUpperCase(),
                  rounded: true
                })
            )
          : h(Tag, {
              severity: getSeverity(data.qc_status),
              icon: getIcon(data.qc_status),
              value: data.qc_status.toUpperCase(),
              rounded: true
            })
      )
  },
  {
    header: "QC Report",
    field: "qc_report",
    component: (data) =>
      data.qc_status !== "SUBMITTED TO QC"
        ? h(
            NuxtLink,
            { to: `/hermes/qc/${data.id}` },
            () => h(Button, { outlined: true, size: "small" }, () => "View")
          )
        : null
  },
  {
    header: "",
    field: "actions",
    style: { width: "8rem" },
    showIf: () => canDeleteDataset.value,
    component: (data) =>
      h(Button, {
        icon: "bi-trash",
        severity: "danger",
        outlined: true,
        size: "small",
        onClick: () => confirmDelete(data)
      })
  }
]);

const filters = ref(
    Object.fromEntries(
        columns.value
            .filter(col => col.filterType)
            .map(col => [
              col.field,
              {
                value: null,
                matchMode: col.filterType === 'multiSelect' ? 'inArray' : FilterMatchMode.CONTAINS
              }
            ])
    )
);
</script>

<template>
    <div class="grid">
        <div v-if="fileUploads.length && finished" class="col">
            <h2>Quality Control (QC) Reports</h2>
          <div class="flex justify-content-start mb-3">
            <Button id="upload_new"
                label="Upload"
                icon="bi-upload"
                class="mr-2"
                @click="route.push('/hermes/new')"
            ></Button>
          </div>
            <Card class="mt-4">
                <template #content>
                    <DataTable v-model:filters="filters"
                               filterDisplay="row"
                               :value="fileUploads"
                               tableStyle="min-width: 50rem"
                               paginator
                               :rows="20"
                               :loading="tableLoading"
                               sortField="uploaded_at"
                    >
                      <template #empty> No data found. </template>
                      <template #loading> Loading data. Please wait. </template>

                      <!-- dynamic column creation -->
                      <Column v-for="col in columns.filter(c => !c.showIf || c.showIf())"
                              :key="col.field"
                              :header="col.header"
                              :field="col.field"
                              :showFilterMenu="false"
                              :sortable="col.sortable"
                              :style="col.style"
                              style="min-width: 14rem">

                        <!-- content template -->
                        <template #body="{ data }">
                          <!-- render custom component -->
                          <template v-if="col.component">
                            <component :is="col.component(data)"></component>
                          </template>
                          <!-- render formatted text -->
                          <template v-else-if="col.format">
                            {{ col.format(data) }}
                          </template>
                          <!-- just render the data asis -->
                          <template v-else>
                            {{ data[col.field] }}
                          </template>
                        </template>

                        <!-- filtering template -->
                        <template v-if="col.filterType" #filter="{ filterModel, filterCallback }">
                          <!-- multiple choice filtering -->
                          <MultiSelect v-if="col.filterType === 'multiSelect'"
                                       v-model="filterModel.value"
                                       @change="filterCallback()"
                                       :options="col.options"
                                       :maxSelectedLabels="1"
                                       placeholder="Any">
                          </MultiSelect>
                          <!-- or, text input filtering -->
                          <InputText v-else
                                     v-model="filterModel.value"
                                     type="text"
                                     @input="filterCallback()"
                                     :placeholder="col.placeholder" />
                        </template>
                      </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
        <div v-else-if="finished && !fileUploads.length" class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">
                                Upload your datasets.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any dataset yet. Start uploading
                                your first dataset today.
                            </div>
                            <Button
                                label="Upload"
                                icon="bi-upload"
                                class="mr-2"
                                @click="route.push('/hermes/new')"
                            ></Button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div v-else class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-600 font-bold text-4xl mb-3">
                                Loading...
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                Please wait while we load your datasets.
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

  <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Confirm Delete"
      :style="{ width: '450px' }"
  >
    <div class="confirmation-content">
      <i class="bi bi-exclamation-triangle mr-3" style="color: var(--red-500)" />
      <span>Are you sure you want to delete this dataset?</span>
    </div>
    <template #footer>
      <Button
          label="No"
          icon="bi-x"
          outlined
          @click="deleteDialog = false"
          class="mr-2"
      />
      <Button
          label="Yes"
          icon="bi-check"
          severity="danger"
          @click="handleDelete"
      />
    </template>
  </Dialog>
</template>


<!-- style sheet -->
<style scoped>

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.image-tooltip {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 806px;
    height: 406px;
    overflow: auto;
    border: 3px solid #6366f1;
    z-index: 1000;
}
button.plot {
    cursor: help;
}

</style>
