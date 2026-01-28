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
                <template #title>Upload New File</template>
                <template #content>
                    <div class="flex flex-column gap-4">
                        <div class="field">
                            <label for="name" class="block text-900 font-medium mb-2">File Name</label>
                            <InputText
                                id="name"
                                v-model="uploadName"
                                placeholder="Enter a name for this file"
                                class="w-full"
                            />
                            <small class="text-500">A descriptive name to identify this file</small>
                        </div>
                        <div class="field">
                            <label class="block text-900 font-medium mb-2">Select File</label>
                            <div class="flex align-items-center gap-3">
                                <Button
                                    label="Choose File"
                                    icon="bi-folder2-open"
                                    @click="$refs.fileInput.click()"
                                    outlined
                                />
                                <span v-if="selectedFile" class="text-600">
                                    {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                                </span>
                                <span v-else class="text-500">No file selected</span>
                                <input
                                    type="file"
                                    ref="fileInput"
                                    @change="onFileSelect"
                                    style="display: none"
                                />
                            </div>
                        </div>
                        <div class="flex justify-content-end">
                            <Button
                                label="Upload"
                                icon="bi-upload"
                                @click="handleUpload"
                                :disabled="!uploadName || !selectedFile"
                                :loading="uploading"
                            />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Files Table -->
        <div class="col-12">
            <Card>
                <template #title>Your Files</template>
                <template #content>
                    <DataTable
                        :value="files"
                        :loading="loading"
                        paginator
                        :rows="10"
                        :rowsPerPageOptions="[10, 25, 50]"
                        emptyMessage="No files uploaded yet"
                        stripedRows
                    >
                        <Column field="name" header="Name" sortable></Column>
                        <Column field="file_name" header="Filename" sortable></Column>
                        <Column header="Size" sortable sortField="file_size">
                            <template #body="{ data }">
                                {{ formatFileSize(data.file_size) }}
                            </template>
                        </Column>
                        <Column header="Uploaded" sortable sortField="uploaded_at">
                            <template #body="{ data }">
                                {{ formatDate(data.uploaded_at) }}
                            </template>
                        </Column>
                        <Column header="Actions" style="width: 200px">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <Button
                                        icon="bi-download"
                                        text
                                        rounded
                                        @click="handleDownload(data)"
                                        v-tooltip.top="'Download'"
                                    />
                                    <Button
                                        icon="bi-trash"
                                        text
                                        rounded
                                        severity="danger"
                                        @click="confirmDelete(data)"
                                        v-tooltip.top="'Delete'"
                                    />
                                </div>
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
                <span v-if="fileToDelete">
                    Are you sure you want to delete <strong>{{ fileToDelete.name }}</strong>?
                    This action cannot be undone.
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
const files = ref([]);
const loading = ref(false);
const uploadName = ref('');
const selectedFile = ref(null);
const uploading = ref(false);
const deleteDialog = ref(false);
const fileToDelete = ref(null);
const deleting = ref(false);

// File input ref
const fileInput = ref(null);

// Fetch files on mount
onMounted(async () => {
    await fetchFiles();
});

// Fetch user's files
async function fetchFiles() {
    loading.value = true;
    try {
        files.value = await datasetStore.fetchCALRFiles();
    } catch (error) {
        console.error('Error fetching files:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load files',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

// Handle file selection
function onFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
    }
}

// Handle file upload
async function handleUpload() {
    if (!uploadName.value || !selectedFile.value) {
        return;
    }

    uploading.value = true;
    try {
        await datasetStore.uploadCALRFile(selectedFile.value, uploadName.value);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully',
            life: 3000
        });

        // Reset form
        uploadName.value = '';
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }

        // Refresh file list
        await fetchFiles();
    } catch (error) {
        console.error('Upload error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.detail || 'Failed to upload file',
            life: 5000
        });
    } finally {
        uploading.value = false;
    }
}

// Handle file download
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

// Confirm delete
function confirmDelete(file) {
    fileToDelete.value = file;
    deleteDialog.value = true;
}

// Handle file deletion
async function handleDelete() {
    if (!fileToDelete.value) {
        return;
    }

    deleting.value = true;
    try {
        await datasetStore.deleteCALRFile(fileToDelete.value.id);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File deleted successfully',
            life: 3000
        });

        deleteDialog.value = false;
        fileToDelete.value = null;

        // Refresh file list
        await fetchFiles();
    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete file',
            life: 3000
        });
    } finally {
        deleting.value = false;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
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
