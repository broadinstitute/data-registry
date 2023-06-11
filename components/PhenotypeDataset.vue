  <template>
  <div class="row">
    <div :class="pTypeClass">
      <div class="label">Phenotype<sup>*</sup></div>
      <AutoCompleteDialog placeholder="Phenotype" :items="Object.values(phenotypes)" :filter-function="filterFunc"
                          :id="`pheno-${props.identifier}`"
                          @blur="ptypeBlur" :item-display="i => i.description" :initial-input="phenotypeDataset.description" :disabled="isControlDisabled()"/>
      <div v-if="needsDichotomousInfo">
        <label for="dichotomousInfo" class="label">Dichotomous<sup>*</sup> &nbsp;</label><input type="checkbox" id="dichotomousInfo" v-model="phenotypeDataset.dichotomous">
      </div>
    </div>
    <div class="col col-md-2">
      <div class="label">Sample Size<sup>*</sup></div>
      <input type="number" v-model="phenotypeDataset.sampleSize" placeholder="Sample Size"
             class="form-control input-default" min="0" required :disabled="isControlDisabled()">
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">Cases<sup>*</sup></div>
      <input type="number" v-model="phenotypeDataset.cases" placeholder="Cases" class="form-control input-default"
             min="0" required :disabled="isControlDisabled()">
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">Controls<sup>*</sup></div>
      <input type="number" v-model="phenotypeDataset.controls" placeholder="Controls" class="form-control input-default"
             min="0" required :disabled="isControlDisabled()">
    </div>
    <div :class="pTypeClass">
          <div class="label">Data<sup>*</sup></div>
          <div class="input-group" style="align-items: baseline">
          <input v-if="!phenotypeDataset.id" type="file" class="form-control input-default" @change="fileChange" required :disabled="props.disabled">
          <input type="text" class="form-control input-default" v-else disabled="disabled" :value="phenotypeDataset.fileName">
          <span style="margin-left: 4px"><a @click.prevent="deletePhenotype" href="#" style="color: inherit"><i class="bi bi-trash"></i></a></span>
          </div>
    </div>
  </div>
        <div class="row" v-for="(cs, idx) in phenotypeDataset.credibleSets">
          <div class="col col-md-11 offset-md-1">
            <div class="row dr-meta-info" style="margin-right: 10px;">
              <div class="col col-md-6">
                <div class="label">Credible Set Name</div>
                <input type="text" class="form-control input-default credible-set" placeholder="name" :data-associated-phenotype="`${props.identifier}-${idx}`"
                       v-model="cs.name" :disabled="isControlDisabled()">
              </div>
              <div class="col col-md-6">
                <div class="label">Credible Set File</div>
                <input v-if="!phenotypeDataset.id" type="file" class="form-control input-default credible-set" placeholder="file"
                       :data-associated-phenotype="`${props.identifier}-${idx}`" @change="credibleSetFileChange" :disabled="props.disabled">
                <input type="text" class="form-control input-default" v-else disabled="disabled" :value="cs.fileName">
              </div>
            </div>
          </div>

        </div>
      <div class="row" v-if="!isControlDisabled()">
        <div class="col col-md-11 offset-md-1" style="margin-top: -22px; padding: 0px">
          <a href="#" @click.prevent="phenotypeDataset.credibleSets.push({})" >Add Credible Set</a>
        </div>
      </div>
</template>

<script setup>

const props = defineProps({datasetDataType: String, phenotypeDataset: Object, identifier: Number, disabled: Boolean})
const phenotypes = useState("phenotypes", () => []);
const phenotypeDataset = toRef(props, "phenotypeDataset")
const needsDichotomousInfo = ref(false)
const dichotomous = computed(() => phenotypeDataset.value && phenotypeDataset.value.dichotomous)
const emit = defineEmits(['remove-phenotype-dataset'])

function fileChange(e){
  phenotypeDataset.value.file = e.target.files[0]
  phenotypeDataset.value.fileName = e.target.files[0].name
}

function credibleSetFileChange(e){
  const cs_idx = parseInt(e.target.getAttribute("data-associated-phenotype").split("-")[1])
  phenotypeDataset.value.credibleSets[cs_idx]["credibleSetFile"] = e.target.files[0]
  phenotypeDataset.value.credibleSets[cs_idx]["fileName"] = e.target.files[0].name
}

function ptypeBlur(event){
  const isExistingPhenotype = event.value instanceof Object;
  if(!isExistingPhenotype){
    if(!event.value){
      return;
    }
    phenotypeDataset.value.name = event.value
    phenotypeDataset.value.dichotomous = false
    phenotypeDataset.value.description = event.value
    needsDichotomousInfo.value = true;
  } else {
    phenotypeDataset.value.name = event.value.name;
    phenotypeDataset.value.description = event.value.description;
    phenotypeDataset.value.dichotomous = event.value.dichotomous;
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


const pTypeClass = computed(() => {
  return dichotomous.value ? 'col col-md-3' : 'col col-md-5'
})

function isControlDisabled(){
  return props.disabled || !!phenotypeDataset.value.id
}

function deletePhenotype(){
  emit('remove-phenotype-dataset', {id: props.identifier})
}
</script>
