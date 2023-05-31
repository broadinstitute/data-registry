<template>
    <h5>
        Features
        <sup class="optional">Tutorial</sup>
    </h5>
    <div class="row dr-builder-ui">
        <div class="col-md-3 col">
            <div class="label">
                Feature name
            </div>
            <input type="text" class="form-control input-default" v-model="currentFeatureName"/>
            <div class="label">Output</div>
            <pre class="output">{{ singleFeatureConfigString }}</pre>
            <!--pre class="output">{{ allFeaturesConfigString }}</pre-->
        </div>
        <div class="col-md-3 col">
                <div class="label">
                    Select rows
                </div>
                <ul class="dr-byor-data-columns">
                    <li v-for="field in availableFields" class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" :value="field" 
                                id="flexCheckDefault" v-model="currentSelectedFields"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-5 col">
                <div class="label">
                    Selected rows | Change order
                </div>
                <tbody class="dr-byor-data-columns">
                    <tr v-for="field, index in currentSelectedFields" class="arrow-button-list">
                        {{ field }}
                        <td class="arrow-button-holder">
                            <button class="btn btn-primary arrow-button arrow-button-up" 
                                :disabled="index == 0" @click="moveUp(index)">
                                &uarr;
                            </button>
                        </td>
                        <td class="arrow-button-holder">
                            <button class="btn btn-primary arrow-button"
                            :disabled="index == currentSelectedFields.length - 1" @click="moveDown(index)">
                            &darr;
                            </button>
                        </td>
                    </tr>
                </tbody>
                <div class="failed-save">{{ saveErrorMsg }}</div>
		    </div>
            <div class="col-md-1 col">
                <button class="btn btn-primary btn-sm" type="button" @click="saveFeature()">
                    Save
                </button>
                <button class="btn btn-warning btn-sm" type="button" @click="doneEditing()">
                    Cancel
                </button>
                <button class="btn btn-danger btn-sm" type="button" @click="deleteFeature()">
                    Delete
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 col text-center dr-bubbles-wrapper">
				<div v-for="feature, index in allFeaturesConfig.features" class="dr-format-bubble">
                    <span class="name">{{ feature }}</span>
                    <span class="editing" v-if="editingFeatureIndex == index">Editing</span>
                    <a v-else @click="editFeature(index)"><span class="edit">Edit</span></a>
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
import { all } from "axios";
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const availableFields = computed(()=> props.fields);
    const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1]);
    const currentFeatureName = ref("");
    const currentSelectedFields = ref([]);
    const editingFeatureIndex = ref(-1);
    const saveErrorMsg = ref("");
    const allFeaturesConfig = ref({
        "features": []
    });
    const singleFeatureConfigString = computed(()=> `"${currentFeatureName.value}": ${JSON.stringify(currentSelectedFields.value)}`);
    const allFeaturesConfigString = computed(()=> JSON.stringify(allFeaturesConfig.value));
    function moveUp(index){
		let beginning = currentSelectedFields.value.slice(0, index-1);
		let risingItem = currentSelectedFields.value[index];
		let fallingItem = currentSelectedFields.value[index-1]
		let end = currentSelectedFields.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		currentSelectedFields.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = currentSelectedFields.value.slice(0, index);
		let risingItem = currentSelectedFields.value[index+1];
		let fallingItem = currentSelectedFields.value[index]
		let end = currentSelectedFields.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		currentSelectedFields.value = beginning.concat(end);
	}
    function saveFeature(){
        let trimmedName = currentFeatureName.value.trim();
        if (trimmedName.length > 0 && currentSelectedFields.value.length > 0){
            console.log("Is this thing on?");
            if (editingFeatureIndex.value == -1){
                allFeaturesConfig.value["features"].push(trimmedName);
                allFeaturesConfig.value[trimmedName] = currentSelectedFields.value;
            } else {
                let oldName = allFeaturesConfig.value["features"][editingFeatureIndex.value];
                let fieldsList = allFeaturesConfig.value[oldName];
                allFeaturesConfig.value["features"][editingFeatureIndex.value] = trimmedName;
                allFeaturesConfig.value[trimmedName] = fieldsList;
                delete allFeaturesConfig.value[oldName];
            }
            doneEditing();
            return;
        } else if (trimmedName == ""){
            saveErrorMsg.value = "Enter feature name.";
            return;
        } else if (currentSelectedFields.value.length == 0){
            saveErrorMsg.value = "Select some fields.";
            return;
        } else if (allFeaturesConfig.value["features"].includes(trimmedName)){
            saveErrorMsg.value = "Select a unique feature name.";
        }
    }
    function editFeature(index){
        if (editingFeatureIndex.value != -1){
            saveErrorMsg.value = "Already editing another feature. Save or cancel to continue";
            return;
        }
        editingFeatureIndex.value = index;
        currentFeatureName.value = allFeaturesConfig.value["features"][index];
        currentSelectedFields.value = allFeaturesConfig.value[currentFeatureName.value];
        saveErrorMsg.value = "";
    }
    function deleteFeature(){
        if (editingFeatureIndex.value != -1) {
            let featureToDelete = allFeaturesConfig.value["features"][editingFeatureIndex.value];
            allFeaturesConfig.value["features"] = 
                allFeaturesConfig.value["features"].filter(feature => feature != featureToDelete);
            delete allFeaturesConfig.value[featureToDelete];
            editingFeatureIndex.value = null;
        }
        doneEditing();
    }
    function doneEditing(){
        saveErrorMsg.value = "";
        currentFeatureName.value = "";
        currentSelectedFields.value = [];
        editingFeatureIndex.value = -1;
    }
</script>