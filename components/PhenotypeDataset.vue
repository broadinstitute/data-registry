<template>
  <div class="row">
    <div :class="pTypeClass">
      <div class="label">
        Phenotype<sup>*</sup>
      </div>
      <AutoCompleteDialog
        :id="`pheno-${props.identifier}`"
        placeholder="Phenotype"
        :items="Object.values(phenotypes)"
        :filter-function="filterFunc"
        :item-display="i => i.description"
        :initial-input="phenotypeDataset.description"
        :disabled="isControlDisabled()"
        @blur="ptypeBlur"
      />
      <div v-if="needsDichotomousInfo">
        <label for="dichotomousInfo" class="label">Dichotomous<sup>*</sup> &nbsp;</label><input id="dichotomousInfo" v-model="phenotypeDataset.dichotomous" type="checkbox">
      </div>
    </div>
    <div class="col col-md-2">
      <div class="label">
        Sample Size<sup>*</sup>
      </div>
      <input
        v-model="phenotypeDataset.sampleSize"
        type="number"
        placeholder="Sample Size"
        class="form-control input-default"
        min="0"
        required
        :disabled="isControlDisabled()"
      >
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">
        Cases<sup>*</sup>
      </div>
      <input
        v-model="phenotypeDataset.cases"
        type="number"
        placeholder="Cases"
        class="form-control input-default"
        min="0"
        required
        :disabled="isControlDisabled()"
      >
    </div>
    <div v-if="dichotomous" class="col col-md-2">
      <div class="label">
        Controls<sup>*</sup>
      </div>
      <input
        v-model="phenotypeDataset.controls"
        type="number"
        placeholder="Controls"
        class="form-control input-default"
        min="0"
        required
        :disabled="isControlDisabled()"
      >
    </div>
    <div :class="pTypeClass">
      <div class="label">
        Data<sup>*</sup>
      </div>
      <div class="input-group" style="align-items: baseline">
        <input
          v-if="!phenotypeDataset.id"
          type="file"
          class="form-control input-default"
          required
          :disabled="props.disabled"
          @change="fileChange"
        >
        <input v-else type="text" class="form-control input-default" disabled="disabled" :value="phenotypeDataset.fileName">
        <span v-if="!props.disabled" style="margin-left: 4px"><a href="#" style="color: inherit" @click.prevent="deletePhenotype"><i class="bi bi-trash" /></a></span>
      </div>
    </div>
  </div>
  <div v-for="(cs, idx) in phenotypeDataset.credibleSets" class="row" :key="idx">
    <div class="col col-md-11 offset-md-1">
      <div class="row dr-meta-info" style="margin-right: 10px;">
        <div class="col col-md-6">
          <div class="label">
            Credible Set Name
          </div>
          <input
            v-model="cs.name"
            type="text"
            class="form-control input-default credible-set"
            placeholder="name"
            :data-associated-phenotype="`${props.identifier}-${idx}`"
            :disabled="props.disabled || !!cs.id"
          >
        </div>
        <div class="col col-md-6">
          <div class="label">
            Credible Set File
          </div>
          <input
            v-if="!cs.id"
            type="file"
            class="form-control input-default credible-set"
            placeholder="file"
            :data-associated-phenotype="`${props.identifier}-${idx}`"
            :disabled="props.disabled"
            @change="credibleSetFileChange"
          >
          <input
            v-else
            type="text"
            class="form-control input-default"
            disabled="disabled"
            :value="cs.fileName"
          >
        </div>
      </div>
    </div>
  </div>
  <div v-if="!props.disabled" class="row">
    <div class="col col-md-11 offset-md-1" :style="credibleSetAddStyle">
      <a href="#" @click.prevent="phenotypeDataset.credibleSets.push({})">Add Credible Set</a>
    </div>
  </div>
</template>

<script setup>

import { useDatasetStore } from '~/stores/DatasetStore';

const store = useDatasetStore();
const props = defineProps({ datasetDataType: String, phenotypeDataset: Object, identifier: Number, disabled: Boolean });
const phenotypes = store.phenotypes;
const phenotypeDataset = toRef(props, "phenotypeDataset");
const needsDichotomousInfo = ref(false);
const dichotomous = computed(() => phenotypeDataset.value && phenotypeDataset.value.dichotomous);
const emit = defineEmits(['remove-phenotype-dataset']);

function fileChange (e) {
  phenotypeDataset.value.file = e.target.files[0];
  phenotypeDataset.value.fileName = e.target.files[0].name;
}

function credibleSetFileChange (e) {
  const cs_idx = parseInt(e.target.getAttribute("data-associated-phenotype").split("-")[1]);
  phenotypeDataset.value.credibleSets[cs_idx].credibleSetFile = e.target.files[0];
  phenotypeDataset.value.credibleSets[cs_idx].fileName = e.target.files[0].name;
}

function ptypeBlur (event) {
  const isExistingPhenotype = event.value instanceof Object;
  if (!isExistingPhenotype) {
    if (!event.value) {
      return;
    }
    phenotypeDataset.value.name = event.value;
    phenotypeDataset.value.dichotomous = false;
    phenotypeDataset.value.description = event.value;
    needsDichotomousInfo.value = true;
  } else {
    phenotypeDataset.value.name = event.value.name;
    phenotypeDataset.value.description = event.value.description;
    phenotypeDataset.value.dichotomous = event.value.dichotomous;
    needsDichotomousInfo.value = false;
  }
}

function filterFunc (q) {
  return Object.values(phenotypes).filter((p) => {
    if (q.length < 2) { return false; }
    const words = q.split(" ");
    let matches = 0;
    words.forEach((word) => {
      if (p.description.toLowerCase().includes(word.toLowerCase())) { matches++; }
    });
    return matches === words.length;
  });
}

const pTypeClass = computed(() => {
  return dichotomous.value ? 'col col-md-3' : 'col col-md-5';
});

function isControlDisabled () {
  return props.disabled || !!phenotypeDataset.value.id;
}

const credibleSetAddStyle = computed(() => {
  return phenotypeDataset.value.credibleSets.length === 0 ? {} : { 'margin-top': '-22px', padding: '0px' };
});

function deletePhenotype () {
  emit('remove-phenotype-dataset', { id: props.identifier });
}
</script>
