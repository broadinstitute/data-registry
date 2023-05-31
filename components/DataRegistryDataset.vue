<template>
    <ServerNotification
        :show-notification="showNotification"
        :message="errorMessage"
        :success="serverSuccess"
    />
    <div class="card mdkp-card">
        <div class="card-body dr-form">
            <form class="needs-validation" id="inputForm" novalidate>
                <div class="row dr-status-section">
                    <div class="col-md-6 col">
                        <div class="label">Dataset name<sup>*</sup></div>
                        <input
                            ref="datasetName"
                            type="text"
                            class="form-control input-default"
                            placeholder="Dataset name e.g., Cade2021_SleepApnea_EU_Female"
                            v-model="dsName"
                            required
                        />
                    </div>

                    <div class="col-md-6 col">
                        <div class="label">Status<sup>*</sup></div>
                        <select
                            class="form-select"
                            v-model="pubStatus"
                            required
                        >
                            <option value="pre">Pre-publication</option>
                            <option value="open">Open access</option>
                        </select>
                    </div>
                </div>
                <div class="row dr-status-section">
                    <div class="col-md-12 col">
                        <div class="label">Study<sup>*</sup></div>
                        <AutoCompleteDialog
                            :items="studies"
                            :filter-function="filterStudies"
                            :item-display="(s) => s.label"
                            id="study"
                            placeholder="Study name e.g., TOPMed Sleep Apnea WGS"
                            @blur="leaveStudy"
                            :initial-input="savedStudy"
                        />
                    </div>
                </div>
                <div class="row dr-data-section">
                    <div class="col-md-12"><h4>Dataset Metadata</h4></div>

                    <div class="col-md-9">
                        <div class="row">
                            <div class="col-md-4 col">
                                <div class="label">
                                    Data source type<sup>*</sup>
                                </div>
                                <select
                                    class="form-select"
                                    v-model="dataType"
                                    required
                                >
                                    <option value="file">File</option>
                                    <option value="remote">
                                        Remote storage
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-4 col">
                                <div class="label">Data type<sup>*</sup></div>
                                <select
                                    class="form-select"
                                    v-model="geneticsDataType"
                                    required
                                >
                                    <option value="gwas">GWAS</option>
                                    <option value="exomchip">Exome chip</option>
                                    <option value="exomseq">
                                        Exome sequence analysis
                                    </option>
                                    <option value="ichip">IChip</option>
                                    <option value="wgs">
                                        Whole genome sequencing
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-4 col">
                                <div class="label">
                                    Genome build<sup>*</sup>
                                </div>
                                <select
                                    class="form-select"
                                    v-model="genomeBuild"
                                    required
                                >
                                    <option value="hg19">hg19 (GRCh37)</option>
                                    <option value="hg19">GRCh38</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col">
                                <div class="label">Ancestry<sup>*</sup></div>
                                <select
                                    class="form-select"
                                    v-model="ancestry"
                                    required
                                >
                                    <option value="ABA">
                                        Aboriginal Australian
                                    </option>
                                    <option value="AA">
                                        African American or Afro-Caribbean
                                    </option>
                                    <option value="AF">
                                        African unspecified
                                    </option>
                                    <option value="SSAF">
                                        Sub-Saharan African
                                    </option>
                                    <option value="ASUN">
                                        Asian unspecified
                                    </option>
                                    <option value="CA">Central Asian</option>
                                    <option value="EA">East Asian</option>
                                    <option value="SA">South Asian</option>
                                    <option value="SEA">
                                        South East Asian
                                    </option>
                                    <option value="EU">European</option>
                                    <option value="GME">
                                        Greater Middle Eastern (Middle Eastern,
                                        North African, or Persian)
                                    </option>
                                    <option value="HS">
                                        Hispanic or Latin American
                                    </option>
                                    <option value="NAM">Native American</option>
                                    <option value="NR">Not reported</option>
                                    <option value="OC">Oceanian</option>
                                    <option value="OTH">Other</option>
                                    <option value="OAD">
                                        Other admixed ancestry
                                    </option>
                                    <option value="Mixed">
                                        Mixed ancestry
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6 col">
                                <div class="label">Sex<sup>*</sup></div>
                                <select
                                    class="form-select"
                                    v-model="sex"
                                    required
                                >
                                    <option value="mixed">Mixed</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col">
                                <div class="label">
                                    Global sample size<sup>*</sup>
                                </div>
                                <input
                                    type="number"
                                    class="form-control input-default"
                                    placeholder="Sample size"
                                    min="0"
                                    v-model="globalSampleSize"
                                    required
                                />
                            </div>
                            <div class="col-md-6 col" style="font-size: 14px">
                                <br />
                                Learn how to calculate sample size
                                <a href="javascript:;">here</a>.
                            </div>
                        </div>
                        <div class="row dr-data-section">
                            <div class="col-md-12"><h4>Data</h4></div>
                          <ul>
                            <li v-for="(phenotypeDataset, index) in phenotypeDatasets">
                              <PhenotypeDataset :dataset-data-type="dataType" :key="index" :phenotypeDataset="phenotypeDataset" :identifier="index" @remove-phenotype-dataset="(e) => phenotypeDatasets.splice(e.id, 1)"/>
                            </li>
                          </ul>
                          <div style="display: inline; margin-top: -25px">
                            <a href="#" @click.prevent="phenotypeDatasets.push({'credibleSets': [{}]})">Add Additional Phenotype</a>
                          </div>
                        </div>
                    </div>
                    <div class="col-md-3 dr-meta-info">
                        <div class="col-md-12 col">
                            <div class="label">Data submitter<sup>*</sup></div>
                            <input
                                type="text"
                                class="form-control input-default"
                                placeholder="Data submitter"
                                v-model="dataSubmitter"
                                required
                            />
                        </div>
                        <div class="col-md-12 col">
                            <div class="label">
                                Data submitter email<sup>*</sup>
                            </div>
                            <input
                                type="text"
                                class="form-control input-default"
                                placeholder="submitter@email"
                                v-model="dataSubmitterEmail"
                                required
                            />
                        </div>
                        <div class="col-md-12 col">
                            <div class="label">Data contributor</div>
                            <input
                                type="text"
                                class="form-control input-default"
                                placeholder="Data contributor"
                                v-model="dataContributor"
                            />
                        </div>
                        <div class="col-md-12 col">
                            <div class="label">Data contributor email</div>
                            <input
                                type="text"
                                class="form-control input-default"
                                placeholder="contributor@email"
                                v-model="dataContributorEmail"
                            />
                        </div>
                        <div class="col-md-12 col">
                            <div class="label">Institution<sup>*</sup></div>
                            <input
                                type="text"
                                class="form-control input-default"
                                placeholder="Institution"
                                v-model="institution"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div class="row dr-description-section">
                    <div class="col-md-9">
                        <h4>Data description</h4>
                        <div class="row">
                            <div class="col-md-12 col filter-col-md">
                                <div class="label">
                                    PubMed ID, DOI, or PubMed Central ID
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text"
                                        >https://pubmed.ncbi.nlm.nih.gov/</span
                                    >
                                    <input
                                        type="text"
                                        class="form-control input-default"
                                        placeholder="(e.g. 28300000, 10.1038/ng.3830, or PMC5968830)"
                                        v-model="pubId"
                                    />
                                    <button
                                        type="button"
                                        :class="
                                            !pubId
                                                ? 'btn btn-outline-primary'
                                                : 'btn btn-primary'
                                        "
                                        title="Fetch data from PubMed"
                                        @click="getPubMedInfo"
                                        :disabled="!pubId"
                                    >
                                        <i class="bi-cloud-arrow-down"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col filter-col-md">
                                <div class="label">Publication</div>
                                <input
                                    type="text"
                                    class="form-control input-default"
                                    placeholder="Publication"
                                    v-model="publication"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col filter-col-md">
                                <div class="label">Description<sup>*</sup></div>
                                <textarea
                                    v-model="description"
                                    rows="4"
                                    class="form-control"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" @click="save">
                    {{ props.existingDataset ? "Update Dataset" : "Save Dataset"}}
                </button>
            </form>
        </div>
        <Modal :status-message="modalMsg" v-if="processing" />
    </div>
</template>

<script setup>
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from '~/components/Modal.vue'
import useAxios from '~/composables/useAxios'


const props = defineProps({ existingDataset: String });
const datasetName = ref(null);
const processing = ref(false);
const modalMsg = ref("Do not close this window, saving data...");
const showNotification = ref(false);
const errorMessage = ref(null);
const serverSuccess = ref(true);
const dataType = ref("file");
const geneticsDataType = ref("");
const dsName = ref("");
const institution = ref("");
const genomeBuild = ref("");
const ancestry = ref("");
const dataSubmitter = ref("");
const dataSubmitterEmail = ref("");
const dataContributorEmail = ref(null);
const dataContributor = ref(null);
const sex = ref("");
const globalSampleSize = ref("");
const pubStatus = ref("");
const description = ref("");
const savedStudy = ref("");
const pubId = ref(null);
const publication = ref(null);

const config = useRuntimeConfig();
const study = useState("study");
const phenotypeDatasets = useState("selectedPhenotypes", () => [{'credibleSets': [{}]}]);
const studies = useState("studies", () => []);
const phenotypes = useState("phenotypes", () => []);

const configuredAxios = useAxios(config,undefined, (error) => {
  console.log(JSON.stringify(error));
  processing.value = false;
  errorMessage.value = error.response.data.message;
  serverSuccess.value = false;
  showNotification.value = true;
  throw new Error("Server error");
});

async function fetchExistingDataset(existingDataset) {
    const { data } = await configuredAxios.get(
        `/api/datasets/${existingDataset}`,
    );
    const ds = data.dataset;
    dsName.value = ds.name;
    genomeBuild.value = ds.genome_build;
    dataSubmitter.value = ds.data_submitter;
    dataSubmitterEmail.value = ds.data_submitter_email;
    ancestry.value = ds.ancestry;
    sex.value = ds.sex;
    pubStatus.value = ds.status;
    geneticsDataType.value = ds.data_type;
    globalSampleSize.value = ds.global_sample_size;
    description.value = ds.description;
    dataType.value = ds.data_source_type;
    institution.value = data.study.institution;
    study.value = { value: data.study.id, label: data.study.name, institution: data.study.institution };
    savedStudy.value = data.study.name;

    phenotypeDatasets.value = [];
    const credibleSets = {}
    data.credible_sets.map(cs => {
      if (!credibleSets[cs.phenotype_data_set_id])
        credibleSets[cs.phenotype_data_set_id] = [];
      credibleSets[cs.phenotype_data_set_id].push({ "name": cs.name, "id": cs.id })
    });
    data.phenotypes.map((p) => {
        phenotypeDatasets.value.push({'name': phenotypes.value[p.phenotype] ? phenotypes.value[p.phenotype].name : p.phenotype,
            'dichotomous': p.dichotomous, 'sampleSize': p.sample_size, 'cases': p.cases,
            'controls': p.controls, 'credibleSets': credibleSets[p.id] || [{}],
          'description': phenotypes.value[p.phenotype] ? phenotypes.value[p.phenotype].description : p.phenotype});
    });
}

async function getPhenotypes() {
    const { data } = await $fetch(config.public['phenotypesUrl']);
    const mappedPhenotypes = {};
    data.forEach((d) => (mappedPhenotypes[d.name] = d));
    phenotypes.value = mappedPhenotypes;
}

async function fetchStudies() {
    const data = await $fetch(`${config.public['apiBaseUrl']}/api/studies`, {
        headers: { "access-token": config.public['apiSecret'] },
    });
    studies.value = data.map((s) => {
        return { label: s.name, value: s.id, institution: s.institution };
    });
}

async function fetchInProperOrder() {
    await fetchStudies()
    await getPhenotypes()
    if (props.existingDataset) {
        await fetchExistingDataset(props.existingDataset)
    }
}

onMounted(() => {
    datasetName.value.focus();
    fetchInProperOrder()
});

// institution is saved with study, so if user selects an existing study use that
//saved institution
watch(study, (newVal, _) => {
    if (institution.value === "" && newVal && newVal.institution) {
        institution.value = newVal.institution;
    }
});

//we need to handle both the case where the user types in a new study and where
//they select and existing study
function leaveStudy(event) {
    const matches = studies.value.filter((s) => s.label === event.value);
    if (matches.length === 0) {
        study.value = event.value;
    } else {
        study.value = matches[0];
    }
}

function filterStudies(q) {
    return studies.value.filter((s) => {
        if (q.length < 2) return false;
        return s.label.toLowerCase().includes(q.toLowerCase());
    });
}

async function saveStudy() {
    return await configuredAxios.post(
        "/api/studies",
        JSON.stringify({ name: study.value, institution: institution.value }),
    );
}

function credible_set_validation() {
  //if a credible set name or file is provided, make sure to require the counterpart field
  const credible_set_elements = document.getElementsByClassName('credible-set')
  for (const element of credible_set_elements) {
    element.required = false
  }
  for (const element of credible_set_elements) {
    if (element.value !== '') {
      const credible_set_inputs_for_pheno = document.querySelectorAll(
          '[data-associated-phenotype="' + element.dataset.associatedPhenotype + '"]')
      credible_set_inputs_for_pheno.forEach(input => input.required = true)
    }
  }
}

async function save() {
    const form = document.getElementById("inputForm");
    credible_set_validation()
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    processing.value = true;
    let dataset_id;
    if (typeof study.value === "object") {
        dataset_id = await saveDataset(study.value.value);
    } else {
        const { data } = await saveStudy();
        //handle the case where we add a new study and dataset and then add another dataset
        //to that study without a full page refresh
        const newStudy = {
            label: data.name,
            value: data.study_id,
            institution: institution.value,
        };
        studies.value.push(newStudy);
        study.value = newStudy;
        dataset_id = await saveDataset(data.study_id);
    }
    for (const phenotype of phenotypeDatasets.value) {
        modalMsg.value = `Do not close this window, uploading data for ${phenotype.description}`;
        const saved_phenotype_id = await savePhenotype(dataset_id, phenotype);
        for(const cs of phenotype.credibleSets){
            if(cs.name && cs.name !== ''){
              await saveCredibleSet(saved_phenotype_id, cs);
            }
        }
    }
    processing.value = false;
    serverSuccess.value = true;
    showNotification.value = true;
}

function getPhenotypeDataSetUploadUrl(dataset_id, pType) {
    let url = `/api/uploadfile/${dataset_id}/${pType.name}/${pType.dichotomous}/${pType.sampleSize}`;
    if (!pType.dichotomous) {
        return url;
    }
    return url + `?controls=${pType.controls}&cases=${pType.cases}`;
}

async function saveCredibleSet(saved_phenotype_id, cs) {
  const formData = new FormData();
  formData.append("file", cs.credibleSetFile);
  await configuredAxios.post(`/api/crediblesetupload/${saved_phenotype_id}/${cs.name}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function savePhenotype(dataset_id, pType) {
    const formData = new FormData();
    formData.append("file", pType.file);
    const {data} = await configuredAxios.post(getPhenotypeDataSetUploadUrl(dataset_id, pType), formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.phenotype_data_set_id;
}

async function saveDataset(study_id) {
    const shortened_study_id = study_id.replaceAll("-", "");
    const opts = {
        name: dsName.value,
        data_source_type: dataType.value,
        data_type: geneticsDataType.value,
        genome_build: genomeBuild.value,
        ancestry: ancestry.value,
        data_submitter: dataSubmitter.value,
        data_submitter_email: dataSubmitterEmail.value,
        data_contributor_email: dataContributorEmail.value,
        data_contributor: dataContributor.value,
        sex: sex.value,
        global_sample_size: globalSampleSize.value,
        study_id: shortened_study_id,
        status: pubStatus.value,
        description: description.value,
        pub_id: pubId.value,
        publication: publication.value,
    };
    if (props.existingDataset) {
        opts.id = props.existingDataset;
        await configuredAxios.patch("/api/datasets", JSON.stringify(opts));
        return props.existingDataset.replaceAll('-', '');
    }
    const { data } = await configuredAxios.post("/api/datasets", JSON.stringify(opts));
    return data.dataset_id;
}

//retrieve the study information from the PUBMED
async function getPubMedInfo() {
    const { data } = await configuredAxios.get(
        `/api/publications?pub_id=${pubId.value.trim()}`,
    );
    if (data) {
        description.value = data.abstract;
        publication.value = data.title;
    }
}
</script>
