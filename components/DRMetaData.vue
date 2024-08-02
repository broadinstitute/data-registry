<script setup>
import * as Bootstrap from 'bootstrap';
import { useDatasetStore } from '~/stores/DatasetStore';

const props = defineProps({
  readOnly: {
    type: Boolean,
    required: false,
    default: false
  },
  datasetId: {
    type: String,
    required: false,
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false
  }
});
const store = useDatasetStore();
const isReadOnly = computed(() => !props.editMode && !!props.datasetId);
const study = ref(null);
const datasetName = ref(null);
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
const publiclyAvailable = ref(null);
const globalSampleSize = ref("");
const pubStatus = ref("");
const description = ref("");
const savedStudy = ref("");
const pubId = ref(null);
const publication = ref(null);

onMounted(async () => {
  await store.fetchStudies();
  await store.fetchPhenotypes();
  if (props.datasetId) {
    await loadDataset(props.datasetId);
  }
  datasetName.value.focus();
});

function getDescriptionFromPubData (data) {
  return `${data.title}\n${data.authors}\n${data.publication}. ${data.month_year_published};${data.volume_issue}:${data.pages}. ${data.elocation_id ? data.elocation_id + '.' : ''}`;
}

async function getPubMedInfo () {
  const data = await store.fetchPubInfo(pubId.value);
  if (data) {
    description.value = description.value ? `${description.value}\n${getDescriptionFromPubData(data)}` : getDescriptionFromPubData(data);
    publication.value = publication.value ? `${publication.value}\n${data.publication}` : data.publication;
  }
}

async function loadDataset (existingDataset) {
  let data;
  try {
    data = await store.fetchExistingDataset(existingDataset);
  } catch(error) {
    console.error("Error loading dataset:", error);
    return;
  }

  const ds = data.dataset;
  dsName.value = ds.name;
  genomeBuild.value = ds.genome_build;
  dataSubmitter.value = ds.data_submitter;
  dataSubmitterEmail.value = ds.data_submitter_email;
  dataContributor.value = ds.data_contributor;
  dataContributorEmail.value = ds.data_contributor_email;
  ancestry.value = ds.ancestry;
  sex.value = ds.sex;
  publiclyAvailable.value = ds.publicly_available;
  pubStatus.value = ds.status;
  geneticsDataType.value = ds.data_type;
  globalSampleSize.value = ds.global_sample_size;
  pubId.value = ds.pub_id;
  publication.value = ds.publication;
  description.value = ds.description;
  dataType.value = ds.data_source_type;
  institution.value = data.study.institution;
  study.value = {
    value: data.study.id,
    label: data.study.name,
    institution: data.study.institution,
  };
  savedStudy.value = data.study.name;
}

async function save () {
  if (!useFormValidation("mdForm")) {
    return;
  }
  if (typeof study.value === "object") {
    await saveDataset(study.value.value);
  } else {
    const data = await store.saveStudy({ name: study.value, institution: institution.value });
    // handle the case where we add a new study and dataset and then add another dataset
    // to that study without a full page refresh
    const newStudy = {
      label: data.name,
      value: data.id,
      institution: institution.value,
    };
    store.addStudy(newStudy);
    study.value = newStudy;
    await saveDataset(data.id);
  }
}

async function saveDataset (study_id) {
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
    publicly_available: publiclyAvailable.value,
    description: description.value,
    pub_id: pubId.value,
    publication: publication.value,
  };
  if (store.dataSetId) {
    opts.id = store.dataSetId;
  }
  try {
    await store.saveDataset(opts);
  } catch(error) {
    console.error("Error saving dataset:", error);
    return;
  }

  const accordionData = document.getElementById('drfiles');
  const bsCollapse = new Bootstrap.Collapse(accordionData, {
    toggle: false
  });
  bsCollapse.show();
  if (store.hasNoSavedData) {
    await nextTick(() => {
      document.getElementById('pheno-0').focus();
    });
  }
}

watch(() => props.editMode, (isEditable) => {
  if (isEditable) {
    nextTick(() => {
      datasetName.value.focus();
    });
  }
});

function leaveStudy (event) {
  const matches = store.studies.filter(s => s.label === event.value);
  if (matches.length === 0) {
    study.value = event.value;
  } else {
    study.value = matches[0];
  }
}

function filterStudies (q) {
  return store.studies.filter((s) => {
    if (q.length < 2) { return false; }
    return s.label.toLowerCase().includes(q.toLowerCase());
  });
}

</script>

<template>
  <form id="mdForm" class="needs-validation dr-form" novalidate>
    <div class="row dr-status-section">
      <div class="col col-span-6">
        <div class="label">
          Dataset name<sup>*</sup>
        </div>
        <input
          ref="datasetName"
          v-model="dsName"
          type="text"
          class="form-control input-default"
          placeholder="Dataset name e.g., Cade2021_SleepApnea_EU_Female"
          required
          :disabled="isReadOnly"
        >
      </div>

      <div class="col col-span-6">
        <div class="label">
          Status<sup>*</sup>
        </div>
        <select v-model="pubStatus" class="form-select" required :disabled="isReadOnly">
          <option value="pre">
            Pre-publication
          </option>
          <option value="open">
            Open access
          </option>
        </select>
      </div>
    </div>
    <div class="row dr-status-section">
      <div class="col-md-12 col">
        <div class="label">
          Study<sup>*</sup>
        </div>
        <AutoCompleteDialog
          id="study"
          :items="store.studies"
          :filter-function="filterStudies"
          :item-display="(s) => s.label"
          placeholder="Study name e.g., TOPMed Sleep Apnea WGS"
          :initial-input="savedStudy"
          :disabled="isReadOnly"
          @blur="leaveStudy"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-6 col">
            <div class="label">
              Data type<sup>*</sup>
            </div>
            <select v-model="geneticsDataType" class="form-select" required :disabled="isReadOnly">
              <option value="gwas">
                GWAS
              </option>
              <option value="exomchip">
                Exome chip
              </option>
              <option value="exseq">
                Exome sequence analysis
              </option>
              <option value="ichip">
                IChip
              </option>
              <option value="wgs">
                Whole genome sequencing
              </option>
              <option value="other">
                Other
              </option>
            </select>
          </div>
          <div class="col-md-6 col">
            <div class="label">
              Genome build<sup>*</sup>
            </div>
            <select v-model="genomeBuild" class="form-select" required :disabled="isReadOnly">
              <option value="hg19">
                hg19 (GRCh37)
              </option>
              <option value="hg19">
                GRCh38
              </option>
              <option value="n/a">
                N/A
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 col">
            <div class="label">
              Ancestry<sup>*</sup>
            </div>
            <select v-model="ancestry" class="form-select" required :disabled="isReadOnly">
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
              <option value="CA">
                Central Asian
              </option>
              <option value="EA">
                East Asian
              </option>
              <option value="SA">
                South Asian
              </option>
              <option value="SEA">
                South East Asian
              </option>
              <option value="EU">
                European
              </option>
              <option value="GME">
                Greater Middle Eastern (Middle Eastern,
                North African, or Persian)
              </option>
              <option value="HS">
                Hispanic or Latin American
              </option>
              <option value="NAM">
                Native American
              </option>
              <option value="NR">
                Not reported
              </option>
              <option value="OC">
                Oceanian
              </option>
              <option value="OTH">
                Other
              </option>
              <option value="OAD">
                Other admixed ancestry
              </option>
              <option value="Mixed">
                Mixed ancestry
              </option>
              <option value="n/a">
                N/A
              </option>
            </select>
          </div>
          <div class="col-md-4 col">
            <div class="label">
              Sex<sup>*</sup>
            </div>
            <select
              v-model="sex"
              class="form-select"
              required
              :disabled="isReadOnly"
            >
              <option value="mixed">
                Mixed
              </option>
              <option value="male">
                Male
              </option>
              <option value="female">
                Female
              </option>
              <option value="n/a">
                N/A
              </option>
            </select>
          </div>
          <div class="col-md-4 col">
            <div class="label">
              Data Sharing<sup>*</sup>
            </div>
            <label class="form-check-label">
              <input
                v-model="publiclyAvailable"
                type="radio"
                value="true"
                class="form-check-input"
                :disabled="isReadOnly"
                required
                name="public"
              >
              Share uploaded files via a public URL
            </label>
            <label class="form-check-label">
              <input
                v-model="publiclyAvailable"
                type="radio"
                value="false"
                class="form-check-input"
                :disabled="isReadOnly"
                required
                name="public"
              >
              Keep uploaded files private
            </label>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col">
            <div class="label">
              Global sample size<sup>*</sup>
            </div>
            <input
              v-model="globalSampleSize"
              type="number"
              class="form-control input-default"
              placeholder="Sample size"
              min="0"
              required
              :disabled="isReadOnly"
            >
          </div>
          <div class="col-md-6 col" style="font-size: 14px">
            <br>
            Learn how to calculate sample size
            <a href="javascript:;">here</a>.
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col filter-col-md">
            <div class="label">
              PubMed ID, DOI, or PubMed Central ID
            </div>
            <div class="input-group">
              <span class="input-group-text">https://pubmed.ncbi.nlm.nih.gov/</span>
              <input
                v-model="pubId"
                type="text"
                class="form-control input-default"
                placeholder="(e.g. 28300000, 10.1038/ng.3830, or PMC5968830)"
                :disabled="isReadOnly"
              >
              <button
                type="button"
                :class="!pubId ? 'btn btn-outline-primary' : 'btn btn-primary'"
                title="Fetch data from PubMed"
                :disabled="!pubId || isReadOnly"
                @click="getPubMedInfo"
              >
                <i class="bi-cloud-arrow-down" />
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col filter-col-md">
            <div class="label">
              Publication
            </div>
            <input
              v-model="publication"
              type="text"
              class="form-control input-default"
              placeholder="Publication"
              :disabled="isReadOnly"
            >
          </div>
        </div>
        <div class="row">
          <div class="col filter-col-md">
            <div class="label">
              Description<sup>*</sup>
            </div>
            <textarea v-model="description" rows="4" class="form-control" required :disabled="isReadOnly" />
          </div>
        </div>
      </div>
      <div class="col-md-3 dr-meta-info">
        <div class="col-md-12 col">
          <div class="label">
            Data submitter<sup>*</sup>
          </div>
          <input
            v-model="dataSubmitter"
            type="text"
            class="form-control input-default"
            placeholder="Data submitter"
            required
            :disabled="isReadOnly"
          >
        </div>
        <div class="col-md-12 col">
          <div class="label">
            Data submitter email<sup>*</sup>
          </div>
          <input
            v-model="dataSubmitterEmail"
            type="text"
            class="form-control input-default"
            placeholder="submitter@email"
            required
            :disabled="isReadOnly"
          >
        </div>
        <div class="col-md-12 col">
          <div class="label">
            Principal investigator
          </div>
          <input
            v-model="dataContributor"
            type="text"
            class="form-control input-default"
            placeholder="Data contributor"
            :disabled="isReadOnly"
          >
        </div>
        <div class="col-md-12 col">
          <div class="label">
            Principal investigator email
          </div>
          <input
            v-model="dataContributorEmail"
            type="text"
            class="form-control input-default"
            placeholder="contributor@email"
            :disabled="isReadOnly"
          >
        </div>
        <div class="col-md-12 col">
          <div class="label">
            Institution<sup>*</sup>
          </div>
          <input
            v-model="institution"
            type="text"
            class="form-control input-default"
            placeholder="Institution"
            required
            :disabled="isReadOnly"
          >
        </div>
      </div>
    </div>
    <button v-if="!isReadOnly" type="button" class="btn btn-primary" @click="save">
      {{ props.datasetId ? "Update" : "Save" }} metadata
    </button>
  </form>
</template>

<style scoped>

</style>
