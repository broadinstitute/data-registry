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
                <button class="btn btn-warning btn-sm" type="button" @click="cancelEdit()">
                    Cancel
                </button>
                <button class="btn btn-danger btn-sm" type="button" @click="deleteFeature()">
                    Delete
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 col text-center dr-bubbles-wrapper">
				<div class="dr-format-bubble">
                    <span class="name">Feature 1</span>
                    <span class="edit">Edit</span>
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
        if (currentFeatureName.value.length > 0 && currentSelectedFields.value.length > 0){
            console.log("Is this thing on?");
            allFeaturesConfig.value["features"].push(currentFeatureName.value);
            allFeaturesConfig.value[currentFeatureName.value] = currentSelectedFields.value;
            doneEditing();
            return;
        } else if (currentFeatureName.value == ""){
            saveErrorMsg.value = "Enter feature name."
            return;
        } else if (currentSelectedFields.value.length == 0){
            saveErrorMsg.value = "Select some fields."
            return;
        }
    }
    function doneEditing(){
        saveErrorMsg.value = "";
        currentFeatureName.value = "";
        currentSelectedFields.value = [];
        editingFeatureIndex.value = -1;
    }
</script>