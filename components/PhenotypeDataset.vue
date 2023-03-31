  <template>
  <div class="row">
    <div :class="pTypeClass">
      <div class="label">Phenotype<sup>*</sup></div>
      <input type="text" class="pt autocomplete form-control input-default" :id="props.identifier"
             placeholder="Phenotype" required @blur="leaveDialog">
      <div v-if="needsDichotomousInfo">
        <label for="dichotomousInfo" class="label">Dichotomous<sup>*</sup> &nbsp;</label><input type="checkbox" id="dichotomousInfo" v-model="selectedPhenotypes[props.identifier].dichotomous">
      </div>
    </div>
    <div class="col col-md-2">
      <div class="label">Sample Size<sup>*</sup></div>
      <input type="number" v-model="selectedPhenotypes[props.identifier].sampleSize" placeholder="Sample Size"
             class="form-control input-default" min="0" required>
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">Cases<sup>*</sup></div>
      <input type="number" v-model="selectedPhenotypes[props.identifier].cases" placeholder="Cases" class="form-control input-default"
             min="0" required>
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">Controls<sup>*</sup></div>
      <input type="number" v-model="selectedPhenotypes[props.identifier].controls" placeholder="Controls" class="form-control input-default"
             min="0" required>
    </div>
    <div :class="pTypeClass">
          <div class="label">Data<sup>*</sup></div>
          <div class="input-group" style="align-items: baseline">
          <input v-if="datasetDataType === 'file'" type="file" class="form-control input-default" @change="fileChange" required>
          <input v-else-if="datasetDataType === 'remote'" type="text" class="form-control input-default" v-model="url"
                 placeholder="Path to remote file location" required>
          <span v-if="props.identifier !== 'p1'" style="margin-left: 4px"><a @click.prevent="deletePhenotype" href="#" style="color: inherit"><i class="bi bi-trash"></i></a></span>
          </div>
    </div>
  </div>
</template>

<script setup>

import Autocomplete from 'bootstrap5-autocomplete'
import Index from '~/pages/index.vue'


const props = defineProps({datasetDataType: String, identifier: String})
const phenotypeOptions = useState("phenotypeOptions")
const phenotypes = useState("phenotypes")
const selectedPhenotypes = useState("selectedPhenotypes", () => {return {'p1':{}}})
const url = ref(null)
const needsDichotomousInfo = ref(false)
const dichotomous = computed(() => selectedPhenotypes.value[props.identifier] && selectedPhenotypes.value[props.identifier].dichotomous)

function fileChange(e){
  selectedPhenotypes.value[props.identifier].file = e.target.files[0]
}

onMounted(() => {
  initPhenotypeAutocomplete()
})

function initPhenotypeAutocomplete() {
  if (phenotypeOptions.value.length === 0){
    return
  }
  Autocomplete.init('.pt.autocomplete', {
    items: phenotypeOptions.value,
    valueField: 'value',
    labelField: 'label',
    updateOnSelect: true,
    autoselectFirst: false,
    fixed: true,
    onSelectItem: checkVal
  })
}

watch(phenotypeOptions, (newV, oldV) => {
  initPhenotypeAutocomplete()
})

function checkVal(val){
  const input = document.getElementById(props.identifier)
  selectedPhenotypes.value[props.identifier] = phenotypes.value[val.label]
  needsDichotomousInfo.value = false
  input.setCustomValidity('')
}

function leaveDialog() {
  const input = document.getElementById(props.identifier)
  const matches = phenotypes.value[input.value]
  if(!matches){
    selectedPhenotypes.value[props.identifier] = {"name": input.value, "dichotomous": false}
    needsDichotomousInfo.value = true
  }
}

watch(url, (newVal, oldVal) => {
  if(newVal){
    selectedPhenotypes.value[props.identifier].url = newVal
  }
})

const pTypeClass = computed(() => {
  return dichotomous.value ? 'col col-md-3' : 'col col-md-5'
})

function deletePhenotype(){
  delete selectedPhenotypes.value[props.identifier]
}
</script>
