<template>
    <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
        Top rows tutorial
    </a>
    <div class="row dr-builder-ui">
        <div class="col-md-6 col">
            <div class="label">
                Select rows
            </div>
            <tr>
                <th>
                    <input class="form-check-input" type="checkbox" 
                        v-model="selectAll" @change="toggleSelectAll()"/>
                </th>
                <th>
                    <div class="label">
                        Select rows
                    </div>
                </th>
            </tr>
            <tr v-for="field in availableFields">
                <td>
                    <input class="form-check-input" type="checkbox" :value="field" 
                        id="flexCheckDefault" v-model="selectedFields"/>
                </td>
                <td>
                    <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                </td>
            </tr>
        </div>
        <div class="col-md-6 col">
        <div class="label">
            Set order
        </div>
        <tbody class="dr-byor-data-columns">
            <tr v-for="field, index in selectedFields" class="arrow-button-list">
                {{ field }}
                <td class="arrow-button-holder">
                    <button class="btn btn-primary arrow-button arrow-button-up" 
                        :disabled="index === 0" @click="moveUpDown(index)">
                        &uarr;
                    </button>
                </td>
                <td class="arrow-button-holder">
                    <button class="btn btn-primary arrow-button"
                    :disabled="index === selectedFields.length - 1" @click="moveUpDown(index, true)">
                    &darr;
                    </button>
                </td>
            </tr>
        </tbody>
        </div>
    </div>
    <div class="row">
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll(true)">Select all</button>
        </div>
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll(false)">Clear all</button>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

    const store = useConfigBuilderStore();
    const emit = defineEmits(["topRowsChanged"]);
    const availableFields = computed(()=> store.allFields);
    const selectedFields = ref([]);
    const selectAll = ref(false);
    const fieldNameOld = computed(() => store.latestFieldRename[0]);
    const fieldNameNew = computed(() => store.latestFieldRename[1]);
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
                    selectedFields.value.filter(field => field !== oldField);
            }
        });
    });
    function moveUpDown(index, down=false){
        if (down) { index++; }
		let risingItem = selectedFields.value[index];
		selectedFields.value.splice(index, 1);
        selectedFields.value.splice(index-1, 0, risingItem);
	}
    function toggleSelectAll(){
        selectedFields.value = !!selectAll.value ? availableFields.value.slice() : []; // Deep copy
    }
    watch(selectedFields, () => emit("topRowsChanged", selectedFields.value));
</script>