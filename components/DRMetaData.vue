<script setup>
  import Modal from '~/components/Modal.vue'

  const props = defineProps({
    readOnly : {
      type: Boolean,
      required: false,
      default: false
    },
    datasetId: {
      type: String,
      required: false,
    }
  })

  const isReadOnly = ref(false)
  const studies = useState("studies", () => [])
  const study = useState("study")
  const dsId = useState("dsId")
  const config = useRuntimeConfig()
  const { modalMsg, processing, errorMessage, serverSuccess, showNotification } = useModal()
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
  const globalSampleSize = ref("");
  const pubStatus = ref("");
  const description = ref("");
  const savedStudy = ref("");
  const pubId = ref(null);
  const publication = ref(null);


  onMounted(async () => {
    await fetchStudies()
    if (props.datasetId) {
      console.log("datasetId: " + props.datasetId)
      await fetchExistingDataset(props.datasetId)
    }
  })


  const configuredAxios = useAxios(config, undefined, (error) => {
    console.log(JSON.stringify(error))
    processing.value = false
    errorMessage.value = error.message
    serverSuccess.value = false
    showNotification.value = true
    throw new Error("Server error")
  });

  async function getPubMedInfo() {
    const { data } = await configuredAxios.get(`/api/publications?pub_id=${pubId.value.trim()}`)
    if (data) {
      description.value = data.abstract;
      publication.value = data.title;
    }
  }

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
    study.value = {
      value: data.study.id,
      label: data.study.name,
      institution: data.study.institution,
    };
    savedStudy.value = data.study.name;

  }

  async function save(){
    if(!useFormValidation("mdForm")){
      return
    }
    if (typeof study.value === "object") {
      dsId.value = await saveDataset(study.value.value)
    } else {
      const { data } = await saveStudy()
      //handle the case where we add a new study and dataset and then add another dataset
      //to that study without a full page refresh
      const newStudy = {
        label: data.name,
        value: data.study_id,
        institution: institution.value,
      };
      studies.value.push(newStudy)
      study.value = newStudy
      dsId.value = await saveDataset(data.study_id)
    }
    processing.value = false;
    serverSuccess.value = true;
    showNotification.value = true;
  }

  async function saveStudy() {
    return await configuredAxios.post("/api/studies",
        JSON.stringify({ name: study.value, institution: institution.value }))
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
    }
    if (dsId.value) {
      opts.id = dsId.value;
      await configuredAxios.patch("/api/datasets", JSON.stringify(opts));
      return dsId.value.replaceAll("-", "");
    }

    const { data } = await configuredAxios.post("/api/datasets", JSON.stringify(opts))
    console.log(data)
    return data.dataset_id;
  }


  function leaveStudy(event) {
    const matches = studies.value.filter((s) => s.label === event.value)
    if (matches.length === 0) {
      study.value = event.value
    } else {
      study.value = matches[0]
    }
  }

  function filterStudies(q) {
    return studies.value.filter((s) => {
      if (q.length < 2) return false
      return s.label.toLowerCase().includes(q.toLowerCase())
    });
  }

  async function fetchStudies() {
    const data = await $fetch(`${config.public["apiBaseUrl"]}/api/studies`, {
      headers: { "access-token": config.public["apiSecret"] },
    })
    studies.value = data.map((s) => {
      return { label: s.name, value: s.id, institution: s.institution }
    })
  }
</script>

<template>
  <ServerNotification
      :show-notification="showNotification"
      :message="errorMessage"
      :success="serverSuccess"
  />
  <form class="needs-validation dr-form" id="mdForm" novalidate>
    <div class="col-md-12"><h4>Dataset Metadata</h4></div>
    <div class="row dr-status-section">
<!--      <div class="col-md-2 col" v-if="props.existingDataset && !props.editMode">-->
<!--        <div class="form-check form-switch">-->
<!--          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"-->
<!--              @click="toggleEdit" :checked="!isReadOnly"/>-->
<!--          <label class="form-check-label label" for="flexSwitchCheckDefault">Allow Edits</label>-->
<!--        </div>-->
<!--      </div>-->
      <div class="col col-6">
        <div class="label">Dataset name<sup>*</sup></div>
        <input ref="datasetName" type="text" class="form-control input-default"
            placeholder="Dataset name e.g., Cade2021_SleepApnea_EU_Female"
            v-model="dsName" required :disabled="isReadOnly"/>
      </div>

      <div class="col col-6">
        <div class="label">Status<sup>*</sup></div>
        <select class="form-select" v-model="pubStatus" required :disabled="isReadOnly">
          <option value="pre">Pre-publication</option>
          <option value="open">Open access</option>
        </select>
      </div>
    </div>
    <div class="row dr-status-section">
      <div class="col-md-12 col">
        <div class="label">Study<sup>*</sup></div>
        <AutoCompleteDialog :items="studies" :filter-function="filterStudies" :item-display="(s) => s.label"
            id="study" placeholder="Study name e.g., TOPMed Sleep Apnea WGS" @blur="leaveStudy"
            :initial-input="savedStudy" :disabled="isReadOnly"/>
      </div>
    </div>
    <div class="row">

      <div class="col-md-9">
        <div class="row">
          <div class="col-md-4 col">
            <div class="label">
              Data source type<sup>*</sup>
            </div>
            <select class="form-select" v-model="dataType" required :disabled="isReadOnly">
              <option value="file">File</option>
              <option value="remote">
                Remote storage
              </option>
            </select>
          </div>
          <div class="col-md-4 col">
            <div class="label">Data type<sup>*</sup></div>
            <select class="form-select" v-model="geneticsDataType" required :disabled="isReadOnly">
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
            <select class="form-select" v-model="genomeBuild" required :disabled="isReadOnly">
              <option value="hg19">hg19 (GRCh37)</option>
              <option value="hg19">GRCh38</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col">
            <div class="label">Ancestry<sup>*</sup></div>
            <select class="form-select" v-model="ancestry" required :disabled="isReadOnly">
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
                :disabled="isReadOnly"
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
                :disabled="isReadOnly"
            />
          </div>
          <div class="col-md-6 col" style="font-size: 14px">
            <br />
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
              <input type="text" class="form-control input-default"
                     placeholder="(e.g. 28300000, 10.1038/ng.3830, or PMC5968830)"
                     v-model="pubId" :disabled="isReadOnly"/>
              <button type="button" :class="!pubId ? 'btn btn-outline-primary' : 'btn btn-primary'"
                      title="Fetch data from PubMed"
                      @click="getPubMedInfo" :disabled="!pubId || isReadOnly">
                <i class="bi-cloud-arrow-down"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col filter-col-md">
            <div class="label">Publication</div>
            <input type="text" class="form-control input-default" placeholder="Publication"
                   v-model="publication" :disabled="isReadOnly"/>
          </div>
        </div>
        <div class="row">
          <div class="col filter-col-md">
            <div class="label">Description<sup>*</sup></div>
            <textarea v-model="description" rows="4" class="form-control" required :disabled="isReadOnly">
            </textarea>
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
              :disabled="isReadOnly"
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
              :disabled="isReadOnly"
          />
        </div>
        <div class="col-md-12 col">
          <div class="label">Data contributor</div>
          <input
              type="text"
              class="form-control input-default"
              placeholder="Data contributor"
              v-model="dataContributor"
              :disabled="isReadOnly"
          />
        </div>
        <div class="col-md-12 col">
          <div class="label">Data contributor email</div>
          <input
              type="text"
              class="form-control input-default"
              placeholder="contributor@email"
              v-model="dataContributorEmail"
              :disabled="isReadOnly"
          />
        </div>
        <div class="col-md-12 col">
          <div class="label">Institution<sup>*</sup></div>
          <input type="text" class="form-control input-default" placeholder="Institution" v-model="institution"
              required
              :disabled="isReadOnly"
          />
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-primary" @click="save" v-if="!isReadOnly">
      Save Dataset
    </button>
  </form>
  <Modal :status-message="modalMsg" v-if="processing" />
</template>

<style scoped>

</style>
