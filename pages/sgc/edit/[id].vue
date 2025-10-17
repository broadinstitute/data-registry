<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Upload Files/Edit Cohort
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
                    Complete the cohort metadata and upload the required files for male and female data. <strong>All files must be comma-delimited (.csv) or tab-delimited (.tsv, .txt)</strong>. Note: .txt files are accepted but must contain comma or tab-separated values internally.
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
                            <i v-if="uploadStatus.cooccurrenceMale"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.cooccurrenceMale, 'text-red-600': !uploadStatus.cooccurrenceMale}">
                                Male Co-occurrence Data
                            </span>
                        </div>
                        <div class="flex align-items-center gap-2">
                            <i v-if="uploadStatus.cooccurrenceFemale"
                               class="pi pi-check-circle text-green-500"
                               style="font-size: 1.2rem"></i>
                            <i v-else
                               class="pi pi-times-circle text-red-500"
                               style="font-size: 1.2rem"></i>
                            <span :class="{'text-green-600 font-medium': uploadStatus.cooccurrenceFemale, 'text-red-600': !uploadStatus.cooccurrenceFemale}">
                                Female Co-occurrence Data
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
                    <div v-if="allTasksCompleted && !validationPassed" class="text-center mt-3 p-3" style="background-color: var(--blue-50); border: 1px solid var(--blue-200); border-radius: 6px;">
                        <i class="pi pi-info-circle text-blue-600 mr-2" style="font-size: 1.5rem"></i>
                        <div class="mb-3">
                            <span class="text-blue-800 font-medium text-lg">All files uploaded successfully!</span>
                            <p class="text-blue-700 text-sm mt-2 mb-0">Ready to run inter-file validations to finalize your cohort upload.</p>
                        </div>

                        <div>
                            <Button
                                label="Run Inter-File Validations"
                                icon="pi pi-cog"
                                class="p-button-info"
                                @click="validateAllConsistency"
                                :loading="validatingConsistency"
                            />
                        </div>
                    </div>
                    
                    <!-- Validation Complete Status -->
                    <div v-if="validationPassed" class="text-center mt-3 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                        <i class="pi pi-check-circle text-green-600 mr-2" style="font-size: 1.5rem"></i>
                        <div>
                            <span class="text-green-800 font-medium text-lg">Cohort upload complete!</span>
                            <p class="text-green-700 text-sm mt-2 mb-0">All files uploaded and validated successfully. Your cohort is now finalized.</p>
                        </div>
                    </div>
                    <div v-else-if="!validationPassed && remainingTasksCount > 0" class="text-center mt-3 p-2" style="background-color: var(--orange-100); border: 1px solid var(--orange-300); border-radius: 6px;">
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
                                    @click="() => deleteCasesControlsFile('male')"
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
                            @select="(e) => handleCasesControlsFile(e, 'male')"
                            @clear="() => resetCasesControlsFile('male')"
                            @remove="() => resetCasesControlsFile('male')"
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
                                @click="() => uploadCasesControlsFile('male')"
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
                                    @click="() => deleteCasesControlsFile('female')"
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
                            @select="(e) => handleCasesControlsFile(e, 'female')"
                            @clear="() => resetCasesControlsFile('female')"
                            @remove="() => resetCasesControlsFile('female')"
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
                                @click="() => uploadCasesControlsFile('female')"
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
                                <span>Male Co-occurrence Data *</span>
                                <i v-if="uploadStatus.cooccurrenceMale" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.cooccurrenceMale" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.cooccurrenceMale.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.cooccurrenceMale.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small"
                                    @click="() => deleteCooccurrenceFile('male')"
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
                            @select="(e) => handleCooccurrenceFile(e, 'male')"
                            @clear="() => resetCooccurrenceFile('male')"
                            @remove="() => resetCooccurrenceFile('male')"
                            customUpload
                        >
                            <template #empty>
                                <p>Select Male Co-occurrence file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>
                    
                    <!-- Male Co-occurrence Column Mapping -->
                    <div v-if="cooccurrenceMaleFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Male Co-occurrence Columns</h6>
                        
                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredCooccurrenceFields">
                                <Chip
                                    v-if="Object.values(cooccurrenceMaleMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>
                        
                        <DataTable :value="cooccurrenceMaleTableRows" rowHover>
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
                                                    Object.values(cooccurrenceMaleMapping).includes(option.value) &&
                                                    option.value !== cooccurrenceMaleMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="cooccurrenceMaleMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>
                        
                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Male Co-occurrence File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!cooccurrenceMaleMappingComplete"
                                @click="() => uploadCooccurrenceFile('male')"
                                raised
                            />
                            <div v-if="!cooccurrenceMaleMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ cooccurrenceMaleUploadTooltip }}
                            </div>
                        </div>
                    </div>
                    </AccordionTab>

                    <AccordionTab>
                        <template #header>
                            <div class="flex items-center gap-2">
                                <span>Female Co-occurrence Data *</span>
                                <i v-if="uploadStatus.cooccurrenceFemale" class="pi pi-check text-green-500"></i>
                            </div>
                        </template>
                        <!-- Existing File Display -->
                        <div v-if="existingFiles.cooccurrenceFemale" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-file-check text-green-600" style="font-size: 1.5rem"></i>
                                    <div>
                                        <p class="font-medium text-green-800 mb-1">{{ existingFiles.cooccurrenceFemale.name }}</p>
                                        <small class="text-green-600">Uploaded {{ new Date(existingFiles.cooccurrenceFemale.uploadedAt).toLocaleDateString() }}</small>
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    text
                                    size="small"
                                    @click="() => deleteCooccurrenceFile('female')"
                                    title="Delete this file"
                                />
                            </div>
                        </div>

                        <FileUpload
                            v-else
                            name="cooccurrenceFemaleFile"
                            id="cooccurrenceFemaleFile"
                            accept=".txt,.csv,.tsv"
                            :showUploadButton="false"
                            :previewWidth="0"
                            @select="(e) => handleCooccurrenceFile(e, 'female')"
                            @clear="() => resetCooccurrenceFile('female')"
                            @remove="() => resetCooccurrenceFile('female')"
                            customUpload
                            :multiple="false"
                        >
                            <template #empty>
                                <p>Select Female Co-occurrence file (.txt, .csv, .tsv)</p>
                            </template>
                        </FileUpload>

                    <!-- Female Co-occurrence Column Mapping -->
                    <div v-if="cooccurrenceFemaleFileInfo.columns" class="mt-4">
                        <h6 class="mb-3">Map Female Co-occurrence Columns</h6>

                        <div class="card flex flex-wrap gap-1 required-card mb-3">
                            <h6 class="w-full">Required fields:</h6>
                            <template v-for="field in requiredCooccurrenceFields">
                                <Chip
                                    v-if="Object.values(cooccurrenceFemaleMapping).includes(field)"
                                    :key="field"
                                    icon="bi-check"
                                    :label="field"
                                    class="selected-chip"
                                />
                                <Chip v-else :label="field" :key="'else-' + field" />
                            </template>
                        </div>

                        <DataTable :value="cooccurrenceFemaleTableRows" rowHover>
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
                                                    Object.values(cooccurrenceFemaleMapping).includes(option.value) &&
                                                    option.value !== cooccurrenceFemaleMapping[data.column]
                                                );
                                            }
                                        "
                                        v-model="cooccurrenceFemaleMapping[data.column]"
                                        showClear
                                        placeholder="Select mapping"
                                    />
                                </template>
                            </Column>
                        </DataTable>

                        <div class="text-center mt-3">
                            <Button
                                type="button"
                                label="Upload Female Co-occurrence File"
                                class="p-button-primary"
                                icon="bi-upload"
                                :disabled="!cooccurrenceFemaleMappingComplete"
                                @click="() => uploadCooccurrenceFile('female')"
                                raised
                            />
                            <div v-if="!cooccurrenceFemaleMappingComplete" class="text-sm text-gray-500 mt-2">
                                {{ cooccurrenceFemaleUploadTooltip }}
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
        header="Error"
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
const validatingConsistency = ref(false);
const validationPassed = ref(false);

// File upload reactive variables
const activeAccordionIndex = ref(0);

const casesControlsMaleFile = ref(null);
const casesControlsFemaleFile = ref(null);
const cooccurrenceMaleFile = ref(null);
const cooccurrenceFemaleFile = ref(null);
const cohortDescriptionFile = ref(null);
const casesControlsMaleFileName = ref('');
const casesControlsFemaleFileName = ref('');
const cooccurrenceMaleFileName = ref('');
const cooccurrenceFemaleFileName = ref('');
const cohortDescriptionFileName = ref('');

// Upload status tracking
const uploadStatus = ref({
    casesControlsMale: false,
    casesControlsFemale: false,
    cooccurrenceMale: false,
    cooccurrenceFemale: false,
    cohortDescription: false
});

// Store existing file information for delete functionality
const existingFiles = ref({
    casesControlsMale: null,
    casesControlsFemale: null,
    cooccurrenceMale: null,
    cooccurrenceFemale: null,
    cohortDescription: null
});

// Male Cases/Controls file sampling and mapping
const casesControlsMaleFileInfo = ref({});
const casesControlsMaleMapping = ref({});

// Female Cases/Controls file sampling and mapping
const casesControlsFemaleFileInfo = ref({});
const casesControlsFemaleMapping = ref({});


// Co-occurrence file sampling and mapping
const cooccurrenceFileInfo = ref({});
const cooccurrenceMapping = ref({});

// Male Co-occurrence file sampling and mapping
const cooccurrenceMaleFileInfo = ref({});
const cooccurrenceMaleMapping = ref({});

// Female Co-occurrence file sampling and mapping
const cooccurrenceFemaleFileInfo = ref({});
const cooccurrenceFemaleMapping = ref({});


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


const cooccurrenceTableRows = computed(() => {
    return cooccurrenceFileInfo.value.columns
        ? cooccurrenceFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const cooccurrenceMaleTableRows = computed(() => {
    return cooccurrenceMaleFileInfo.value.columns
        ? cooccurrenceMaleFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const cooccurrenceFemaleTableRows = computed(() => {
    return cooccurrenceFemaleFileInfo.value.columns
        ? cooccurrenceFemaleFileInfo.value.columns.map((value) => ({
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


const cooccurrenceMappingComplete = computed(() => {
    if (!cooccurrenceFileInfo.value.columns) return true; // No mapping needed if no file
    
    const mappedValues = Object.values(cooccurrenceMapping.value).filter(v => v);
    
    return requiredCooccurrenceFields.value.every(mapping => mappedValues.includes(mapping));
});

// Helper function to create flipped mapping for API calls (dropdownValue -> columnName)
function createFlippedMapping(mappingRef) {
    return Object.fromEntries(
        Object.entries(mappingRef.value).map(([key, value]) => [
            value,
            key,
        ])
    );
}

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

const cooccurrenceMaleMappingComplete = computed(() => {
    if (!cooccurrenceMaleFileInfo.value.columns) return true; // No mapping needed if no file

    const mappedValues = Object.values(cooccurrenceMaleMapping.value).filter(v => v);

    return requiredCooccurrenceFields.value.every(mapping => mappedValues.includes(mapping));
});

const cooccurrenceFemaleMappingComplete = computed(() => {
    if (!cooccurrenceFemaleFileInfo.value.columns) return true; // No mapping needed if no file

    const mappedValues = Object.values(cooccurrenceFemaleMapping.value).filter(v => v);

    return requiredCooccurrenceFields.value.every(mapping => mappedValues.includes(mapping));
});


const cooccurrenceMaleUploadTooltip = computed(() => {
    const missing = [];
    if (!cooccurrenceMaleMappingComplete.value) missing.push('Column Mapping');

    if (missing.length === 0) return 'Upload Male Co-occurrence file';
    return `Required: ${missing.join(', ')}`;
});

const cooccurrenceFemaleUploadTooltip = computed(() => {
    const missing = [];
    if (!cooccurrenceFemaleMappingComplete.value) missing.push('Column Mapping');

    if (missing.length === 0) return 'Upload Female Co-occurrence file';
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
           uploadStatus.value.cooccurrenceMale &&
           uploadStatus.value.cooccurrenceFemale &&
           uploadStatus.value.cohortDescription;
});

const allTasksCompleted = computed(() => {
    return metadataCompleted.value && allFilesUploaded.value;
});

const remainingFilesCount = computed(() => {
    let count = 0;
    if (!uploadStatus.value.casesControlsMale) count++;
    if (!uploadStatus.value.casesControlsFemale) count++;
    if (!uploadStatus.value.cooccurrenceMale) count++;
    if (!uploadStatus.value.cooccurrenceFemale) count++;
    if (!uploadStatus.value.cohortDescription) count++;
    return count;
});

const remainingTasksCount = computed(() => {
    let count = 0;
    if (!metadataCompleted.value) count++;
    if (!uploadStatus.value.casesControlsMale) count++;
    if (!uploadStatus.value.casesControlsFemale) count++;
    if (!uploadStatus.value.cooccurrenceMale) count++;
    if (!uploadStatus.value.cooccurrenceFemale) count++;
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
                    } else if (row.file_type === 'cooccurrence_male') {
                        existingFiles.value.cooccurrenceMale = fileInfo;
                    } else if (row.file_type === 'cooccurrence_female') {
                        existingFiles.value.cooccurrenceFemale = fileInfo;
                    } else if (row.file_type === 'cohort_description') {
                        existingFiles.value.cohortDescription = fileInfo;
                    }
                }
            });
            
            // Update upload status based on existing files
            uploadStatus.value = {
                casesControlsMale: uploadedFileTypes.has('cases_controls_male'),
                casesControlsFemale: uploadedFileTypes.has('cases_controls_female'),
                cooccurrenceMale: uploadedFileTypes.has('cooccurrence_male'),
                cooccurrenceFemale: uploadedFileTypes.has('cooccurrence_female'),
                cohortDescription: uploadedFileTypes.has('cohort_description')
            };
            
            // Initialize validation status from cohort data
            console.log('cohortInfo.validation_status:', cohortInfo.validation_status);
            console.log('Type of validation_status:', typeof cohortInfo.validation_status);
            validationPassed.value = !!cohortInfo.validation_status;
            console.log('Set validationPassed to:', validationPassed.value);

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
            } else if (!uploadStatus.value.cooccurrenceMale) {
                activeAccordionIndex.value = 3; // Male Co-occurrence tab
            } else if (!uploadStatus.value.cooccurrenceFemale) {
                activeAccordionIndex.value = 4; // Female Co-occurrence tab
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
    console.log('Current cohortData before update:', cohortData.value);
    
    // Handle the response - it could be an array (like fetch) or an object
    const cohortInfo = Array.isArray(response) ? response[0] : response;
    
    // Create the updated data object
    const updatedData = {
        ...cohortData.value,
        id: cohortInfo.cohort_id || cohortInfo.id, // Handle both field names
        name: cohortInfo.name,
        total_sample_size: cohortInfo.total_sample_size,
        number_of_males: cohortInfo.number_of_males,
        number_of_females: cohortInfo.number_of_females,
        uploaded_by: cohortInfo.uploaded_by,
        created_at: cohortInfo.created_at,
        updated_at: cohortInfo.updated_at,
        // Extract cohort metadata fields if they exist
        ...(cohortInfo.cohort_metadata ? {
            phenotype_coding_system: cohortInfo.cohort_metadata.phenotype_coding_system || '',
            phenotype_mapping_issues: cohortInfo.cohort_metadata.phenotype_mapping_issues || '',
            industry_involvement: cohortInfo.cohort_metadata.industry_involvement || '',
            industry_authorship: cohortInfo.cohort_metadata.industry_authorship,
            data_restrictions: cohortInfo.cohort_metadata.data_restrictions || ''
        } : {
            phenotype_coding_system: cohortData.value.phenotype_coding_system || '',
            phenotype_mapping_issues: cohortData.value.phenotype_mapping_issues || '',
            industry_involvement: cohortData.value.industry_involvement || '',
            industry_authorship: cohortData.value.industry_authorship,
            data_restrictions: cohortData.value.data_restrictions || ''
        })
    };
    
    console.log('Updated cohortData after processing:', updatedData);
    
    // Update cohort data
    cohortData.value = updatedData;
    
    // Reset validation status since metadata has changed
    validationPassed.value = false;
    
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
        const genderLabel = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Both';
        toast.add({
            severity: 'error',
            summary: 'File Error',
            detail: `Error processing the ${genderLabel} Cases/Controls file. Please check the file format.`,
            life: 5000
        });
        fileInfoRef.value = {};
        mappingRef.value = {};
    }
}


async function handleCooccurrenceFile(e, gender = 'male') {
    const genderLabel = gender === 'male' ? 'Male' : 'Female';
    const fileRef = gender === 'male' ? cooccurrenceMaleFile : cooccurrenceFemaleFile;
    const fileNameRef = gender === 'male' ? cooccurrenceMaleFileName : cooccurrenceFemaleFileName;
    const fileInfoRef = gender === 'male' ? cooccurrenceMaleFileInfo : cooccurrenceFemaleFileInfo;
    const mappingRef = gender === 'male' ? cooccurrenceMaleMapping : cooccurrenceFemaleMapping;

    store.showNotification = false;
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
            detail: `Error processing the ${genderLabel} Co-occurrence file. Please check the file format.`,
            life: 5000
        });
        fileInfoRef.value = {};
        mappingRef.value = {};
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
    const flippedMapping = createFlippedMapping(mappingRef);
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
            flippedMapping
        );

        // Mark as uploaded and update UI
        uploadStatus.value[statusKey] = true;
        
        // Reset validation status since derived 'both' files need to be regenerated
        validationPassed.value = false;

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

        // Check for warnings and display them
        if (result.warnings && result.warnings.length > 0) {
            // Display warning toast message
            const warningText = result.warnings.join(', ');
            toast.add({
                severity: 'warn',
                summary: 'Upload Complete with Warnings',
                detail: `${genderLabel} Cases/Controls file uploaded successfully, but with warnings: ${warningText}`,
                life: 30000,
                group: 'default'
            });
        } else {
            // Display standard success message
            toast.add({
                severity: 'success',
                summary: 'Upload Successful',
                detail: `${genderLabel} Cases/Controls file uploaded and processed successfully`,
                life: 3000
            });
        }

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


async function uploadCooccurrenceFile(gender = 'male') {
    const genderLabel = gender === 'male' ? 'Male' : 'Female';
    const mappingCompleteRef = gender === 'male' ? cooccurrenceMaleMappingComplete : cooccurrenceFemaleMappingComplete;
    const fileRef = gender === 'male' ? cooccurrenceMaleFile : cooccurrenceFemaleFile;
    const fileNameRef = gender === 'male' ? cooccurrenceMaleFileName : cooccurrenceFemaleFileName;
    const fileInfoRef = gender === 'male' ? cooccurrenceMaleFileInfo : cooccurrenceFemaleFileInfo;
    const mappingRef = gender === 'male' ? cooccurrenceMaleMapping : cooccurrenceFemaleMapping;
    const statusKey = gender === 'male' ? 'cooccurrenceMale' : 'cooccurrenceFemale';
    const existingFilesKey = gender === 'male' ? 'cooccurrenceMale' : 'cooccurrenceFemale';

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
            `cooccurrence_${gender}`,
            statusKey,
            createFlippedMapping(mappingRef)
        );

        // Mark as uploaded and update UI
        uploadStatus.value[statusKey] = true;
        
        // Reset validation status since derived 'both' files need to be regenerated
        validationPassed.value = false;

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

        // Check for warnings and display them
        if (result.warnings && result.warnings.length > 0) {
            // Display warning toast message
            const warningText = result.warnings.join(', ');
            toast.add({
                severity: 'warn',
                summary: 'Upload Complete with Warnings',
                detail: `${genderLabel} Co-occurrence file uploaded successfully, but with warnings: ${warningText}`,
                life: 30000,
                group: 'default'
            });
        } else {
            // Display standard success message
            toast.add({
                severity: 'success',
                summary: 'Upload Successful',
                detail: `${genderLabel} Co-occurrence file uploaded and processed successfully`,
                life: 3000
            });
        }

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


function resetCooccurrenceFile(gender = 'male') {
    const fileRef = gender === 'male' ? cooccurrenceMaleFile : cooccurrenceFemaleFile;
    const fileNameRef = gender === 'male' ? cooccurrenceMaleFileName : cooccurrenceFemaleFileName;
    const fileInfoRef = gender === 'male' ? cooccurrenceMaleFileInfo : cooccurrenceFemaleFileInfo;
    const mappingRef = gender === 'male' ? cooccurrenceMaleMapping : cooccurrenceFemaleMapping;
    const statusKey = gender === 'male' ? 'cooccurrenceMale' : 'cooccurrenceFemale';

    fileRef.value = null;
    fileNameRef.value = '';
    fileInfoRef.value = {};
    mappingRef.value = {};
    uploadStatus.value[statusKey] = false;
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
        
        // Reset validation status since derived 'both' files need to be regenerated
        validationPassed.value = false;

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


async function deleteCooccurrenceFile(gender = 'male') {
    const genderLabel = gender === 'male' ? 'Male' : 'Female';
    const statusKey = gender === 'male' ? 'cooccurrenceMale' : 'cooccurrenceFemale';
    const existingFilesKey = gender === 'male' ? 'cooccurrenceMale' : 'cooccurrenceFemale';

    if (!existingFiles.value[existingFilesKey]?.id) return;

    try {
        await store.deleteSGCFile(existingFiles.value[existingFilesKey].id);

        // Update UI state
        uploadStatus.value[statusKey] = false;
        existingFiles.value[existingFilesKey] = null;
        
        // Reset validation status since derived 'both' files need to be regenerated
        validationPassed.value = false;

        toast.add({
            severity: 'success',
            summary: 'File Deleted',
            detail: `${genderLabel} Co-occurrence file has been deleted successfully`,
            life: 3000
        });

    } catch (error) {
        console.error('Delete error:', error);
        toast.add({
            severity: 'error',
            summary: 'Delete Error',
            detail: `Failed to delete ${genderLabel} Co-occurrence file`,
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
        } else if (!uploadStatus.value.cooccurrenceMale) {
            activeAccordionIndex.value = 3; // Male Co-occurrence tab
        } else if (!uploadStatus.value.cooccurrenceFemale) {
            activeAccordionIndex.value = 4; // Female Co-occurrence tab
        } else if (!uploadStatus.value.cohortDescription) {
            activeAccordionIndex.value = 5; // Cohort Description tab
        }
        // If all tasks completed, leave all accordions closed
        else if (allTasksCompleted.value) {
            activeAccordionIndex.value = null;
        }
    }, 500);
}

// Function to validate all file consistency
async function validateAllConsistency() {
    validatingConsistency.value = true;
    
    // Clear any previous error state to prevent interceptor interference
    store.errorMessage = '';
    store.showNotification = false;
    
    try {
        const result = await store.validateAllConsistency(cohortId);
        
        // Check if validation passed based on the API response
        if (result && result.validation_status) {
            // Update validation status to hide UI elements
            validationPassed.value = true;
            
            // Show success message using toast for positive feedback
            toast.add({
                severity: 'success',
                summary: 'Validation Complete',
                detail: 'All inter-file validations passed successfully! Your cohort is now finalized.',
                life: 5000
            });
            
            // Optionally redirect to the cohort list after showing success
            setTimeout(() => {
                navigateTo('/sgc');
            }, 3000);
        } else {
            // Handle case where API returns 200 but validation_status is false
            toast.add({
                severity: 'error',
                summary: 'Validation Failed',
                detail: result?.message || 'Inter-file validation failed. Please check your files and try again.',
                life: 8000
            });
        }
        
    } catch (error) {
        console.error('Validation error:', error);
        store.processing = false;
        
        // Handle server validation errors (400 responses) - exact same pattern as cohort description upload
        let errorMessage = 'Inter-file validation failed. Please check your files and try again.';
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
            summary: 'Validation Error',
            detail: errorMessage,
            life: 8000 // Longer display time for validation errors
        });
        
    } finally {
        validatingConsistency.value = false;
    }
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
