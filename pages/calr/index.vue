<template>
    <div class="grid">
        <!-- Header -->
        <div class="col-12 mb-4">
            <h2 class="m-0">CALR Files</h2>
            <p class="text-600 mt-2">Upload and manage calorimetry data files</p>
        </div>

        <!-- Upload Form Card -->
        <div class="col-12 mb-4">
            <Card>
                <template #title>Upload New Dataset</template>
                <template #content>
                    <div class="flex flex-column gap-4">
                        <div class="field">
                            <label for="name" class="block text-900 font-medium mb-2">Name</label>
                            <InputText
                                id="name"
                                v-model="uploadName"
                                placeholder="Enter a name for this dataset"
                                class="w-full"
                            />
                        </div>
                        <div class="field">
                            <label for="description" class="block text-900 font-medium mb-2">Description</label>
                            <Textarea
                                id="description"
                                v-model="uploadDescription"
                                placeholder="Enter a description (optional)"
                                class="w-full"
                                rows="3"
                                autoResize
                            />
                        </div>
                        <div class="field">
                            <label class="block text-900 font-medium mb-2">Data File</label>
                            <div class="flex align-items-center gap-3">
                                <Button
                                    label="Choose File"
                                    icon="bi-folder2-open"
                                    @click="$refs.standardFileInput.click()"
                                    outlined
                                />
                                <span v-if="standardFile" class="text-600">
                                    {{ standardFile.name }} ({{ formatFileSize(standardFile.size) }})
                                </span>
                                <span v-else class="text-500">No file selected</span>
                                <input
                                    type="file"
                                    ref="standardFileInput"
                                    @change="onStandardFileSelect"
                                    style="display: none"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="block text-900 font-medium mb-2">Session File</label>
                            <div class="flex align-items-center gap-3">
                                <Button
                                    label="Choose File"
                                    icon="bi-folder2-open"
                                    @click="$refs.sessionFileInput.click()"
                                    outlined
                                />
                                <span v-if="sessionFile" class="text-600">
                                    {{ sessionFile.name }} ({{ formatFileSize(sessionFile.size) }})
                                </span>
                                <span v-else class="text-500">No file selected</span>
                                <input
                                    type="file"
                                    ref="sessionFileInput"
                                    @change="onSessionFileSelect"
                                    style="display: none"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <div class="flex align-items-center gap-2">
                                <Checkbox
                                    v-model="isPublic"
                                    inputId="public"
                                    :binary="true"
                                />
                                <label for="public" class="text-900 font-medium">Make publicly available</label>
                            </div>
                            <small class="text-500 ml-5">Public datasets can be browsed and downloaded by anyone</small>
                        </div>
                        <div class="flex justify-content-end">
                            <Button
                                label="Upload"
                                icon="bi-upload"
                                @click="handleUpload"
                                :disabled="!uploadName || !standardFile || !sessionFile"
                                :loading="uploading"
                            />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Submissions Table -->
        <div class="col-12">
            <Card>
                <template #title>Your Datasets</template>
                <template #content>
                    <DataTable
                        :value="submissions"
                        :loading="loading"
                        paginator
                        :rows="10"
                        :rowsPerPageOptions="[10, 25, 50]"
                        emptyMessage="No datasets yet"
                        stripedRows
                    >
                        <Column field="name" header="Name" sortable></Column>
                        <Column field="description" header="Description" sortable></Column>
                        <Column header="Public" sortable sortField="public">
                            <template #body="{ data }">
                                <Tag :value="data.public ? 'Yes' : 'No'" :severity="data.public ? 'success' : 'secondary'" />
                            </template>
                        </Column>
                        <Column header="Files">
                            <template #body="{ data }">
                                <div class="flex flex-column gap-1">
                                    <div v-for="file in data.files" :key="file.id" class="flex align-items-center gap-2">
                                        <Tag :value="file.file_type" severity="info" />
                                        <span class="text-600 text-sm">{{ file.file_name }} ({{ formatFileSize(file.file_size) }})</span>
                                        <Button
                                            icon="bi-download"
                                            text
                                            rounded
                                            size="small"
                                            @click="handleDownload(file)"
                                            v-tooltip.top="'Download'"
                                        />
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Uploaded" sortable sortField="uploaded_at">
                            <template #body="{ data }">
                                {{ formatDate(data.uploaded_at) }}
                            </template>
                        </Column>
                        <Column header="Actions" style="width: 100px">
                            <template #body="{ data }">
                                <Button
                                    icon="bi-trash"
                                    text
                                    rounded
                                    severity="danger"
                                    @click="confirmDelete(data)"
                                    v-tooltip.top="'Delete dataset'"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog
            v-model:visible="deleteDialog"
            modal
            header="Confirm Delete"
            :style="{ width: '450px' }"
        >
            <div class="flex align-items-center gap-3">
                <i class="bi-exclamation-triangle text-4xl text-yellow-500"></i>
                <span v-if="submissionToDelete">
                    Are you sure you want to delete <strong>{{ submissionToDelete.name }}</strong>
                    and all its files? This action cannot be undone.
                </span>
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    text
                    @click="deleteDialog = false"
                />
                <Button
                    label="Delete"
                    severity="danger"
                    @click="handleDelete"
                    :loading="deleting"
                />
            </template>
        </Dialog>

        <Toast position="top-center" />
    </div>
</template>

<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
    layout: 'calr'
});

const datasetStore = useDatasetStore();
const toast = useToast();

// State
const submissions = ref([]);
const loading = ref(false);
const uploadName = ref('');
const uploadDescription = ref('');
const standardFile = ref(null);
const sessionFile = ref(null);
const isPublic = ref(false);
const uploading = ref(false);
const deleteDialog = ref(false);
const submissionToDelete = ref(null);
const deleting = ref(false);

// File input refs
const standardFileInput = ref(null);
const sessionFileInput = ref(null);

// Fetch submissions on mount
onMounted(async () => {
    await fetchSubmissions();
});

async function fetchSubmissions() {
    loading.value = true;
    try {
        submissions.value = await datasetStore.fetchCALRSubmissions();
    } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load datasets',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

function onStandardFileSelect(event) {
    const file = event.target.files[0];
    if (file) standardFile.value = file;
}

function onSessionFileSelect(event) {
    const file = event.target.files[0];
    if (file) sessionFile.value = file;
}

async function handleUpload() {
    if (!uploadName.value || !standardFile.value || !sessionFile.value) {
        return;
    }

    uploading.value = true;
    try {
        await datasetStore.uploadCALRSubmission(
            standardFile.value,
            sessionFile.value,
            uploadName.value,
            uploadDescription.value,
            isPublic.value
        );

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dataset uploaded successfully',
            life: 3000
        });

        // Reset form
        uploadName.value = '';
        uploadDescription.value = '';
        standardFile.value = null;
        sessionFile.value = null;
        isPublic.value = false;
        if (standardFileInput.value) standardFileInput.value.value = '';
        if (sessionFileInput.value) sessionFileInput.value.value = '';

        await fetchSubmissions();
    } catch (error) {
        console.error('Upload error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.detail || 'Failed to upload dataset',
            life: 5000
        });
    } finally {
        uploading.value = false;
    }
}

async function handleDownload(file) {
    try {
        await datasetStore.downloadCALRFile(file.id, file.file_name);
    } catch (error) {
        console.error('Download error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download file',
            life: 3000
        });
    }
}

function confirmDelete(submission) {
    submissionToDelete.value = submission;
    deleteDialog.value = true;
}

async function handleDelete() {
    if (!submissionToDelete.value) return;

    deleting.value = true;
    try {
        await datasetStore.deleteCALRSubmission(submissionToDelete.value.id);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dataset deleted successfully',
            life: 3000
        });

        deleteDialog.value = false;
        submissionToDelete.value = null;
        await fetchSubmissions();
    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete dataset',
            life: 3000
        });
    } finally {
        deleting.value = false;
    }
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>

<style scoped>
.field {
    margin-bottom: 0;
}
</style>
