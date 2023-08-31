<template>
    <div>
        <a href="https://hugeampkpncms.org/node/42" target="_blank" class="tutorial-link">
            Data Convert tutorial
        </a>
        <div class="row dr-builder-ui">
            <div class="col-md-3 col">
                <div class="label">Type</div>
                <select class="form-control" v-model="dataConvertType" :disabled="editingFieldIndex >= 0">
                    <option value="">Select a data convert type</option>
                    <option v-for="dcOption in dataConvertOptions" :value="dcOption.selectValue">
                        {{ dcOption.displayName }}
                    </option>
                </select>
            </div>
            <div class="col-md-8 col">
				<Calculate 
                    v-if="dataConvertType === 'calculate'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </Calculate>
                <Join 
                    v-else-if="dataConvertType === 'join'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </Join>
				<JoinMulti 
                    v-else-if="dataConvertType === 'join multi'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </JoinMulti>
				<ArrayToString 
                    v-else-if="dataConvertType === 'array to string'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </ArrayToString>
				<ReplaceCharacters 
                    v-else-if="dataConvertType === 'replace characters'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </ReplaceCharacters>
				<ScoreColumns 
                    v-else-if="dataConvertType === 'score columns'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </ScoreColumns>
                <Split 
                    v-else-if="dataConvertType === 'split'" :load-config="currentConfigString"
                    @config-changed="(newConfig, check) => updateConfig(newConfig, check)">
                </Split>
                <div class="failed-save" v-if="showMsg">{{ failedSaveMsg }}</div>
			</div>
			<div class="col-md-1 col">
				<button class="btn btn-primary btn-sm" type="button" @click="saveField">
                    Save
                </button>
                <button class="btn btn-warning btn-sm" type="button" @click="doneEditing">
                    Cancel
                </button>
                <button class="btn btn-danger btn-sm" type="button" @click="deleteField">
                    Delete
                </button>
			</div>
		</div>
    </div>
    <div class="row">
		<div class="col-md-12 col text-center dr-bubbles-wrapper">
			<div class="dr-format-bubble" v-for="field, index in savedFieldConfigs">
				<span class="name">{{ field["field name"] }}</span>
                <span class="type">{{ field["type"] }}</span>
                <span class="editing" v-if="editingFieldIndex === index">Editing</span>
                <a v-else @click="editField(index)"><span class="edit">Edit</span></a>
		    </div>
        </div>
    </div>
</template>
<script setup>
    import ArrayToString from "@/components/configcomponents/dataconverters/ArrayToString.vue";
    import Calculate from "@/components/configcomponents/dataconverters/Calculate.vue";
    import Join from "@/components/configcomponents/dataconverters/Join.vue";
    import JoinMulti from "@/components/configcomponents/dataconverters/JoinMulti.vue";
    import ReplaceCharacters from "@/components/configcomponents/dataconverters/ReplaceCharacters.vue";
    import ScoreColumns from "@/components/configcomponents/dataconverters/ScoreColumns.vue";
    import Split from "@/components/configcomponents/dataconverters/Split.vue";
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
    const defaultType = "";
    const dataConvertType = ref(defaultType);
    const dataConvertOptions = [
        {
            displayName: "Array to string *",
            selectValue: "array to string" 
        },
        {
            displayName: "Calculate",
            selectValue: "calculate",
        },
        {
            displayName: "Join",
            selectValue: "join"
        },
        {
            displayName: "Join multi",
            selectValue: "join multi"
        },
        {
            displayName: "Replace characters",
            selectValue: "replace characters"
        },
        {
            displayName: "Score columns",
            selectValue: "score columns"
        },
        {
            displayName: "Split columns",
            selectValue: "split"
        }
    ];
    let readyToSave = false;
    const showMsg = ref(false);
    let failedSaveMsg = "Field not ready to save";
    const currentFieldConfig = ref({});
    const currentConfigString = computed(() => JSON.stringify(currentFieldConfig.value));
    const selectedColumns = computed(() => store.selectedColumns.map(column => column["raw field"]));
    const unConvertedFields = computed(() => store.getUnConvertedFields);
    const columnNameChange = computed(() => store.latestColumnRename);
    const savedFieldConfigs = ref([]);
    const editingFieldIndex = ref(-1);

    function updateConfig(newConfig, check={ready: false, msg: "Field not ready to save."}){
        currentFieldConfig.value = newConfig;
        readyToSave = check.ready;
        if (readyToSave){
            showMsg.value = false;
        }
        failedSaveMsg = readyToSave ? "" : check.msg;
    }
    function editField(index){
        // You can't change a field type while editing. If you want to do that, you must delete and start over.
        // Should clicking another field while edit is active serve as a cancel? or should we prevent it?
        if (editingFieldIndex.value !== -1){
            failedSaveMsg = "Already editing another field. Save or cancel to continue";
            showMsg.value = true;
            return;
        }
        editingFieldIndex.value = index;
        let savedField = savedFieldConfigs.value[index];
        dataConvertType.value = savedField["type"];
        updateConfig(savedField, {ready: true, msg: ""});
    }
    function saveField(){
        if (!readyToSave){
            showMsg.value = true;
            return;
        }
        let newField = JSON.parse(JSON.stringify(currentFieldConfig.value)); // Deep copy
        if (!newField["field name"]){
            failedSaveMsg = "Enter a field name.";
            showMsg.value = true;
            return;
        }
        let nameCheck = fieldNameCheck(newField);
        if (!nameCheck.ready){
            failedSaveMsg = nameCheck.msg;
            showMsg.value = true;
            return;
        } 
        // If we make it this far, the new field is unique and we can use it.
        showMsg.value = false;
        if(editingFieldIndex.value === -1){
            savedFieldConfigs.value.push(newField);
        } else {
            let oldField = savedFieldConfigs.value[editingFieldIndex.value];
            if (!oldField["create new"] && !!newField["create new"]){
                store.restoreUnConverted(newField["raw field"]);
            }
            let oldName = oldField["field name"];
            let newName = newField["field name"];
            savedFieldConfigs.value[editingFieldIndex.value] = newField;
            // If we are toggling between convert and create, that shouldn't be processed as a name change.
            if(oldName !== newName && 
                newField["type"] !== "split" && 
                !!oldField["create new"] &&
                !!newField["create new"]){
                store.renameField(oldName, newName);
            }
        }
        doneEditing();
    }
    function fieldNameCheck(fieldConfig){
        const {type, 'field name': fieldName, 'raw field': rawField = "", 'create new': createNew} = fieldConfig;
        if (type === 'split'){
            for (const name of fieldName){
                const check = fieldNameOkay(name);
                if (!check.ready){
                    return check;
                }
            }
            return {ready: true, msg: ""};
        }
        return fieldNameOkay(fieldName, rawField, createNew);
        
    }
    function fieldNameOkay(fieldName, rawField="", createNew=true){
        let check = { ready: false, msg: ""};
        if (fieldName.trim() === ''){
            check.msg = 'Field name cannot be empty.';
            return check;
        }
        if (fieldName.includes(",")){
            check.msg = 'Commas are not allowed in field names.';
            return check;
        }
        // Duplicate checking against renamed columns needs to be here
        for (const unConvertedField of unConvertedFields.value){
            let duplicateIsOk = (unConvertedField["raw field"] === rawField && !createNew);
            if (!duplicateIsOk && unConvertedField["field name"] === fieldName){
                check.msg = 'Field name duplicates one of your selected columns.';
                return check;
            }
        }
        // Duplicate checking against converted columns
        let namesToCheck = [];
        for (let i = 0; i < savedFieldConfigs.value.length; i++){
            if (i === editingFieldIndex.value){
                continue;
            }
            let existingField = savedFieldConfigs.value[i];
            let moreNames = existingField.type === 'split' ? existingField["field name"] : [existingField["field name"]];
            namesToCheck = namesToCheck.concat(moreNames);
        }
        if (namesToCheck.includes(fieldName)){
            check.msg = "Select a unique field name.";
            return check;
        }
        check.ready = true;
        return check;
    }
    function doneEditing(){
        editingFieldIndex.value = -1;
        updateConfig({});
        dataConvertType.value = defaultType;
        saveDataConvert();
        showMsg.value = false;
    }
    function deleteField(){
        if (editingFieldIndex.value === -1){
            doneEditing();
            return;
        }
        //If deleting a field already under editing
        let fieldDeleted = savedFieldConfigs.value[editingFieldIndex.value];
        if (!fieldDeleted["create new"]){
            store.restoreUnConverted(fieldDeleted["raw field"]);
        }
        savedFieldConfigs.value.splice(editingFieldIndex.value, 1);
        doneEditing();
    }
    function saveDataConvert(){
        store.setConvertedFields(savedFieldConfigs.value);
    }
    watch(dataConvertType, ()=>{
        showMsg.value = false;
        if (editingFieldIndex.value === -1){
            updateConfig({});
        }
    });
    watch(columnNameChange, ()=> {
        let rawField = columnNameChange.value[0];
        let newName = columnNameChange.value[1];
        for (let i = 0; i < savedFieldConfigs.value.length; i++){
            let fieldConfig = savedFieldConfigs.value[i];
            let oldName = fieldConfig["field name"]
            if (!!fieldConfig["raw field"] && fieldConfig["raw field"] === rawField && !fieldConfig["create new"]){
                    fieldConfig["field name"] = newName;
                    savedFieldConfigs.value[i] = fieldConfig;
                    store.renameField(oldName, newName);
                }
        }
        saveDataConvert();
    });
    watch(selectedColumns, (newColumns, oldColumns) => {
        oldColumns.forEach(oldColumn => {
            if (!newColumns.includes(oldColumn)){
                savedFieldConfigs.value = savedFieldConfigs.value.filter(config => !usesField(config, oldColumn));
            }
        })
        saveDataConvert();
    });
    function usesField(config, column){
        if (!!config["raw field"] && config["raw field"] === column){
            return true;
        }
        if (!!config["fields to join"] && config["fields to join"].includes(column)){
            return true;
        }
        if (!!config["fields to score"] && config["fields to score"].includes(column)){
            return true;
        }
        if (!!config["field to split"] && config["field to split"] === column){
            return true;
        }
        return false;
    }
</script>