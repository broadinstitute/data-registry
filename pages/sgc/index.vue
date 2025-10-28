<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useUserStore } from "~/stores/UserStore";
import { ref, onMounted, h, computed } from "vue";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
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
const cohorts = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const config = useRuntimeConfig();

const confirmDelete = (dataset) => {
  datasetToDelete.value = dataset;
  deleteDialog.value = true;
};

const canDeleteDataset = computed(() => {
  const user = useUserStore().user;
  if (!user) return false;
  
  // Extract role names from role objects (they might be strings or objects)
  const roleNames = user.roles?.map(role => role.name || role) || [];
  
  // Allow deletion for admin or sgc-reviewer roles
  return roleNames.includes('admin') || roleNames.includes('sgc-reviewer');
});

const handleDelete = async () => {
  try {
    await store.deleteSGCCohort(datasetToDelete.value.id);
    cohorts.value = cohorts.value.filter(
        (cohort) => cohort.id !== datasetToDelete.value.id
    );
    deleteDialog.value = false;
    datasetToDelete.value = null;
  } catch (error) {
    console.error('Error deleting cohort:', error);
  }
};

onMounted(async () => {
    tableLoading.value = true;
    try {
      cohorts.value = await store.fetchSGCCohorts();
    } catch (error) {
      console.error('Error fetching SGC cohorts:', error);
      cohorts.value = [];
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

// Helper function to get file names from cohort files
const getFileName = (files, fileType) => {
  const file = files?.find(f => f.file_type === fileType);
  return file ? file.file_name : '-';
};

const downloadFile = async (fileId) => {
  try {
    await store.downloadSGCFile(fileId);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Error downloading file. Please try again.');
  }
};

const columns = ref([
  {
    header: "Cohort Name",
    field: "name",
    filterType: "text",
    placeholder: "Search cohort names",
    sortable: true
  },
  {
    header: "Sample Size",
    field: "total_sample_size", 
    sortable: true,
    style: { width: "8rem" },
    format: data => data.total_sample_size?.toLocaleString() || '-'
  },
  {
    header: "M/F",
    field: "demographics",
    sortable: false,
    style: { width: "7rem" },
    format: data => {
      const males = data.number_of_males?.toLocaleString() || '0';
      const females = data.number_of_females?.toLocaleString() || '0';
      return `${males}/${females}`;
    }
  },
  {
    header: "Files",
    field: "files",
    format: data => {
      if (!data.files || data.files.length === 0) return "0/5";
      // Count only user-uploaded files (exclude derived 'both' files)
      const userUploadedFiles = data.files.filter(f => 
        f.file_type !== 'cases_controls_both' && f.file_type !== 'cooccurrence_both'
      );
      return `${userUploadedFiles.length}/5`;
    },
    component: (data) => {
      if (!data.files || data.files.length === 0) {
        return h(Tag, {
          severity: "danger",
          value: "0/5",
          rounded: true
        });
      } else {
        const menuRef = ref();
        const menuItems = data.files.map(file => ({
          label: file.file_name || `${file.file_type} file`,
          icon: 'bi-download',
          command: () => {
            downloadFile(file.id);
          }
        }));

        // Count only user-uploaded files (exclude derived 'both' files)
        const userUploadedFiles = data.files.filter(f => 
          f.file_type !== 'cases_controls_both' && f.file_type !== 'cooccurrence_both'
        );
        
        return h("div", { class: "flex align-items-center gap-2" }, [
          h(Tag, {
            severity: userUploadedFiles.length === 5 ? "success" : "warning",
            value: `${userUploadedFiles.length}/5`,
            rounded: true,
            icon: userUploadedFiles.length === 5 ? "bi-check" : undefined
          }),
          h("div", { class: "relative" }, [
            h(Menu, {
              ref: menuRef,
              model: menuItems,
              popup: true
            }),
            h(Button, {
              icon: "bi-download",
              severity: "secondary",
              outlined: true,
              size: "small",
              onClick: (event) => {
                menuRef.value?.toggle(event);
              },
              title: "Download files"
            })
          ])
        ]);
      }
    },
    sortable: true
  },
  {
    header: "Created",
    field: "created_at",
    style: { width: "7rem" },
    format: data => data.created_at ? new Date(data.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-',
    sortable: true
  },
  {
    header: "Uploader",
    field: "uploaded_by",
    filterType: "text",
    placeholder: "Search uploader",
    style: { width: "8rem" },
    sortable: true
  },
  {
    header: "Validation",
    field: "validation_status",
    sortable: true,
    style: { width: "6rem", textAlign: "center" },
    component: (data) => {
      const isValidated = !!data.validation_status;
      const iconClass = isValidated ? "bi-check-circle text-green-600" : "bi-x-circle text-red-600";
      const tooltipText = isValidated ? "Validation passed" : "Validation pending or failed";
      
      return h("div", { 
        class: "flex justify-content-center align-items-center",
        title: tooltipText
      }, [
        h("i", {
          class: `${iconClass}`,
          style: { fontSize: "1.2rem" }
        })
      ]);
    }
  },
  {
    header: "Actions",
    field: "actions", 
    style: { width: "8rem", textAlign: "center" },
    component: (data) => {
        // Check if cohort has all 5 files uploaded (excluding derived 'both' files)
        const userUploadedFiles = data.files?.filter(f => 
          f.file_type !== 'cases_controls_both' && f.file_type !== 'cooccurrence_both'
        ) || [];
        const hasAllFiles = userUploadedFiles.length === 5;
        const isValidated = !!data.validation_status;
        
        const buttons = [];
        
        // Show View button for completed cohorts
        if (hasAllFiles && isValidated) {
          buttons.push(h(
              NuxtLink,
              { to: `/sgc/view/${data.id}` },
              () => h(Button, {
                icon: "bi-eye",
                severity: "info",
                outlined: true,
                size: "small",
                title: "View cohort"
              })
          ));
        }
        
        // Always show Edit button
        buttons.push(h(
            NuxtLink,
            { to: `/sgc/edit/${data.id}` },
            () => h(Button, {
              icon: "bi-pencil",
              severity: "info",
              outlined: true,
              size: "small",
              title: "Edit cohort"
            })
        ));
        
        // Show Delete button if user has permission
        if (canDeleteDataset.value) {
          buttons.push(h(Button, {
            icon: "bi-trash",
            severity: "danger",
            outlined: true,
            size: "small",
            title: "Delete cohort",
            onClick: () => confirmDelete(data)
          }));
        }
        
        return h("div", { class: "flex gap-1 justify-content-center" }, buttons);
    }
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
        <div v-if="cohorts.length && finished" class="col">
            <h2>SGC Cohorts</h2>
          <div class="flex justify-content-start mb-3">
            <Button id="upload_new"
                label="New Cohort"
                icon="bi-upload"
                class="mr-2"
                @click="route.push('/sgc/new')"
            ></Button>
          </div>
            <Card class="mt-4">
                <template #content>
                    <DataTable v-model:filters="filters"
                               filterDisplay="row"
                               :value="cohorts"
                               class="w-full"
                               paginator
                               :rows="20"
                               :loading="tableLoading"
                               sortField="created_at"
                    >
                      <template #empty> No cohorts found. </template>
                      <template #loading> Loading data. Please wait. </template>

                      <Column v-for="col in columns.filter(c => !c.showIf || c.showIf())"
                              :key="col.field"
                              :header="col.header"
                              :field="col.field"
                              :showFilterMenu="false"
                              :sortable="col.sortable"
                              :style="col.style">

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
        <div v-else-if="finished && !cohorts.length" class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">
                                Create your SGC cohorts.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any cohorts yet. Start creating
                                your first cohort today.
                            </div>
                            <Button
                                label="New Cohort"
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
                                Please wait while we load your cohorts.
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
      <span>Are you sure you want to delete this cohort?</span>
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
