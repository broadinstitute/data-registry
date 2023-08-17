<template>
    Select fields to build page 
    <sup class="optional">Edit default field names to set new names</sup>
    <div class="row">
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => selectAll()">Select all</button>
        </div>
        <div class="col-md-1">
            <button class="btn btn-primary" @click="() => clearAll()">Clear all</button>
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
    const rawFields = computed(()=> store.getRawFields);
    const selectedColumns = ref([]);
    const columnNames = ref({});
    function toggleBox(index){
        let rawField = rawFields.value[index];
        if(selectedColumns.value.includes(rawField)){
            setDefaultColumnName(index);
            return;
        }
        setDisplayName(index, "");
        delete columnNames.value[rawField];
        saveColumns();
    }
    function setColumnName(index, newName){
        let warning = document.querySelector(`#warning_${index}`);
        warning.hidden = true;
        let rawField = rawFields.value[index];
        if (newName == ""){
            setDefaultColumnName(index);
            return;
        }
        if (Object.values(columnNames.value).includes(newName)){
            warning.hidden = false;
            setDefaultColumnName(index);
            return;
        }
        // Replace an old name
        if (!!columnNames.value[rawField]){
            console.log(`${rawField} => ${newName}`);
            store.setColumnNameChange([rawField, newName]);
        }
        columnNames.value[rawField] = newName;
        console.log(JSON.stringify(columnNames.value));
        saveColumns();
    }
    function setDefaultColumnName(index){
        let rawField = rawFields.value[index];
        setDisplayName(index, rawField);
        //What happens if the original column data has an empty string in it?
        columnNames.value[rawField] = rawField;
        saveColumns();
    }
    function setDisplayName(index, newName){
        let inputField = document.querySelector(`input#field_${index}`);
        inputField.value = newName;
    }
    function saveColumns(){
        let output = [];
        selectedColumns.value.forEach(column => {
            output.push([column, columnNames.value[column]])
        });
        store.setSelectedColumns(output);
        store.setColumnObject(columnNames.value);
    }
    function selectAll(){
        selectedColumns.value = rawFields.value;
        for (let i = 0; i < rawFields.value.length; i++){
            toggleBox(i);
        }
    }
    function clearAll(){
        selectedColumns.value = [];
        for (let i = 0; i < rawFields.value.length; i++){
            toggleBox(i);
        }
    }
</script>