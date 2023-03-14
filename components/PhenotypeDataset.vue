  <template>
  <div class="row">
    <div :class="pTypeClass">
      <div class="label">Phenotype<sup>*</sup></div>
      <phenotype-input :identifier="props.identifier" ></phenotype-input><br/>
    </div>
    <div v-if="dichotomous" class="col col-md-3">
      <div class="label">Sample Size<sup>*</sup></div>
      <input type="number" v-model="selectedPhenotypes[props.identifier].sampleSize" placeholder="Sample Size"
             class="form-control input-default" min="0">
    </div>
    <div v-if="dichotomous" class="col col-md-3">
      <div class="label">Cases<sup>*</sup></div>
      <input type="number" v-model="selectedPhenotypes[props.identifier].cases" placeholder="Cases" class="form-control input-default"
             min="0">
    </div>
    <div :class="pTypeClass">
          <div class="label">Data<sup>*</sup></div>
          <div class="input-group" style="align-items: baseline">
          <input v-if="datasetDataType === 'file'" type="file" class="form-control input-default" @change="fileChange">
          <input v-else-if="datasetDataType === 'remote'" type="text" class="form-control input-default" v-model="url"
                 placeholder="Path to remote file location">
          <span v-if="props.identifier !== 'p1'" style="margin-left: 4px"><a @click.prevent="deletePhenotype" href="#" style="color: inherit"><i class="bi bi-trash"></i></a></span>
          </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({datasetDataType: String, identifier: String})
const selectedPhenotypes = useState("selectedPhenotypes", () => {return {'p1':{}}})
const url = ref(null)
const dichotomous = computed(() => selectedPhenotypes.value[props.identifier] && selectedPhenotypes.value[props.identifier].dichotomous)

function fileChange(e){
  selectedPhenotypes.value[props.identifier].file = e.target.files[0]
}

watch(url, (newVal, oldVal) => {
  if(newVal){
    selectedPhenotypes.value[props.identifier].url = newVal
  }
})

const pTypeClass = computed(() => {
  return dichotomous.value ? 'col col-md-3' : 'col col-md-6'
})

function deletePhenotype(){
  delete selectedPhenotypes.value[props.identifier]
}
</script>
