<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Create Cohort
            </h2>
        </div>
    </div>


    <!-- Loading State -->
    <div class="grid" v-if="loading">
        <div class="col-12">
            <div class="text-center p-4">
                <ProgressSpinner />
                <p>Loading cohort information...</p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="grid" v-else>
        <div class="col-12">
            <div class="card p-fluid">
                <h5>Cohort Setup</h5>
                <p class="text-sm mb-4">
                    Complete the cohort metadata and upload all three required files. Accepted formats: .txt, .csv, and .tsv files.
                </p>
                
                <!-- Progress Checklist -->
                <div class="card mb-4" style="background-color: var(--surface-100); border: 1px solid var(--surface-300);">
                    <h6 class="mb-3">Progress Overview</h6>
                    <div class="flex flex-column gap-2">
                        <div class="flex align-items-center gap-2">
                            <i v-if="metadataCompleted"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': metadataCompleted, 'text-red-600': !metadataCompleted}">
                                Cohort Metadata
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.casesControlsMale"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.casesControlsMale, 'text-red-600': !uploadStatus.casesControlsMale}">
                                Male Cases/Controls Data
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.casesControlsFemale"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.casesControlsFemale, 'text-red-600': !uploadStatus.casesControlsFemale}">
                                Female Cases/Controls Data
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.casesControlsBoth"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.casesControlsBoth, 'text-red-600': !uploadStatus.casesControlsBoth}">
                                Both Cases/Controls Data
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.cooccurrence"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.cooccurrence, 'text-red-600': !uploadStatus.cooccurrence}">
                                Co-occurrence Data
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.cohortDescription"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.cohortDescription, 'text-red-600': !uploadStatus.cohortDescription}">
                                Cohort Description
                            </span>
                        </div>
                    </div>
                    
                    <!-- Overall Status -->
                    <div v-if="allTasksCompleted" class="text-center mt-3 p-3" style="background-color: var(--green-100); border: 1px solid var(--green-300); border-radius: 6px;">
                        <i class="pi pi-check-circle text-green-600 mr-2" style="font-size: 1.5rem"></i>
                        <span class="text-green-700 font-medium text-lg">Cohort setup complete! All metadata and files uploaded.</span>
                    </div>
                    <div v-else class="text-center mt-3 p-2" style="background-color: var(--orange-100); border: 1px solid var(--orange-300); border-radius: 6px;">
                        <i class="pi pi-info-circle text-orange-600 mr-2"></i>
                        <span class="text-orange-700 font-medium">{{ remainingTasksCount }} task{{ remainingTasksCount === 1 ? '' : 's' }} remaining</span>
                    </div>
                </div>
                
                <Accordion :multiple="false" v-model:activeIndex="activeAccordionIndex">
                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Cohort Metadata *</span>
                                <i v-if="metadataCompleted" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <SGCMetadataForm 
                            title="Cohort Information"
                            :initial-data="cohortData"
                            :redirect-after-save="false"
                            save-button-label="Update Metadata"
                            save-button-icon="bi-pencil"
                            success-message="Metadata updated successfully"
                            @updated="handleMetadataUpdated"
                        />
                    </AccordionTab>
                    
                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Male Cases/Controls Data *</span>
                                <i v-if="uploadStatus.casesControlsMale" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.casesControlsMale" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.casesControlsMale.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.casesControlsMale.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small"
                                    @click="deleteCasesControlsMaleFile"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="casesControlsMaleFile"
                            id="casesControlsMaleFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="handleCasesControlsMaleFile"
                            @clear="resetCasesControlsMaleFile"
                            @remove="resetCasesControlsMaleFile"
                            customUpload
                            :multiple="false"
                        >
                            <template #empty>
                                <p>Select Male Cases/Controls file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>

                    <!-- Male Cases/Controls Column Mapping -->
                    <div v-if="casesControlsMaleFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Male Cases/Controls Columns</h6>
                        <small class="mb-3 block">
                            Map the columns in your file to the required fields: Cases, Controls, and Phenotype.
                        </small>

                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredSGCFields">
                                <Chip
                                    v-if="Object.values(casesControlsMaleMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>

                        <DataTable :value="casesControlsMaleTableRows" rowHover>
                            <Column field="column" header="Column" class="col-4">
                            </Column>
                            <Column header=">>" class="col-1"></Column>
                            <Column header="Represents" class="col-7">
                                <template #body="{ data }">
                                    <Dropdown
                                        class="w-full"
                                        :options="columnMappingOptions"
                                        option-label="name"
                                        option-value="value"
                                        :option-disabled="
                                            (option) => {
                                                return (
                                                    Object.values(casesControlsMaleMapping).includes(option.value) &&
                                                    option.value !== casesControlsMaleMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="casesControlsMaleMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>

                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Male Cases/Controls File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!casesControlsMaleMappingComplete"
                                @click="uploadCasesControlsMaleFile"
                                raised
                            />
                            <div v-if="!casesControlsMaleMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ casesControlsMaleUploadTooltip }}
                            </div>
                        </div>
                    </div>
                    </AccordionTab>

                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Female Cases/Controls Data *</span>
                                <i v-if="uploadStatus.casesControlsFemale" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.casesControlsFemale" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.casesControlsFemale.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.casesControlsFemale.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small"
                                    @click="deleteCasesControlsFemaleFile"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="casesControlsFemaleFile"
                            id="casesControlsFemaleFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="handleCasesControlsFemaleFile"
                            @clear="resetCasesControlsFemaleFile"
                            @remove="resetCasesControlsFemaleFile"
                            customUpload
                            :multiple="false"
                        >
                            <template #empty>
                                <p>Select Female Cases/Controls file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>

                    <!-- Female Cases/Controls Column Mapping -->
                    <div v-if="casesControlsFemaleFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Female Cases/Controls Columns</h6>
                        <small class="mb-3 block">
                            Map the columns in your file to the required fields: Cases, Controls, and Phenotype.
                        </small>

                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredSGCFields">
                                <Chip
                                    v-if="Object.values(casesControlsFemaleMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>

                        <DataTable :value="casesControlsFemaleTableRows" rowHover>
                            <Column field="column" header="Column" class="col-4">
                            </Column>
                            <Column header=">>" class="col-1"></Column>
                            <Column header="Represents" class="col-7">
                                <template #body="{ data }">
                                    <Dropdown
                                        class="w-full"
                                        :options="columnMappingOptions"
                                        option-label="name"
                                        option-value="value"
                                        :option-disabled="
                                            (option) => {
                                                return (
                                                    Object.values(casesControlsFemaleMapping).includes(option.value) &&
                                                    option.value !== casesControlsFemaleMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="casesControlsFemaleMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>

                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Female Cases/Controls File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!casesControlsFemaleMappingComplete"
                                @click="uploadCasesControlsFemaleFile"
                                raised
                            />
                            <div v-if="!casesControlsFemaleMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ casesControlsFemaleUploadTooltip }}
                            </div>
                        </div>
                    </div>
                    </AccordionTab>

                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Both Cases/Controls Data *</span>
                                <i v-if="uploadStatus.casesControlsBoth" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.casesControlsBoth" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.casesControlsBoth.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.casesControlsBoth.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small"
                                    @click="deleteCasesControlsBothFile"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="casesControlsBothFile"
                            id="casesControlsBothFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="handleCasesControlsBothFile"
                            @clear="resetCasesControlsBothFile"
                            @remove="resetCasesControlsBothFile"
                            customUpload
                            :multiple="false"
                        >
                            <template #empty>
                                <p>Select Both Cases/Controls file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>

                    <!-- Both Cases/Controls Column Mapping -->
                    <div v-if="casesControlsBothFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Both Cases/Controls Columns</h6>
                        <small class="mb-3 block">
                            Map the columns in your file to the required fields: Cases, Controls, and Phenotype.
                        </small>

                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredSGCFields">
                                <Chip
                                    v-if="Object.values(casesControlsBothMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>

                        <DataTable :value="casesControlsBothTableRows" rowHover>
                            <Column field="column" header="Column" class="col-4">
                            </Column>
                            <Column header=">>" class="col-1"></Column>
                            <Column header="Represents" class="col-7">
                                <template #body="{ data }">
                                    <Dropdown
                                        class="w-full"
                                        :options="columnMappingOptions"
                                        option-label="name"
                                        option-value="value"
                                        :option-disabled="
                                            (option) => {
                                                return (
                                                    Object.values(casesControlsBothMapping).includes(option.value) &&
                                                    option.value !== casesControlsBothMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="casesControlsBothMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>

                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Both Cases/Controls File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!casesControlsBothMappingComplete"
                                @click="uploadCasesControlsBothFile"
                                raised
                            />
                            <div v-if="!casesControlsBothMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ casesControlsBothUploadTooltip }}
                            </div>
                        </div>
                    </div>
                    </AccordionTab>

                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Co-occurrence Data *</span>
                                <i v-if="uploadStatus.cooccurrence" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.cooccurrence" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.cooccurrence.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.cooccurrence.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small" 
                                    @click="deleteCooccurrenceFile"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="cooccurrenceFile"
                            id="cooccurrenceFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="handleCooccurrenceFile"
                            @clear="resetCooccurrenceFile"
                            @remove="resetCooccurrenceFile"
                            customUpload
                        >
                            <template #empty>
                                <p>Select Co-occurrence file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>
                    
                    <!-- Co-occurrence Column Mapping -->
                    <div v-if="cooccurrenceFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Co-occurrence Columns</h6>
                        <small class="mb-3 block">
                            Map the columns in your file to the required fields: Phenotype 1, Phenotype 2, and Co-occurrence Count.
                        </small>
                        
                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredCooccurrenceFields">
                                <Chip
                                    v-if="Object.values(cooccurrenceMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>
                        
                        <DataTable :value="cooccurrenceTableRows" rowHover>
                            <Column field="column" header="Column" class="col-4">
                            </Column>
                            <Column header=">>" class="col-1"></Column>
                            <Column header="Represents" class="col-7">
                                <template #body="{ data }">
                                    <Dropdown
                                        class="w-full"
                                        :options="cooccurrenceMappingOptions"
                                        option-label="name"
                                        option-value="value"
                                        :option-disabled="
                                            (option) => {
                                                return (
                                                    Object.values(cooccurrenceMapping).includes(option.value) &&
                                                    option.value !== cooccurrenceMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="cooccurrenceMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>
                        
                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Co-occurrence File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!cooccurrenceMappingComplete"
                                @click="uploadCooccurrenceFile"
                                raised
                            />
                            <div v-if="!cooccurrenceMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ cooccurrenceUploadTooltip }}
                            </div>
                        </div>
                    </div>
                    </AccordionTab>
                    
                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Cohort Description *</span>
                                <i v-if="uploadStatus.cohortDescription" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.cohortDescription" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.cohortDescription.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.cohortDescription.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small" 
                                    @click="deleteCohortDescriptionFile"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="cohortDescriptionFile"
                            id="cohortDescriptionFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="handleCohortDescriptionFile"
                            @clear="resetCohortDescriptionFile"
                            @remove="resetCohortDescriptionFile"
                            customUpload
                        >
                            <template #empty>
                                <p>Select Cohort Description file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>
                        
                        <div v-if="cohortDescriptionFile" class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Cohort Description File"
                                class="p-button-primary"
                                icon="bi-upload"
                                @click="uploadCohortDescriptionFile"
                                raised
                            />
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>
    </div>

    <!-- Error Modal -->
    <Dialog
        v-model:visible="store.showNotification"
        modal
        header="Upload Error"
        :style="{ width: '600px' }"
        :closable="true"
        @hide="store.showNotification = false"
    >
        <div class="flex align-items-start">
            <i class="pi pi-exclamation-triangle text-red-500 mr-3 mt-1" style="font-size: 2rem"></i>
            <div class="flex-1">
                <p class="text-lg mb-3">{{ store.errorMessage }}</p>
                
                <!-- Show phenotype link if it's a phenotype error -->
                <div v-if="store.errorMessage && store.errorMessage.toLowerCase().includes('phenotype')" 
                     class="bg-blue-50 p-3 border-l-4 border-blue-400">
                    <p class="text-blue-800 font-medium mb-2">
                        <i class="pi pi-info-circle mr-2"></i>
                        Need help with phenotype codes?
                    </p>
                    <Button
                        label="View Valid Phenotypes"
                        icon="pi pi-external-link"
                        class="p-button-outlined p-button-info p-button-sm"
                        @click="navigateTo('/sgc/phenotypes')"
                    />
                </div>
            </div>
        </div>
        
        <template #footer>
            <Button
                label="OK"
                icon="pi pi-check"
                @click="store.showNotification = false"
                autofocus
            />
        </template>
    </Dialog>

    <Toast position="top-center" group="default"/>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const toast = useToast();
const route = useRoute();
const store = useDatasetStore();

// Get the cohort ID from the route
const cohortId = route.params.id;

// Reactive data
const loading = ref(true);
const cohortData = ref(null);
const metadataSaved = ref(false);

// File upload reactive variables
const activeAccordionIndex = ref(0);

const casesControlsMaleFile = ref(null);
const casesControlsFemaleFile = ref(null);
const cooccurrenceFile = ref(null);
const cohortDescriptionFile = ref(null);
const casesControlsMaleFileName = ref('');
const casesControlsFemaleFileName = ref('');
const cooccurrenceFileName = ref('');
const cohortDescriptionFileName = ref('');

// Upload status tracking
const uploadStatus = ref({
    casesControlsMale: false,
    casesControlsFemale: false,
    casesControlsBoth: false,
    cooccurrence: false,
    cohortDescription: false
});

// Store existing file information for delete functionality
const existingFiles = ref({
    casesControlsMale: null,
    casesControlsFemale: null,
    casesControlsBoth: null,
    cooccurrence: null,
    cohortDescription: null
});

// Male Cases/Controls file sampling and mapping
const casesControlsMaleFileInfo = ref({});
const casesControlsMaleMapping = ref({});

// Female Cases/Controls file sampling and mapping
const casesControlsFemaleFileInfo = ref({});
const casesControlsFemaleMapping = ref({});

// Both Cases/Controls file sampling and mapping
const casesControlsBothFileInfo = ref({});
const casesControlsBothMapping = ref({});

// Co-occurrence file sampling and mapping
const cooccurrenceFileInfo = ref({});
const cooccurrenceMapping = ref({});

// Column mapping options for SGC cases/controls file
const columnMappingOptions = ref([
    { name: "Cases", value: "cases" },
    { name: "Controls", value: "controls" },
    { name: "Phenotype", value: "phenotype" }
]);

// Column mapping options for SGC co-occurrence file
const cooccurrenceMappingOptions = ref([
    { name: "Phenotype 1", value: "phenotype1" },
    { name: "Phenotype 2", value: "phenotype2" },
    { name: "Co-occurrence Count", value: "cooccurrence_count" }
]);

// Required fields for SGC cases/controls mapping
const requiredSGCFields = ref(['cases', 'controls', 'phenotype']);

// Required fields for SGC co-occurrence mapping
const requiredCooccurrenceFields = ref(['phenotype1', 'phenotype2', 'cooccurrence_count']);

// Computed properties
const casesControlsMaleTableRows = computed(() => {
    return casesControlsMaleFileInfo.value.columns
        ? casesControlsMaleFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const casesControlsFemaleTableRows = computed(() => {
    return casesControlsFemaleFileInfo.value.columns
        ? casesControlsFemaleFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const casesControlsBothTableRows = computed(() => {
    return casesControlsBothFileInfo.value.columns
        ? casesControlsBothFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const cooccurrenceTableRows = computed(() => {
    return cooccurrenceFileInfo.value.columns
        ? cooccurrenceFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const casesControlsMaleMappingComplete = computed(() => {
    if (!casesControlsMaleFileInfo.value.columns) return true; // No mapping needed if no file

    const mappedValues = Object.values(casesControlsMaleMapping.value).filter(v => v);

    return requiredSGCFields.value.every(mapping => mappedValues.includes(mapping));
});

const casesControlsFemaleMappingComplete = computed(() => {
    if (!casesControlsFemaleFileInfo.value.columns) return true; // No mapping needed if no file

    const mappedValues = Object.values(casesControlsFemaleMapping.value).filter(v => v);

    return requiredSGCFields.value.every(mapping => mappedValues.includes(mapping));
});

const casesControlsBothMappingComplete = computed(() => {
    if (!casesControlsBothFileInfo.value.columns) return true; // No mapping needed if no file

    const mappedValues = Object.values(casesControlsBothMapping.value).filter(v => v);

    return requiredSGCFields.value.every(mapping => mappedValues.includes(mapping));
});

const cooccurrenceMappingComplete = computed(() => {
    if (!cooccurrenceFileInfo.value.columns) return true; // No mapping needed if no file
    
    const mappedValues = Object.values(cooccurrenceMapping.value).filter(v => v);
    
    return requiredCooccurrenceFields.value.every(mapping => mappedValues.includes(mapping));
});

// Create flipped mapping for API calls (dropdownValue -> columnName)
const flippedCasesControlsMaleMapping = computed(() => {
    return Object.fromEntries(
        Object.entries(casesControlsMaleMapping.value).map(([key, value]) => [
            value,
            key,
        ])
    );
});

const flippedCasesControlsFemaleMapping = computed(() => {
    return Object.fromEntries(
        Object.entries(casesControlsFemaleMapping.value).map(([key, value]) => [
            value,
            key,
        ])
    );
});

const flippedCooccurrenceMapping = computed(() => {
    return Object.fromEntries(
        Object.entries(cooccurrenceMapping.value).map(([key, value]) => [
            value,
            key,
        ])
    );
});

// Computed properties for button tooltips
const casesControlsMaleUploadTooltip = computed(() => {
    const missing = [];
    if (!casesControlsMaleMappingComplete.value) missing.push('Column Mapping');

    if (missing.length === 0) return 'Upload Male Cases/Controls file';
    return `Required: ${missing.join(', ')}`;
});

const casesControlsFemaleUploadTooltip = computed(() => {
    const missing = [];
    if (!casesControlsFemaleMappingComplete.value) missing.push('Column Mapping');

    if (missing.length === 0) return 'Upload Female Cases/Controls file';
    return `Required: ${missing.join(', ')}`;
});

const cooccurrenceUploadTooltip = computed(() => {
    const missing = [];
    if (!cooccurrenceMappingComplete.value) missing.push('Column Mapping');
    
    if (missing.length === 0) return 'Upload Co-occurrence file';
    return `Required: ${missing.join(', ')}`;
});

// Progress tracking computed properties
const metadataCompleted = computed(() => {
    return cohortData.value?.name?.trim() &&
           cohortData.value?.total_sample_size > 0 &&
           cohortData.value?.number_of_males >= 0 &&
           cohortData.value?.number_of_females >= 0 &&
           cohortData.value?.phenotype_coding_system?.trim() &&
           cohortData.value?.phenotype_mapping_issues?.trim() &&
           cohortData.value?.industry_involvement?.trim() &&
           cohortData.value?.industry_authorship !== null &&
           cohortData.value?.data_restrictions?.trim();
});

const allFilesUploaded = computed(() => {
    return uploadStatus.value.casesControlsMale &&
           uploadStatus.value.casesControlsFemale &&
           uploadStatus.value.casesControlsBoth &&
           uploadStatus.value.cooccurrence &&
           uploadStatus.value.cohortDescription;
});

const allTasksCompleted = computed(() => {
    return metadataCompleted.value && allFilesUploaded.value;
});

const remainingFilesCount = computed(() => {
    let count = 0;
    if (!uploadStatus.value.casesControlsMale) count++;
    if (!uploadStatus.value.casesControlsFemale) count++;
    if (!uploadStatus.value.casesControlsBoth) count++;
    if (!uploadStatus.value.cooccurrence) count++;
    if (!uploadStatus.value.cohortDescription) count++;
    return count;
});

const remainingTasksCount = computed(() => {
    let count = 0;
    if (!metadataCompleted.value) count++;
    if (!uploadStatus.value.casesControlsMale) count++;
    if (!uploadStatus.value.casesControlsFemale) count++;
    if (!uploadStatus.value.casesControlsBoth) count++;
    if (!uploadStatus.value.cooccurrence) count++;
    if (!uploadStatus.value.cohortDescription) count++;
    return count;
});

onMounted(async () => {
    try {
        // Load cohort data by ID from the API
        const response = await store.fetchSGCCohort(cohortId);
        
        // The API returns an array of cohort/file data, we need the first item for cohort info
        if (response && response.length > 0) {
            const cohortInfo = response[0]; // First row contains cohort information
            cohortData.value = {
                id: cohortInfo.cohort_id,
                name: cohortInfo.name,
                total_sample_size: cohortInfo.total_sample_size,
                number_of_males: cohortInfo.number_of_males,
                number_of_females: cohortInfo.number_of_females,
                uploaded_by: cohortInfo.uploaded_by,
                created_at: cohortInfo.created_at,
                // Extract cohort metadata fields if they exist
                ...(cohortInfo.cohort_metadata ? {
                    phenotype_coding_system: cohortInfo.cohort_metadata.phenotype_coding_system || '',
                    phenotype_mapping_issues: cohortInfo.cohort_metadata.phenotype_mapping_issues || '',
                    industry_involvement: cohortInfo.cohort_metadata.industry_involvement || '',
                    industry_authorship: cohortInfo.cohort_metadata.industry_authorship,
                    data_restrictions: cohortInfo.cohort_metadata.data_restrictions || ''
                } : {
                    phenotype_coding_system: '',
                    phenotype_mapping_issues: '',
                    industry_involvement: '',
                    industry_authorship: null,
                    data_restrictions: ''
                })
            };
            
            // Check which files have already been uploaded and update UI status
            const uploadedFileTypes = new Set();
            response.forEach(row => {
                if (row.file_type && row.file_name) {
                    uploadedFileTypes.add(row.file_type);
                    
                    // Store file information for delete functionality
                    const fileInfo = {
                        id: row.file_id,
                        name: row.file_name,
                        uploadedAt: row.uploaded_at
                    };
                    
                    if (row.file_type === 'cases_controls_male') {
                        existingFiles.value.casesControlsMale = fileInfo;
                    } else if (row.file_type === 'cases_controls_female') {
                        existingFiles.value.casesControlsFemale = fileInfo;
                    } else if (row.file_type === 'cooccurrence') {
                        existingFiles.value.cooccurrence = fileInfo;
                    } else if (row.file_type === 'cohort_description') {
                        existingFiles.value.cohortDescription = fileInfo;
                    }
                }
            });
            
            // Update upload status based on existing files
            uploadStatus.value = {
                casesControlsMale: uploadedFileTypes.has('cases_controls_male'),
                casesControlsFemale: uploadedFileTypes.has('cases_controls_female'),
                casesControlsBoth: uploadedFileTypes.has('cases_controls_both'),
                cooccurrence: uploadedFileTypes.has('cooccurrence'),
                cohortDescription: uploadedFileTypes.has('cohort_description')
            };

            // Set initial accordion tab based on completion status
            // If everything is complete, leave all tabs closed (activeAccordionIndex = null)
            // Otherwise, open the first incomplete task
            if (allTasksCompleted.value) {
                activeAccordionIndex.value = null;
            } else if (!metadataCompleted.value) {
                activeAccordionIndex.value = 0; // Metadata tab
            } else if (!uploadStatus.value.casesControlsMale) {
                activeAccordionIndex.value = 1; // Male Cases/Controls tab
            } else if (!uploadStatus.value.casesControlsFemale) {
                activeAccordionIndex.value = 2; // Female Cases/Controls tab
            } else if (!uploadStatus.value.casesControlsBoth) {
                activeAccordionIndex.value = 3; // Both Cases/Controls tab
            } else if (!uploadStatus.value.cooccurrence) {
                activeAccordionIndex.value = 4; // Co-occurrence tab
            } else if (!uploadStatus.value.cohortDescription) {
                activeAccordionIndex.value = 5; // Cohort Description tab
            }

            // If this is an existing cohort with data, show file upload immediately
            metadataSaved.value = true;
        } else {
            throw new Error('Cohort not found');
        }
        
    } catch (error) {
        console.error('Error loading cohort:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load cohort information. Cohort may not exist.',
            life: 5000
        });
        // Redirect back to index if cohort not found
        setTimeout(() => {
            navigateTo('/sgc');
        }, 2000);
    } finally {
        loading.value = false;
    }
});

// Handle metadata update
function handleMetadataUpdated(response) {
    console.log('Metadata updated:', response);
    // Update cohort data with all fields from the response
    cohortData.value = {
        ...cohortData.value,
        id: response.cohort_id || response.id, // Handle both field names
        name: response.name,
        total_sample_size: response.total_sample_size,
        number_of_males: response.number_of_males,
        number_of_females: response.number_of_females
    };
    // Show the file upload accordion
    metadataSaved.value = true;
}

// Generic file handlers
async function handleCasesControlsFile(e, gender) {
    store.showNotification = false;

    const fileRef = gender === 'male' ? casesControlsMaleFile : casesControlsFemaleFile;
    const fileNameRef = gender === 'male' ? casesControlsMaleFileName : casesControlsFemaleFileName;
    const fileInfoRef = gender === 'male' ? casesControlsMaleFileInfo : casesControlsFemaleFileInfo;
    const mappingRef = gender === 'male' ? casesControlsMaleMapping : casesControlsFemaleMapping;

    fileRef.value = e.files[0];
    fileNameRef.value = e.files[0]?.name || '';

    try {
        fileInfoRef.value = await store.sampleTextFile(e.files[0]);

        if (fileInfoRef.value.columns) {
            fileInfoRef.value.columns.forEach((col) => {
                mappingRef.value[col] = null;
            });

            toast.add({
                severity: 'success',
                summary: 'File Loaded',
                detail: `Found ${fileInfoRef.value.columns.length} columns. Please map them below.`,
                life: 3000
            });
        } else {
            throw new Error('No columns found in API response');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'File Error',
            detail: `Error processing the ${gender === 'male' ? 'Male' : 'Female'} Cases/Controls file. Please check the file format.`,
            life: 5000
        });
        fileInfoRef.value = {};
        mappingRef.value = {};
    }
}

// Wrapper functions for template usage
function handleCasesControlsMaleFile(e) {
    return handleCasesControlsFile(e, 'male');
}

function handleCasesControlsFemaleFile(e) {
    return handleCasesControlsFile(e, 'female');
}

async function handleCooccurrenceFile(e) {
    store.showNotification = false;
    cooccurrenceFile.value = e.files[0];
    cooccurrenceFileName.value = e.files[0]?.name || '';
    
    try {
        cooccurrenceFileInfo.value = await store.sampleTextFile(e.files[0]);
        
        if (cooccurrenceFileInfo.value.columns) {
            cooccurrenceFileInfo.value.columns.forEach((col) => {
                cooccurrenceMapping.value[col] = null;
            });
            
            toast.add({
                severity: 'success',
                summary: 'File Loaded',
                detail: `Found ${cooccurrenceFileInfo.value.columns.length} columns. Please map them below.`,
                life: 3000
            });
        } else {
            throw new Error('No columns found in API response');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'File Error',
            detail: 'Error processing the Co-occurrence file. Please check the file format.',
            life: 5000
        });
        cooccurrenceFileInfo.value = {};
        cooccurrenceMapping.value = {};
    }
}

function handleCohortDescriptionFile(e) {
    cohortDescriptionFile.value = e.files[0];
    cohortDescriptionFileName.value = e.files[0]?.name || '';
}

// Generic upload method for cases/controls files
async function uploadCasesControlsFile(gender) {
    const genderLabel = gender === 'male' ? 'Male' : 'Female';
    const mappingCompleteRef = gender === 'male' ? casesControlsMaleMappingComplete : casesControlsFemaleMappingComplete;
    const fileRef = gender === 'male' ? casesControlsMaleFile : casesControlsFemaleFile;
    const fileNameRef = gender === 'male' ? casesControlsMaleFileName : casesControlsFemaleFileName;
    const fileInfoRef = gender === 'male' ? casesControlsMaleFileInfo : casesControlsFemaleFileInfo;
    const mappingRef = gender === 'male' ? casesControlsMaleMapping : casesControlsFemaleMapping;
    const flippedMappingRef = gender === 'male' ? flippedCasesControlsMaleMapping : flippedCasesControlsFemaleMapping;
    const statusKey = gender === 'male' ? 'casesControlsMale' : 'casesControlsFemale';
    const existingFilesKey = gender === 'male' ? 'casesControlsMale' : 'casesControlsFemale';

    if (!mappingCompleteRef.value) {
        toast.add({
            severity: 'error',
            summary: 'Mapping Required',
            detail: 'Please map all required columns before uploading',
            life: 3000
        });
        return;
    }

    try {
        // Upload, validate and store the file in one step
        const result = await store.uploadSGCFile(
            fileRef.value,
            cohortId,
            `cases_controls_${gender}`,
            `cases_controls_${gender}`,
            flippedMappingRef.value
        );

        // Mark as uploaded and update UI
        uploadStatus.value[statusKey] = true;

        // Store file information for delete functionality
        existingFiles.value[existingFilesKey] = {
            id: result.file_id || result.id, // Handle both possible field names
            name: fileRef.value.name,
            uploadedAt: new Date().toISOString()
        };

        // Clear the file input since it's now uploaded
        fileRef.value = null;
        fileNameRef.value = '';
        fileInfoRef.value = {};
        mappingRef.value = {};

        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: `${genderLabel} Cases/Controls file uploaded and processed successfully`,
            life: 3000
        });

        // Close current accordion and open next
        openNextAccordion();

    } catch (error) {
        console.error('Upload error:', error);
        store.processing = false;

        // Handle server validation errors (400 responses)
        let errorMessage = `Failed to upload ${genderLabel} Cases/Controls file`;
        let isPhenotypeError = false;

        if (error.status === 400 || error.response?.status === 400) {
            // Server returned validation errors - check both error.data and error.response.data
            const errorData = error.data || error.response?.data;

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.detail) {
                errorMessage = errorData.detail;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }

            // Check if this is a phenotype-related error
            isPhenotypeError = errorMessage.toLowerCase().includes('phenotype') &&
                             (errorMessage.includes('not found') ||
                              errorMessage.includes('invalid') ||
                              errorMessage.includes('does not exist'));
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Add phenotype link if it's a phenotype error
        if (isPhenotypeError) {
            errorMessage += '\n\nView valid phenotypes: /phenotypes';
        }

        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: errorMessage,
            life: isPhenotypeError ? 10000 : 8000 // Even longer for phenotype errors
        });
    }
}

// Wrapper functions for template usage
function uploadCasesControlsMaleFile() {
    return uploadCasesControlsFile('male');
}

function uploadCasesControlsFemaleFile() {
    return uploadCasesControlsFile('female');
}

async function uploadCooccurrenceFile() {
    if (!cooccurrenceMappingComplete.value) {
        toast.add({
            severity: 'error',
            summary: 'Mapping Required',
            detail: 'Please map all required columns before uploading',
            life: 3000
        });
        return;
    }
    
    try {
        // Upload, validate and store the file in one step
        const result = await store.uploadSGCFile(
            cooccurrenceFile.value, 
            cohortId, 
            'cooccurrence', 
            'cooccurrence', 
            flippedCooccurrenceMapping.value
        );
        
        // Mark as uploaded and update UI
        uploadStatus.value.cooccurrence = true;
        
        // Store file information for delete functionality
        existingFiles.value.cooccurrence = {
            id: result.file_id || result.id, // Handle both possible field names
            name: cooccurrenceFile.value.name,
            uploadedAt: new Date().toISOString()
        };
        
        // Clear the file input since it's now uploaded
        cooccurrenceFile.value = null;
        cooccurrenceFileName.value = '';
        cooccurrenceFileInfo.value = {};
        cooccurrenceMapping.value = {};
        
        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'Co-occurrence file uploaded and processed successfully',
            life: 3000
        });
        
        // Close current accordion and open next
        openNextAccordion();
        
    } catch (error) {
        console.error('Upload error:', error);
        store.processing = false;
        
        // Handle server validation errors (400 responses)
        let errorMessage = 'Failed to upload Co-occurrence file';
        let isPhenotypeError = false;
        
        if (error.status === 400 || error.response?.status === 400) {
            // Server returned validation errors - check both error.data and error.response.data
            const errorData = error.data || error.response?.data;
            
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.detail) {
                errorMessage = errorData.detail;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
            
            // Check if this is a phenotype-related error
            isPhenotypeError = errorMessage.toLowerCase().includes('phenotype') && 
                             (errorMessage.includes('not found') || 
                              errorMessage.includes('invalid') || 
                              errorMessage.includes('does not exist'));
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        // Add phenotype link if it's a phenotype error
        if (isPhenotypeError) {
            errorMessage += '\n\nView valid phenotypes: /phenotypes';
        }
        
        toast.add({
            severity: 'error',
            summary: 'Upload Error', 
            detail: errorMessage,
            life: 10000 // Even longer display time for validation errors with links
        });
    }
}

async function uploadCohortDescriptionFile() {
    if (!cohortDescriptionFile.value) {
        toast.add({
            severity: 'error',
            summary: 'File Required',
            detail: 'Please select a cohort description file',
            life: 3000
        });
        return;
    }
    
    try {
        // Upload and store the cohort description file (no validation required)
        const result = await store.uploadSGCFile(
            cohortDescriptionFile.value, 
            cohortId, 
            'cohort_description', 
            'cohort_description',
            {}
        );
        
        // Mark as uploaded and update UI
        uploadStatus.value.cohortDescription = true;
        
        // Store file information for delete functionality (similar to other file types)
        existingFiles.value.cohortDescription = {
            id: result.file_id || result.id, // Handle both possible field names
            name: cohortDescriptionFile.value.name,
            uploadedAt: new Date().toISOString()
        };
        
        // Clear the file input since it's now uploaded
        cohortDescriptionFile.value = null;
        cohortDescriptionFileName.value = '';
        
        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'Cohort Description file uploaded successfully',
            life: 3000
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        store.processing = false;
        
        // Handle server validation errors (400 responses)
        let errorMessage = 'Failed to upload Cohort Description file';
        if (error.status === 400 || error.response?.status === 400) {
            // Server returned validation errors - check both error.data and error.response.data
            const errorData = error.data || error.response?.data;
            
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.detail) {
                errorMessage = errorData.detail;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: errorMessage,
            life: 8000 // Longer display time for validation errors
        });
    }
}

// Generic reset function for cases/controls files
function resetCasesControlsFile(gender) {
    const fileRef = gender === 'male' ? casesControlsMaleFile : casesControlsFemaleFile;
    const fileNameRef = gender === 'male' ? casesControlsMaleFileName : casesControlsFemaleFileName;
    const fileInfoRef = gender === 'male' ? casesControlsMaleFileInfo : casesControlsFemaleFileInfo;
    const mappingRef = gender === 'male' ? casesControlsMaleMapping : casesControlsFemaleMapping;
    const statusKey = gender === 'male' ? 'casesControlsMale' : 'casesControlsFemale';

    fileRef.value = null;
    fileNameRef.value = '';
    fileInfoRef.value = {};
    mappingRef.value = {};
    uploadStatus.value[statusKey] = false;
}

// Wrapper functions for template usage
function resetCasesControlsMaleFile() {
    return resetCasesControlsFile('male');
}

function resetCasesControlsFemaleFile() {
    return resetCasesControlsFile('female');
}

function resetCooccurrenceFile() {
    cooccurrenceFile.value = null;
    cooccurrenceFileName.value = '';
    cooccurrenceFileInfo.value = {};
    cooccurrenceMapping.value = {};
    uploadStatus.value.cooccurrence = false;
}

function resetCohortDescriptionFile() {
    cohortDescriptionFile.value = null;
    cohortDescriptionFileName.value = '';
    uploadStatus.value.cohortDescription = false;
}

// Generic delete function for cases/controls files
async function deleteCasesControlsFile(gender) {
    const genderLabel = gender === 'male' ? 'Male' : 'Female';
    const statusKey = gender === 'male' ? 'casesControlsMale' : 'casesControlsFemale';
    const existingFilesKey = gender === 'male' ? 'casesControlsMale' : 'casesControlsFemale';

    if (!existingFiles.value[existingFilesKey]?.id) return;

    try {
        await store.deleteSGCFile(existingFiles.value[existingFilesKey].id);

        // Update UI state
        uploadStatus.value[statusKey] = false;
        existingFiles.value[existingFilesKey] = null;

        toast.add({
            severity: 'success',
            summary: 'File Deleted',
            detail: `${genderLabel} Cases/Controls file has been deleted successfully`,
            life: 3000
        });

    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Delete Error',
            detail: `Failed to delete ${genderLabel} Cases/Controls file`,
            life: 5000
        });
    }
}

// Wrapper functions for template usage
function deleteCasesControlsMaleFile() {
    return deleteCasesControlsFile('male');
}

function deleteCasesControlsFemaleFile() {
    return deleteCasesControlsFile('female');
}

async function deleteCooccurrenceFile() {
    if (!existingFiles.value.cooccurrence?.id) return;
    
    try {
        await store.deleteSGCFile(existingFiles.value.cooccurrence.id);
        
        // Update UI state
        uploadStatus.value.cooccurrence = false;
        existingFiles.value.cooccurrence = null;
        
        toast.add({
            severity: 'success',
            summary: 'File Deleted',
            detail: 'Co-occurrence file has been deleted successfully',
            life: 3000
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Delete Error',
            detail: 'Failed to delete Co-occurrence file',
            life: 5000
        });
    }
}

async function deleteCohortDescriptionFile() {
    if (!existingFiles.value.cohortDescription?.id) return;
    
    try {
        await store.deleteSGCFile(existingFiles.value.cohortDescription.id);
        
        // Update UI state
        uploadStatus.value.cohortDescription = false;
        existingFiles.value.cohortDescription = null;
        
        toast.add({
            severity: 'success',
            summary: 'File Deleted',
            detail: 'Cohort Description file has been deleted successfully',
            life: 3000
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Delete Error',
            detail: 'Failed to delete Cohort Description file',
            life: 5000
        });
    }
}

// Function to open next available accordion
function openNextAccordion() {
    // Close current accordion first
    activeAccordionIndex.value = null;

    // After a brief delay, open the next accordion
    setTimeout(() => {
        // Check tasks in order and open the first incomplete one
        if (!metadataCompleted.value) {
            activeAccordionIndex.value = 0; // Metadata tab
        } else if (!uploadStatus.value.casesControlsMale) {
            activeAccordionIndex.value = 1; // Male Cases/Controls tab
        } else if (!uploadStatus.value.casesControlsFemale) {
            activeAccordionIndex.value = 2; // Female Cases/Controls tab
        } else if (!uploadStatus.value.casesControlsBoth) {
            activeAccordionIndex.value = 3; // Both Cases/Controls tab
        } else if (!uploadStatus.value.cooccurrence) {
            activeAccordionIndex.value = 4; // Co-occurrence tab
        } else if (!uploadStatus.value.cohortDescription) {
            activeAccordionIndex.value = 5; // Cohort Description tab
        }
        // If all tasks completed, leave all accordions closed
        else if (allTasksCompleted.value) {
            activeAccordionIndex.value = null;
        }
    }, 500);
}
</script>

<style scoped>
.field label {
    font-weight: 600;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.field p {
    margin: 0;
    font-size: 1rem;
}

.p-chip.selected-chip {
    background-color: #24cb67;
    color: white;
}

.required-card {
    border: 1px dashed #ccc;
    padding: 0.5rem;
    margin-top: 1rem;
}

.required-card h6 {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
}
</style>
