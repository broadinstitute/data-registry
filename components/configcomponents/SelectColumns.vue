<template>
    Select fields to build page 
    <sup class="optional">Edit default field names to set new names</sup>
    <div class="row">
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll(true)">Select all</button>
        </div>
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll(false)">Clear all</button>
        </div>
    </div>
    <div>
        <div class="row">
            <div class="col-md-6 col">
                <div class="label">Field</div>
            </div>
            <div class="col-md-6 col">
                <div class="label">New field name</div>
            </div>
        </div>
        <div v-for="rawField, index in rawFields" class="row">
            <div class="col-md-6 col">
                <input class="form-check-input" type="checkbox" id="flexCheckDefault" 
                    :value="rawField" v-model="selectedColumns"
                    @change="toggleBox(index)"/>
                <span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
            </div>
            <div class="col-md-4 col">
                <input class="column-select form-control input-default" 
                    :disabled="!selectedColumns.includes(rawField)" :id="`field_${index}`" type="text" 
                    @change="event => setColumnName(index, event.target.value)"/>
                <div :id="`warning_${index}`" hidden>
                    <sup>Field names must be unique</sup>
                </div>
            </div>
		</div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

    const store = useConfigBuilderStore();
    const rawFields = computed(()=> store.rawFields);
    const selectedColumns = ref([]);
    function toggleBox(index){
        let rawField = rawFields.value[index];
        if(selectedColumns.value.includes(rawField)){
            store.addSelectedColumn(rawField);
            setDisplayName(index, rawField);
            return;
        }
        setDisplayName(index, "");
        store.deleteSelectedColumn(rawField);
    }
    function setColumnName(index, newName){
        let warning = document.querySelector(`#warning_${index}`);
        warning.hidden = true;
        let rawField = rawFields.value[index];
        if (newName == ""){
            restoreDefaultColumnName(index);
            return;
        }
        if (store.selectedColumns.map(column => column[1]).includes(newName)){
            warning.hidden = false;
            restoreDefaultColumnName(index);
            return;
        }
        store.renameColumn(rawField, newName);
    }
    function restoreDefaultColumnName(index){
        let rawField = rawFields.value[index];
        setDisplayName(index, rawField);
        store.renameColumn(rawField, newName);
        //What happens if the original column data has an empty string in it?
    }

    function setDisplayName(index, newName){
        let inputField = document.querySelector(`input#field_${index}`);
        inputField.value = newName;
    }
    function selectAll(toggleOn){
        selectedColumns.value = !!toggleOn ? rawFields.value : [];
        for (let i = 0; i < rawFields.value.length; i++){
            toggleBox(i);
        }
    }
    watch(rawFields, (newFields, oldFields) => {
        oldFields.forEach(oldField => {
            if (!newFields.includes(oldField)){
                selectedColumns.value = selectedColumns.value.filter(column => column != oldField);
                store.deleteSelectedColumn(oldField);
            }
        });
    });
</script>