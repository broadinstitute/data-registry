<template>
  <n-auto-complete :options="filteredPhenotypes"
                   placeholder="Phenotype"
                   v-model:value="value"
                   :input-props="{autocomplete: 'disabled'}" @blur="leaveDialog" style="border-radius: .375rem;"

  />
</template>

<script setup>
const phenotypes = useState("phenotypes")
const phenotypeOptions = useState("phenotypeOptions")
const selectedPhenotypes = useState("selectedPhenotypes", () => {return {'p1':{}}})
const value = ref('')
const props = defineProps({
  identifier:String
})

const filteredPhenotypes = computed(() => {
  const v1 = value.value
  const p1 = phenotypeOptions.value
  return v1.length > 0 ? p1.filter(p => p.label.toLowerCase().startsWith(v1.toLowerCase())) : p1
})

function leaveDialog() {
  const matches = phenotypes.value.filter(p => p.description === value.value)
  if(matches.length === 1){
    selectedPhenotypes.value[props.identifier] = matches[0]
  }
}

</script>
