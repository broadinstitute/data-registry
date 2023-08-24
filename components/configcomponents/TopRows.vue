<template>
    <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
        Top rows tutorial
    </a>
    <div class="row dr-builder-ui">
        <div class="col-md-6 col">
            <div class="label">
                Select rows
            </div>
            <ul class="dr-byor-data-columns">
                <li v-for="field in availableFields" class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" :value="field" 
                            id="flexCheckDefault" v-model="selectedFields"/>
                        <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                </li>
            </ul>
        </div>
        <div class="col-md-6 col">
        <div class="label">
            Selected rows | Change order
        </div>
        <tbody class="dr-byor-data-columns">
            <tr v-for="field, index in selectedFields" class="arrow-button-list">
                {{ field }}
                <td class="arrow-button-holder">
                    <button class="btn btn-primary arrow-button arrow-button-up" 
                        :disabled="index == 0" @click="moveUpDown(index)">
                        &uarr;
                    </button>
                </td>
                <td class="arrow-button-holder">
                    <button class="btn btn-primary arrow-button"
                    :disabled="index == selectedFields.length - 1" @click="moveUpDown(index, true)">
                    &darr;
                    </button>
                </td>
            </tr>
        </tbody>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll()">Select all</button>
        </div>
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => clearAll()">Clear all</button>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

    const store = useConfigBuilderStore();
    const emit = defineEmits(["topRowsChanged"]);
    const availableFields = computed(()=> store.getAllFields);
    const selectedFields = ref([]); 
    const fieldNameOld = computed(() => store.getLatestFieldRename[0]);
    const fieldNameNew = computed(() => store.getLatestFieldRename[1]);
    watch([availableFields, fieldNameOld], (newValues, oldValues) => {
        if (selectedFields.value.includes(fieldNameOld.value) && !selectedFields.value.includes(fieldNameNew.value)){
            let index = selectedFields.value.indexOf(fieldNameOld.value);
            selectedFields.value[index] = fieldNameNew.value;
        }
        let oldFields = oldValues[0];
        let newFields = newValues[0];
        oldFields.forEach((oldField)=>{
            if (!newFields.includes(oldField)){
                selectedFields.value = 
                    selectedFields.value.filter(field => field != oldField);
            }
        });
    });
    function moveUpDown(index, down=false){
        if (down) { index++; }
		let risingItem = selectedFields.value[index];
		selectedFields.value.splice(index, 1);
        selectedFields.value.splice(index-1, 0, risingItem);
	}
    function selectAll(){
        selectedFields.value = JSON.parse(JSON.stringify(availableFields.value)); // Deep copy
    }
    function clearAll(){
        selectedFields.value = [];
    }
    watch(selectedFields, () => emit("topRowsChanged", selectedFields.value));
</script>