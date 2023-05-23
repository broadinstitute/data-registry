  <template>
  <div class="row">
    <div :class="pTypeClass">
      <div class="label">Phenotype<sup>*</sup></div>
      <AutoCompleteDialog placeholder="Phenotype" :items="Object.values(phenotypes)" :filter-function="filterFunc"
                          :id="props.identifier"
                          @blur="ptypeBlur" :item-display="i => i.description" :initial-input="selectedPhenotypes[props.identifier].description"/>
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

const props = defineProps({datasetDataType: String, identifier: String})
const phenotypeOptions = useState("phenotypeOptions")
const phenotypes = useState("phenotypes", () => []);
const selectedPhenotypes = useState("selectedPhenotypes", () => {return {'p1':{}}})
const url = ref(null)
const needsDichotomousInfo = ref(false)
const dichotomous = computed(() => selectedPhenotypes.value[props.identifier] && selectedPhenotypes.value[props.identifier].dichotomous)

function fileChange(e){
  selectedPhenotypes.value[props.identifier].file = e.target.files[0]
}

function ptypeBlur(event){
  const isExistingPhenotype = event.value instanceof Object;
  if(!isExistingPhenotype){
    if(!event.value){
      return;
    }
    selectedPhenotypes.value[event.id] = {"name": event.value, "dichotomous": false,
      "description": event.value};
    needsDichotomousInfo.value = true;
  } else {
    selectedPhenotypes.value[event.id].name = event.value.name;
    selectedPhenotypes.value[event.id].description = event.value.description;
    selectedPhenotypes.value[event.id].dichotomous = event.value.dichotomous;
    needsDichotomousInfo.value = false;
  }
}

function filterFunc(q){
  return Object.values(phenotypes.value).filter((p) => {
    if(q.length < 2) return false;
    const words = q.split(" ")
    let matches = 0;
    words.forEach((word) => {
      if(p.description.toLowerCase().indexOf(word.toLowerCase()) !== -1) matches++;
    });
    return matches === words.length;
  });
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
