import { defineStore } from "pinia";

const config = useRuntimeConfig();

const configuredAxios = useAxios(config, undefined, (error) => {
    const store = useDatasetStore();
    store.processing = false;
    store.errorMessage =
        error.response?.data.detail || error.message || error.errorMessage;
    store.serverSuccess = false;
    store.showNotification = true;
    return Promise.reject(error);
});

function onUpload(progressEvent) {
    const store = useDatasetStore();
    store.uploadProgress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
    );
}

function getPhenotypeDataSetUploadUrl(dataset_id, pType) {
    const url = `/api/uploadfile/${dataset_id}/${pType.dichotomous}/${pType.sampleSize}?phenotype=${pType.name}`;
    if (!pType.dichotomous) {
        return url;
    }
    return url + `?controls=${pType.controls}&cases=${pType.cases}`;
}

function readFilePart(file, partSize) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(0, partSize));
    });
}

async function savePhenotype(dataset_id, pType) {
    const formData = new FormData();
    formData.append("file", pType.file);
    const { data } = await configuredAxios.post(
        getPhenotypeDataSetUploadUrl(dataset_id, pType),
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Filename: pType.fileName,
            },
            onUploadProgress: onUpload,
        },
    );
    return data.phenotype_data_set_id;
}

async function saveCredibleSet(saved_phenotype_id, cs) {
    const formData = new FormData();
    formData.append("file", cs.credibleSetFile);
    const { data } = await configuredAxios.post(
        `/api/crediblesetupload/${saved_phenotype_id}/${cs.name}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Filename: cs.fileName,
            },
            onUploadProgress: onUpload,
        },
    );
    return data.credible_set_id;
}

function mapCredibleSets() {
    const result = [];
    const credibleSets = {};
    const store = useDatasetStore();
    store.savedCredibleSets.forEach((cs) => {
        if (!credibleSets[cs.phenotype_data_set_id]) {
            credibleSets[cs.phenotype_data_set_id] = [];
        }
        credibleSets[cs.phenotype_data_set_id].push({
            name: cs.name,
            id: cs.id,
            fileName: cs.file_name,
        });
    });
    store.savedPhenotypes.forEach((p) => {
        result.push({
            name: store.phenotypes[p.phenotype]
                ? store.phenotypes[p.phenotype].name
                : p.phenotype,
            dichotomous: p.dichotomous,
            sampleSize: p.sample_size,
            cases: p.cases,
            controls: p.controls,
            credibleSets: credibleSets[p.id] || [{}],
            id: p.id,
            fileName: p.file_name,
            description: store.phenotypes[p.phenotype]
                ? store.phenotypes[p.phenotype].description
                : p.phenotype,
        });
    });
    if (result.length === 0) {
        result.push({ credibleSets: [{}] });
    }
    return result;
}

export const useDatasetStore = defineStore("DatasetStore", {
    state: () => {
        return {
            phenotypes: {},
            studies: [],
            savedCredibleSets: [],
            savedPhenotypes: [],
            combinedPhenotypesAndCredibleSets: [],
            showNotification: false,
            errorMessage: "",
            successMessage: "",
            isServerSuccess: false,
            processing: false,
            modalMsg: "",
            savedDataSetId: null,
            uploadProgress: 0,
            showProgressBar: false,
        };
    },
    getters: {
        savedDataSets: (state) => {
            return state.combinedPhenotypesAndCredibleSets;
        },
        hasNoSavedData: (state) => {
            return (
                state.combinedPhenotypesAndCredibleSets[0] &&
                Object.keys(state.combinedPhenotypesAndCredibleSets[0])
                    .length === 1
            );
        },
        dataSetId: (state) => {
            return state.savedDataSetId;
        },
        credibleSetsToAdd: (state) => {
            let result = false;
            state.combinedPhenotypesAndCredibleSets.forEach((p) => {
                if (p.credibleSets.filter((cs) => !cs.id).length > 0) {
                    result = true;
                }
            });
            return result;
        },
    },
    actions: {
        async fetchMetaAnalyses() {
          const {data}  = await configuredAxios.get('/api/hermes-meta-analysis');
          return data;
        },
        async fetchMetaAnalysis(id) {
            const {data}  = await configuredAxios.get(`/api/hermes-meta-analysis/${id}`);
            return data;
        },
        async startMetaAnalysis(req) {
            const {data} = await configuredAxios.post('/api/hermes-meta-analysis',
              JSON.stringify(req));
            return data;
        },
        async fetchPhenotypes() {
            if (Object.keys(this.phenotypes).length > 0) {
                return;
            }
            const { data, error } = await useFetch(config.public.phenotypesUrl);
            if (error.value) {
                this.showNotification = true;
                this.errorMessage = error.value.errorMessage;
            } else {
                const mappedPhenotypes = {};
                data.value.data.forEach((d) => (mappedPhenotypes[d.name] = d));
                this.phenotypes = mappedPhenotypes;
            }
        },

        async fetchHermesPhenotypes(params = null) {
            await this.fetchPhenotypes(); //get phenotype mapping
            const { data } = await configuredAxios.get(
                params
                    ? `/api/hermes-uploaded-phenotypes?${params}`
                    : "/api/hermes-uploaded-phenotypes",
            );
            let mappedPhenotypes = [];
            data.forEach((hp) => {
                if (this.phenotypes[hp]) {
                    mappedPhenotypes.push(this.phenotypes[hp]);
                }
            });
            console.log("mapped ", mappedPhenotypes);
            return mappedPhenotypes;
        },
        async fetchFileUpload(fileId) {
            const { data } = await configuredAxios.get(
                `/api/upload-hermes/${fileId}`,
            );
            return data;
        },
        async fetchFileUploads(params = null) {
            const { data } = await configuredAxios.get(
                params ? `/api/upload-hermes?${params}` : "/api/upload-hermes",
            );

            return data;
        },
        async fetchStudies() {
            const { data } = await configuredAxios.get("/api/studies");
            this.studies = data.map((s) => {
                return {
                    label: s.name,
                    value: s.id,
                    institution: s.institution,
                };
            });
        },
        async saveStudy(study) {
            const { data } = await configuredAxios.post(
                "/api/studies",
                JSON.stringify(study),
            );
            return data;
        },
        async deleteDataSet(dsId) {
            await configuredAxios.delete(`/api/datasets/${dsId}`);
        },
        async fetchColumnOptions() {
            const { data } = await configuredAxios.get(
                "/api/hermes-upload-columns",
            );
            return data;
        },
        async validateMetadata(metadata) {
            const { data } = await configuredAxios.post(
                "/api/validate-hermes",
                JSON.stringify(metadata),
            );
            return data;
        },
        async fetchExistingDataset(dsId) {
            const { data } = await configuredAxios.get(`/api/datasets/${dsId}`);
            this.savedPhenotypes = data.phenotypes;
            this.savedCredibleSets = data.credible_sets;
            this.savedDataSetId = data.dataset.id;
            this.combinedPhenotypesAndCredibleSets = mapCredibleSets();
            return data;
        },
        async sampleTextFile(file) {
            this.showProgressBar = false;
            this.processing = true;
            this.modalMsg = "Sampling File";
            const part = await readFilePart(file, 2048);
            const formData = new FormData();
            formData.append("file", new Blob([part]), file.name);

            const { data } = await configuredAxios.post(
                "/api/preview-delimited-file",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            this.processing = false;
            return data;
        },
        async trackBioindex(request) {
            const { data } = await configuredAxios.post(
                "/api/trackbioindex",
                JSON.stringify(request),
            );
            return data;
        },
        async enqueueCsvProcess(id, s3_path, schema, alreadySorted, mapping) {
            const request = {
                name: id,
                column: schema,
                already_sorted: alreadySorted,
                status: "SUBMITTED FOR PROCESSING",
                s3_path,
                data_types: mapping,
            };
            await configuredAxios.post(
                "/api/enqueue-csv-process",
                JSON.stringify(request),
            );
        },
        async uploadToPresignedUrl(url, file){
            const strippedFile = new Blob([file], { type: '' });
            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    body: strippedFile
                });
            } catch (error) {
                this.processing = false;
                console.error("File upload failed:", error);
                throw error;
            }
        },
        async getHermesPresignedUrl(fileName, dataset, contentType){
            this.showProgressBar = true;
            this.processing = true;
            this.modalMsg = "Uploading File";
            const {data} = await configuredAxios.get('/api/get-hermes-pre-signed-url', {
                headers: {
                    Dataset: dataset,
                    FileName: fileName
                }
            });
            return data;
        },
        async validateHermesUpload(fileName, dataset, metadata, qc_script_options) {
            const { data } = await configuredAxios.post(
                "/api/validate-hermes",
              JSON.stringify({'file_name': fileName, dataset, metadata, qc_script_options})
            );
            return data;
        },
        async rerunQC(file_id, qc_script_options){
            const { data } = await configuredAxios.patch(
              `/api/hermes-rerun-qc/${file_id}`,
              JSON.stringify(qc_script_options)
            );
            return data;
        },
        async uploadFileForBioindex(file, fileName) {
            this.showProgressBar = true;
            this.processing = true;
            this.modalMsg = "Uploading File";
            this.uploadProgress = 0;
            const formData = new FormData();
            formData.append("file", file);
            const { data } = await configuredAxios.post(
                "/api/upload-csv",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        FileName: fileName,
                    },
                    onUploadProgress: onUpload,
                },
            );
            this.processing = false;
            return data;
        },
        async fetchPubInfo(pubId) {
            const { data } = await configuredAxios.get(
                `/api/publications?pub_id=${pubId.trim()}`,
            );
            return data;
        },
        async saveDataset(dataset) {
            this.processing = true;
            this.modalMsg = "Saving dataset metadata";
            this.showProgressBar = false;
            if (dataset.id) {
                await configuredAxios.patch(
                    "/api/datasets",
                    JSON.stringify(dataset),
                );
            } else {
                const { data } = await configuredAxios.post(
                    "/api/datasets",
                    JSON.stringify(dataset),
                );
                this.savedDataSetId = data.id;
            }
            if (this.combinedPhenotypesAndCredibleSets.length === 0) {
                this.addPhenoBlankDataset();
            }
            this.processing = false;
            this.showNotification = true;
            this.isServerSuccess = true;
            this.successMessage = "Metadata saved, you can now upload files.";
        },
        async uploadFiles(dataset_id) {
            this.processing = true;
            this.showProgressBar = true;
            for (const phenotype of this.savedDataSets) {
                if (!phenotype.id) {
                    this.modalMsg = `Uploading data for ${phenotype.description}`;
                    this.uploadProgress = 0;
                    phenotype.id = await savePhenotype(
                        dataset_id.replaceAll("-", ""),
                        phenotype,
                    );
                }
                for (const cs of phenotype.credibleSets) {
                    if (!cs.id && cs.credibleSetFile) {
                        this.modalMsg = `Uploading credible set ${cs.name}`;
                        this.uploadProgress = 0;
                        cs.id = await saveCredibleSet(
                            phenotype.id.replaceAll("-", ""),
                            cs,
                        );
                    }
                }
                if (
                    Object.keys(phenotype.credibleSets[0]).length === 0 &&
                    phenotype.credibleSets.length === 1
                ) {
                    phenotype.credibleSets = [];
                }
            }
            this.showNotification = true;
            this.isServerSuccess = true;
            this.processing = false;
            this.successMessage = "File uploaded successfully.";
        },
        async deletePhenotypeDataSet(save_phenotype_id) {
            await configuredAxios.delete(
                `/api/phenotypes/${save_phenotype_id}`,
            );
        },
        addStudy(study) {
            this.studies.push(study);
        },
        addPhenoBlankDataset() {
            this.combinedPhenotypesAndCredibleSets.push({ credibleSets: [{}] });
        },
        resetPhenoDatasets() {
            this.combinedPhenotypesAndCredibleSets = [{ credibleSets: [{}] }];
        },
        removePhenoDataset(index) {
            this.combinedPhenotypesAndCredibleSets.splice(index, 1);
        },
        reviewDataset(id, status) {
            return configuredAxios.patch(
                `/api/upload-hermes/${id}`,
                JSON.stringify({ status }),
            );
        },
    },
});
