<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted } from "vue";
import Chart from "primevue/chart";
import { FilterMatchMode } from 'primevue/api';
import MultiSelect from 'primevue/multiselect';

const route = useRouter();
const store = useDatasetStore();
const deleteDialog = ref(false);
const datasetToDelete = ref(null);
const fileUploads = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const includeFailedRejected = ref(true);

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

const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            display: false,
            stacked: true,
        },
        y: {
            stacked: true,
            ticks: {
                callback: function (index) {
                    const count = dataCollection.value.datasets[0].data[index];
                    const label = dataCollection.value.labels[index];
                    return `${label} (${count})`;
                },
            },
        },
    },
    plugins: {
        title: {
            display: true,
            text: "Dataset Status",
        },
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.raw;
                },
            },
        },
    },
};

const dataCollection = computed(() => {
    const labels = [
        "FAILED QC",
        "READY FOR REVIEW",
        "REVIEW REJECTED",
        "REVIEW APPROVED",
    ];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Dataset Status",
                data: [
                    datasetRows.value.filter(
                        (file) => file.qc_status === "FAILED QC",
                    ).length,
                    datasetRows.value.filter(
                        (file) => file.qc_status === "READY FOR REVIEW",
                    ).length,
                    datasetRows.value.filter(
                        (file) => file.qc_status === "REVIEW REJECTED",
                    ).length,
                    datasetRows.value.filter(
                        (file) => file.qc_status === "REVIEW APPROVED",
                    ).length,
                ],
                backgroundColor: [
                    statusBgColors["FAILED QC"],
                    statusBgColors["READY FOR REVIEW"],
                    statusBgColors["REVIEW REJECTED"],
                    statusBgColors["REVIEW APPROVED"],
                ],
            },
        ],
    };
    return data;
});

const statusBgColors = {
    "FAILED QC": "#ffd0ce",
    "READY FOR REVIEW": "#caf1d8",
    "REVIEW REJECTED": "#feddc7",
    "REVIEW APPROVED": "#d0e1fd",
};

onMounted(async () => {
    tableLoading.value = true;
    fileUploads.value = await store.fetchFileUploads();
    tableLoading.value = false;
    finished.value = true;
});

const datasetRows = computed(() => {
  let filteredData = fileUploads.value;

  if (!includeFailedRejected.value) {
    filteredData = filteredData.filter(file => file.qc_status !== "FAILED QC" && file.qc_status !== "REVIEW REJECTED");
  }

  // attempted phenotype filter - this doesn't work...
  const phenotypeFilter = filters.value.phenotype?.value;
  if (phenotypeFilter?.length) {
    filteredData = filteredData.filter(file => phenotypeFilter.some(f => f.phenotype === file.phenotype));
  }

  return filteredData;
});

const filters = ref({
    phenotype: {value: null}  // Simple array to hold selected phenotypes
});

const uniquePhenotypes = computed(() => {
  const phenotypes = [...new Set(fileUploads.value.map(f => f.phenotype))];
  return phenotypes.map(phenotype => ({ phenotype: phenotype }));
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
</script>

<template>
    <div class="grid">
        <div v-if="fileUploads.length && finished" class="col">
            <h2>Quality Control (QC) Reports</h2>
            <Card>
                <template #content>
                    <Chart
                        type="bar"
                        :data="dataCollection"
                        :options="chartOptions"
                    />
                </template>
            </Card>
            <Card class="mt-4">
                <template #content>
                    <DataTable
                        v-model:filters="filters"
                        :value="datasetRows"
                        :paginator="false"
                        rowHover
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20]"
                        :loading="tableLoading"
                        sortField="uploaded_at"
                        :sortOrder="-1"
                        filterDisplay="menu"
                        ><template #header>
                           <div class="flex justify-content-between flex-column sm:flex-row">
                             <div>
                               <InputSwitch
                                   v-model="includeFailedRejected"
                                   inputID="includeFailedRejected"
                                   class="mr-2"
                               />
                               <label for="includeFailedRejected">Include Failed/Rejected</label>
                             </div>
                             <div>
                               <Button
                                   label="Upload"
                                   icon="bi-upload"
                                   class="mr-2"
                                   @click="route.push('/hermes/new')"
                               ></Button>
                             </div>
                           </div>
                        </template>
                        <template #empty> No dataset found. </template>
                        <template #loading>
                            Loading dataset data. Please wait...
                        </template>
                        <Column field="dataset_name" header="Dataset"></Column>
                        <Column field="file_name" header="File Name"></Column>
                        <Column field="file_size" header="File Size">
                            <template #body="{ data }">
                                {{
                                    (data.file_size / (1024 * 1024)).toFixed(
                                        2,
                                    ) + " mb"
                                }}
                            </template>
                        </Column>
                        <Column field="uploaded_at" header="Date Uploaded">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.uploaded_at)) }}
                            </template>
                        </Column>
                        <Column field="uploaded_by" header="Uploader"></Column>


                        <Column header="Phenotype" filterField="phenotype" :showFilterMatchModes="false">
                          <template #body="{ data }">
                            <span>{{ data.phenotype }}</span>
                          </template>
                          <template #filter="{ filterModel }">
                            <MultiSelect
                                v-model="filterModel.value"
                                :options="uniquePhenotypes"
                                optionLabel="phenotype"
                                placeholder="All"
                                @change="() => console.log('Selected Phenotypes:', filterModel.value)"
                            >
                            </MultiSelect>
                          </template>
                        </Column>

                        <Column field="qc_status" header="Status">
                            <template #body="{ data }">
                                <span
                                    v-if="data.qc_status !== 'SUBMITTED TO QC'"
                                >
                                    <nuxt-link :to="`/hermes/qc/${data.id}`">
                                        <Tag
                                            :severity="
                                                getSeverity(data.qc_status)
                                            "
                                            :icon="getIcon(data.qc_status)"
                                            :value="
                                                data.qc_status.toUpperCase()
                                            "
                                            rounded
                                        />
                                    </nuxt-link>
                                </span>
                                <span v-else>
                                    <Tag
                                        :severity="getSeverity(data.qc_status)"
                                        :icon="getIcon(data.qc_status)"
                                        :value="data.qc_status.toUpperCase()"
                                        rounded
                                    />
                                </span>
                            </template>
                        </Column>


                        <Column field="qc_report" header="QC Report">
                            <template #body="{ data }">
                                <NuxtLink :to="`/hermes/qc/${data.id}`">
                                    <Button
                                        v-if="
                                            data.qc_status !== 'SUBMITTED TO QC'
                                        "
                                        outlined
                                        size="small"
                                    >
                                        View
                                    </Button></NuxtLink
                                >
                            </template>
                        </Column>
                      <Column header="" :style="{ width: '8rem' }" v-if="canDeleteDataset">
                        <template #body="{ data }">
                          <Button
                              icon="bi-trash"
                              severity="danger"
                              outlined
                              size="small"
                              @click="confirmDelete(data)"
                              v-tooltip.top="'Delete Dataset'"
                          />
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
