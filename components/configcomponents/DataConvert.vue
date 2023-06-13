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
                <div class="label dr-form">
                    New field name
                        <sup>required</sup>
                </div>
                <input type="text" class="form-control input-default" v-model="newFieldName"/>
                <!-- <div class="label">Output</div>
                <pre class="output">{{ currentConfigString }}</pre> -->
            </div>
            <div class="col-md-8 col">
                <RawRename 
                    v-if="dataConvertType=='raw'" :raw-fields="rawFields" :new-field-name="newFieldName"
                    :load-config="currentConfigString" 
                    @config-changed="(newConfig, ready, msg) => updateConfig(newConfig, ready, msg)">
                </RawRename>
				<Calculate 
                    v-else-if="dataConvertType=='calculate'" :raw-fields="rawFields" 
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready, msg) => updateConfig(newConfig, ready, msg)">
                </Calculate>
                <Join 
                    v-else-if="dataConvertType=='join'" :raw-fields="rawFields"
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready, msg) => updateConfig(newConfig, ready, msg)">
                </Join>
				<JoinMulti 
                    v-else-if="dataConvertType=='join multi'" :raw-fields="rawFields"
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready, msg) => updateConfig(newConfig, ready, msg)">
                </JoinMulti>
				<ArrayToString 
                    v-else-if="dataConvertType=='array to string'" :raw-fields="rawFields"
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready, msg) => updateConfig(newConfig, ready, msg)">
                </ArrayToString>
				<ReplaceCharacters 
                    v-else-if="dataConvertType=='replace characters'" :raw-fields="rawFields"
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready) => updateConfig(newConfig, ready)">
                </ReplaceCharacters>
				<ScoreColumns 
                    v-else-if="dataConvertType=='score columns'" :raw-fields="rawFields"
                    :new-field-name="newFieldName" :load-config="currentConfigString"
                    @config-changed="(newConfig, ready) => updateConfig(newConfig, ready)">
                </ScoreColumns>

                <div class="failed-save" v-if="showMsg">{{ failedSaveMsg }}</div>
			</div>
			<div class="col-md-1 col">
				<button class="btn btn-primary btn-sm" type="button" @click="saveField">
                    Save
                </button>
                <button class="btn btn-warning btn-sm" type="button" @click="cancelFieldEdit">
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
                <span class="editing" v-if="editingFieldIndex == index">Editing</span>
                <a v-else @click="editField(index)"><span class="edit">Edit</span></a>
		    </div>
        </div>
    </div>
</template>
<style scoped>
@import "public/css/mdkp.css";
@import "public/css/configbuilder.css";
</style>
<script setup>
    import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
    import ArrayToString from "@/components/configcomponents/dataconverters/ArrayToString.vue";
    import Calculate from "@/components/configcomponents/dataconverters/Calculate.vue";
    import Join from "@/components/configcomponents/dataconverters/Join.vue";
    import JoinMulti from "@/components/configcomponents/dataconverters/JoinMulti.vue";
    import RawRename from "@/components/configcomponents/dataconverters/RawRename.vue";
    import ReplaceCharacters from "@/components/configcomponents/dataconverters/ReplaceCharacters.vue";
    import ScoreColumns from "@/components/configcomponents/dataconverters/ScoreColumns.vue";


    const props = defineProps({rawFields: Array});
    const emit = defineEmits(["dcChanged", "fieldNameChanged"]);
    const rawFields = computed(()=> props.rawFields);
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
            displayName: "Raw (rename)",
            selectValue: "raw"
        },
        {
            displayName: "Replace characters",
            selectValue: "replace characters"
        },
        {
            displayName: "Score columns",
            selectValue: "score columns"
        }
    ];

    const fieldNamePlaceholder = ""; 
    const newFieldName = ref(fieldNamePlaceholder);
    let readyToSave = false;
    const showMsg = ref(false);
    let failedSaveMsg = "Field not ready to save";
    const currentFieldConfig = ref({});
    const currentConfigString = computed(() => JSON.stringify(currentFieldConfig.value));
    const savedFieldConfigs = ref([]);
    const editingFieldIndex = ref(-1);

    function updateConfig(newConfig, ready=false, msg="Field not ready to save."){
        currentFieldConfig.value = newConfig;
        readyToSave = ready;
        if (ready){
            showMsg.value = false;
        }
        failedSaveMsg = ready ? "" : msg;
    }
    function editField(index){
        // You can't change a field type while editing. If you want to do that, you must delete and start over.
        // Should clicking another field while edit is active serve as a cancel? or should we prevent it?
        if (editingFieldIndex.value != -1){
            failedSaveMsg = "Already editing another field. Save or cancel to continue";
            showMsg.value = true;
            return;
        }
        editingFieldIndex.value = index;
        let savedField = savedFieldConfigs.value[index];
        newFieldName.value = savedField["field name"];
        dataConvertType.value = savedField["type"];
        updateConfig(savedField, true);
    }
    function saveField(){
        let newFieldString = JSON.stringify(currentFieldConfig.value);
        let newField = JSON.parse(newFieldString);
        let newName = newField["field name"];
        if (!readyToSave){
            showMsg.value = true;
            return;
        }
        // Check for duplicates
        for (let i = 0; i < savedFieldConfigs.value.length; i++){
            let existingFieldName = savedFieldConfigs.value[i]["field name"];
            if (i != editingFieldIndex.value && existingFieldName == newName){
                failedSaveMsg = "Select a unique field name.";
                showMsg.value = true;
                return;
            }
        }
        // If we make it this far, the new field is unique and we can use it.
        showMsg.value = false;
        if(editingFieldIndex.value == -1){
            savedFieldConfigs.value.push(newField);
        } else {
            // why does the bubble show the new name before it is saved?
            let oldName = savedFieldConfigs.value[editingFieldIndex.value]["field name"];            
            savedFieldConfigs.value[editingFieldIndex.value] = newField;
            if(oldName != newName){
                emit("fieldNameChanged", oldName, newName);
            }
        }
        doneEditing();
    }
    function doneEditing(){
        editingFieldIndex.value = -1;
        updateConfig({});
        newFieldName.value = fieldNamePlaceholder;
        dataConvertType.value = defaultType;
        emitDataConvert();
        showMsg.value = false;
    }
    function cancelFieldEdit(){
        doneEditing();
    }
    function deleteField(){
        if (editingFieldIndex.value == -1){
            doneEditing();
            return;
        }
        //If deleting a field already under editing
        let beginning = savedFieldConfigs.value.slice(0, editingFieldIndex.value);
        let end = savedFieldConfigs.value.slice(editingFieldIndex.value+1);
        savedFieldConfigs.value = beginning.concat(end);
        doneEditing();
    }
    function emitDataConvert(){
        let savedFields = [];
        savedFieldConfigs.value.forEach(
            field => savedFields.push(field["field name"])
        );
        emit("dcChanged", savedFieldConfigs.value, savedFields);
    }
    watch(dataConvertType, ()=>{
        showMsg.value = false;
        if (editingFieldIndex.value == -1){
            updateConfig({});
        }
    });
    watch(rawFields, (newFields, oldFields) => {
        let newFieldsSorted = JSON.parse(JSON.stringify(newFields));
        newFieldsSorted.sort();
        let oldFieldsSorted = JSON.parse(JSON.stringify(oldFields));
        oldFieldsSorted.sort();
        if (JSON.stringify(newFieldsSorted) != JSON.stringify(oldFieldsSorted)){
            clearDataConvert();
        }
    });
    function clearDataConvert(){
        dataConvertType.value = defaultType;
        newFieldName.value = fieldNamePlaceholder;
        readyToSave = false;
        showMsg.value = false;
        currentFieldConfig.value = {};
        savedFieldConfigs.value = [];
        editingFieldIndex.value = -1;
        emitDataConvert();

    }
</script>