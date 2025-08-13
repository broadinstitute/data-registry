<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useUserStore } from "~/stores/UserStore";
import { ref, onMounted, h, computed } from "vue";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { NuxtLink } from "#components";
import MultiSelect from 'primevue/multiselect';
import { FilterMatchMode, FilterService } from 'primevue/api';

definePageMeta({
  layout: 'sgc'
});

FilterService.register('inArray', (value, filters) => {
  if (!filters || filters.length === 0) return true;
  return filters.some(filter => value === filter);
});

const route = useRouter();
const store = useDatasetStore();
const userStore = useUserStore();
const deleteDialog = ref(false);
const datasetToDelete = ref(null);
const fileUploads = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const config = useRuntimeConfig();

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
    await store.deleteSGCDataset(datasetToDelete.value.id);
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
    try {
      fileUploads.value = await store.fetchSGCFileUploads();
    } catch (error) {
      console.error('Error fetching SGC uploads:', error);
      fileUploads.value = [];
    }
    tableLoading.value = false;
    finished.value = true;
});

const getSeverity = (status) => {
    switch (status) {
        case "FAILED":
            return "danger";
        case "COMPLETED":
            return "success";
        case "PROCESSING":
            return "secondary";
        case "PENDING":
            return "warning";
        default:
            return "info";
    }
};

const getIcon = (status) => {
    switch (status) {
        case "FAILED":
            return "bi-x";
        case "COMPLETED":
            return "bi-check";
        case "PROCESSING":
            return "bi-arrow-repeat";
        case "PENDING":
            return "bi-clock";
        default:
            return "bi-info";
    }
};

const uniqueStatuses = computed(() => {
  return [...new Set(fileUploads.value.map(f => f.status))];
});

const columns = ref([
  {
    header: "Upload Set Name",
    field: "upload_set_name",
    filterType: "text",
    placeholder: "Search upload sets",
    sortable: true
  },
  {
    header: "Cases/Controls File",
    field: "cases_controls_file",
    sortable: true
  },
  {
    header: "Co-occurrence File", 
    field: "cooccurrence_file",
    sortable: true
  },
  {
    header: "Cohort Description File",
    field: "cohort_description_file", 
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
    field: "status",
    filterType: "multiSelect",
    options: uniqueStatuses,
    sortable: true,
    component: (data) =>
      h(Tag, {
        severity: getSeverity(data.status),
        icon: getIcon(data.status),
        value: data.status.toUpperCase(),
        rounded: true
      })
  },
  {
    header: "",
    field: "actions",
    style: { width: "8rem" },
    component: (data) =>
        h("div", { class: "flex gap-2" }, [
          h(
              NuxtLink,
              { to: `/sgc/new?id=${data.id}` },
              () => h(Button, {
                icon: "bi-pencil",
                severity: "info",
                outlined: true,
                size: "small",
                title: "Edit upload"
              })
          ),
          canDeleteDataset.value && h(Button, {
            icon: "bi-trash",
            severity: "danger",
            outlined: true,
            size: "small",
            onClick: () => confirmDelete(data)
          })
        ])
  },
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
            <h2>SGC File Uploads</h2>
          <div class="flex justify-content-start mb-3">
            <Button id="upload_new"
                label="New Upload"
                icon="bi-upload"
                class="mr-2"
                @click="route.push('/sgc/new')"
            ></Button>
          </div>
            <Card class="mt-4">
                <template #content>
                    <DataTable v-model:filters="filters"
                               filterDisplay="row"
                               :value="fileUploads"
                               class="w-full"
                               paginator
                               :rows="20"
                               :loading="tableLoading"
                               sortField="uploaded_at"
                    >
                      <template #empty> No uploads found. </template>
                      <template #loading> Loading data. Please wait. </template>

                      <Column v-for="col in columns.filter(c => !c.showIf || c.showIf())"
                              :key="col.field"
                              :header="col.header"
                              :field="col.field"
                              :showFilterMenu="false"
                              :sortable="col.sortable"
                              :style="col.style"
                              style="min-width: 12rem">

                        <template #body="{ data }">
                          <template v-if="col.component">
                            <component :is="col.component(data)"></component>
                          </template>
                          <template v-else-if="col.format">
                            {{ col.format(data) }}
                          </template>
                          <template v-else>
                            {{ data[col.field] }}
                          </template>
                        </template>

                        <template v-if="col.filterType" #filter="{ filterModel, filterCallback }">
                          <MultiSelect v-if="col.filterType === 'multiSelect'"
                                       v-model="filterModel.value"
                                       @change="filterCallback()"
                                       :options="col.options"
                                       :maxSelectedLabels="1"
                                       placeholder="Any">
                          </MultiSelect>
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
                                Upload your SGC files.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any uploads yet. Start uploading
                                your first set of files today.
                            </div>
                            <Button
                                label="New Upload"
                                icon="bi-upload"
                                class="mr-2"
                                @click="route.push('/sgc/new')"
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
                                Please wait while we load your uploads.
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
      <span>Are you sure you want to delete this upload?</span>
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
</style>