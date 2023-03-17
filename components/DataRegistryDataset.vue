<template>
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
                placeholder="Dataset name"
                v-model="dsName"
                required
            />
          </div>

          <div class="col-md-6 col">
            <div class="label">Status<sup>*</sup></div>
            <select class="form-select" v-model="pubStatus" required>
              <option value="pre">Pre-publication</option>
              <option value="open">Open access</option>
            </select>
          </div>
        </div>
      <div class="row dr-status-section">
        <div class="col-md-12 col">
          <div class="label">
            Study<sup>*</sup>
          </div>
          <input type="text" class="study autocomplete form-control input-default" id="study"
                 placeholder="Study" required @blur="leaveStudy">
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
              <select class="form-select" v-model="dataType" required>
                <option value="file">File</option>
                <option value="remote">
                  Remote storage
                </option>
              </select>
            </div>
            <div class="col-md-4 col">
              <div class="label">
                Data type<sup>*</sup>
              </div>
              <select class="form-select" v-model="geneticsDataType" required>
                <option value="gwas">GWAS</option>
                <option value="exomchip">
                  Exome chip
                </option>
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
              <select class="form-select" v-model="genomeBuild" required>
                <option value="hg19">
                  hg19 (GRCh37)
                </option>
                <option value="hg19">GRCh38</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col">
              <div class="label">
                Ancestry<sup>*</sup>
              </div>
              <select class="form-select" v-model="ancestry" required>
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
                <option value="EA">East Asian</option>
                <option value="SA">South Asian</option>
                <option value="SEA">
                  South East Asian
                </option>
                <option value="EU">European</option>
                <option value="GME">
                  Greater Middle Eastern (Middle
                  Eastern, North African, or Persian)
                </option>
                <option value="HS">
                  Hispanic or Latin American
                </option>
                <option value="NAM">
                  Native American
                </option>
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
              <select class="form-select" v-model="sex" required>
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
            <div
                class="col-md-6 col"
                style="font-size: 14px"
            >
              <br />
              Learn how to calculate sample size
              <a href="javascript:;">here</a>.
            </div>
          </div>
          <div class="row dr-data-section">
            <div class="col-md-12"><h4>Data</h4></div>
            <PhenotypeDatasetList :dataset-data-type="dataType"/>
          </div>
        </div>
        <div class="col-md-3 dr-meta-info">
          <div class="col-md-12 col">
            <div class="label">
              Data submitter<sup>*</sup>
            </div>
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
            <div class="col filter-col-md">
              <div class="label">
                Description<sup>*</sup>
              </div>
              <textarea v-model="description"
                        rows="4"
                        class="form-control"
                        required
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-md-9 col filter-col-md">
              <div class="label">Publication</div>
              <input
                  type="text"
                  class="form-control input-default"
                  placeholder="Publication"
                  v-model="publication"
              />
            </div>
            <div class="col-md-3 col filter-col-md">
              <div class="label">PMID</div>
              <input
                  type="text"
                  class="form-control input-default"
                  placeholder="PMID"
                  v-model="pmid"
              />
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="save">Save Dataset</button>
      </form>

    </div>
    <div class="dr-modal dr-hidden">
      <div class="dr-container">
        <div class="dr-modal-body">
          <p id="modalMsg">Saving info to server...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import Autocomplete from 'bootstrap5-autocomplete'


const datasetName = ref(null)
const dataType = ref('file')
const geneticsDataType = ref('')
const dsName = ref('')
const institution = ref('')
const genomeBuild = ref('')
const ancestry = ref('')
const dataSubmitter = ref('')
const dataSubmitterEmail = ref('')
const dataContributorEmail = ref(null)
const dataContributor = ref(null)
const sex = ref('')
const globalSampleSize = ref('')
const pubStatus = ref('')
const description = ref('')
const pmid = ref(null)
const publication = ref(null)

const config = useRuntimeConfig()
const study = useState("study")
const phenotypeDatasets = useState("selectedPhenotypes")
const studies = useState("studies", () => [])

onMounted(() => {
  datasetName.value.focus()
})

watch(studies, (newV, oldV) => {
  Autocomplete.init('.study.autocomplete', {
    items: studies.value,
    valueField: "value",
    labelField: "label",
    updateOnSelect: true,
    autoselectFirst: false,
    fixed: true,
    onSelectItem: checkStudy,
  })
})

function leaveStudy() {
  const input = document.getElementById("study")
  console.log(`study = ${input.value}`)
  const matches = studies.value.filter(s => s.label === input.value)
  if(matches.length === 0){
    study.value = input.value
  } else {
    study.value = matches[0]
  }
}

function checkStudy(val){
  const matches = studies.value.filter(s => s.label === val)
  if(matches.length === 1){
    study.value = matches[0]
  } else {
    study.value = val
  }
}

function getBaseHttpOptions() {
  return { method: 'POST', headers: {"access-token": config.apiSecret,
      "Content-Type": "application/json"}}
}

async function saveStudy() {
  const opts = getBaseHttpOptions()
  console.log(study.value)
  opts.body = JSON.stringify({'name': study.value, 'institution': institution.value})
  return await $fetch(`${config.apiBaseUrl}/api/studies`, opts)
}

async function save(){
  const form = document.getElementById('inputForm')
  if(!form.checkValidity()){
    form.classList.add('was-validated')
    return;
  }
  document.querySelector(".dr-modal").classList.remove("dr-hidden")
  let dataset_id;
  if(typeof study.value === 'object'){
    console.log("No need to save study")
    dataset_id = await saveDataset(study.value.value)
  } else {
    const res = await saveStudy();
    const { study_id } = res
    console.log(`Saved study id is ${study_id}`)
    dataset_id = await saveDataset(study_id)
  }
  for(const phenotype of Object.keys(phenotypeDatasets.value)){
    document.getElementById("modalMsg").innerText = `Uploading data for ${phenotypeDatasets.value[phenotype].name}`
    await savePhenotype(dataset_id, phenotype)
  }
  document.querySelector(".dr-modal").classList.add("dr-hidden")
}

function getUrl(dataset_id, pType) {
  let url = `${config.apiBaseUrl}/api/uploadfile/${dataset_id}/${pType.name}/${pType.dichotomous}/${pType.sampleSize}`
  if(!pType.dichotomous){
    return url
  }
  return url + `?controls=${pType.controls}&cases=${pType.cases}`
}

async function savePhenotype(dataset_id, pKey){
  const formData = new FormData();
  const pType = phenotypeDatasets.value[pKey]
  formData.append('file', pType.file);
  const res = await axios.post(getUrl(dataset_id, pType),
      formData, {headers: { "access-token": config.apiSecret, 'Content-Type': 'multipart/form-data'}})
  console.log(JSON.stringify(res))
}

async function saveDataset(study_id) {
  const shortened_study_id = study_id.replaceAll('-', '')
  const opts = getBaseHttpOptions()
  opts.body = JSON.stringify({
    'name': dsName.value,
    'data_source_type': dataType.value,
    'data_type': geneticsDataType.value,
    'genome_build': genomeBuild.value,
    'ancestry': ancestry.value,
    'data_submitter': dataSubmitter.value,
    'data_submitter_email': dataSubmitterEmail.value,
    'data_contributor_email': dataContributorEmail.value,
    'data_contributor': dataContributor.value,
    'sex': sex.value,
    'global_sample_size': globalSampleSize.value,
    'study_id': shortened_study_id,
    'status': pubStatus.value,
    'description': description.value,
    'pmid': pmid.value,
    'publication': publication.value
  })
  const json = await $fetch(`${config.apiBaseUrl}/api/datasets`, opts)
  console.log(`Dataset saved with id ${json.dataset_id}`)
  return json.dataset_id
}

</script>
