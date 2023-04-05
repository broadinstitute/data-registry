<template>
    <div>
        <AutoComplete :items="phenotypes" :filter-function="filterFunc" :select-item="selectedPhenotype" />
    </div>
</template>
<script setup>
import AutoComplete from "~/components/AutoComplete.vue";

const phenotypes = useState("phenotypes", () => []);
const selectedPhenotype = ref({})
const phenotypeOptions = useState("phenotypeOptions", () => []);
const config = useRuntimeConfig();

async function getPhenotypes() {
    const { data } = await $fetch(config.phenotypesUrl);
    const mappedPhenotypes = {};
    data.forEach((d) => (mappedPhenotypes[d.description] = d));
    phenotypes.value = data;
    phenotypeOptions.value = data.map((p) => {
        return { label: p.description, value: p.name };
    });
}

function filterFunc(q){
    return phenotypes.value.filter((p) => {
        if(q.length < 2) return false;
        const words = q.split(" ")
        let matches = 0;
        words.forEach((word) => {
            if(p.description.toLowerCase().indexOf(word.toLowerCase()) !== -1) matches++;
        });
        return matches === words.length;
    });
}

onBeforeMount(() => {
    getPhenotypes();
});
</script>
