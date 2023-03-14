<template>
    <n-auto-complete :options="filteredStudies"
                     placeholder="Study Name"
                     v-model:value="value"
                     :input-props="{autocomplete: 'disabled'}"
                     @blur="leaveDialog"
    />
</template>

<script setup>
const studies = useState("studies", () => [])
const study = useState("study")
const value = ref('')

const filteredStudies = computed(() => {
  const v1 = value.value
  return v1.length > 0 && studies.value.filter ? studies.value.filter(s => s.label.toLowerCase().startsWith(v1.toLowerCase())) : studies.value
})

function leaveDialog() {
  const matches = studies.value.filter(s => s.label === value.value)
  if(matches.length === 1){
    study.value = matches[0]
  } else {
    study.value = value.value
  }
}

</script>
