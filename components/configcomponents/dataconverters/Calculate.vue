<template>
    <div class="row" id="calculateConfig">
		<CreateNewField :selectedField="selectedField"
			:fieldIsLoaded="fieldIsLoaded"
			:loadedFieldCreateNew="defaultCreateNew"
			:loadedFieldName="latestFieldName"
			@fieldNameSet="fieldInfo => processFieldInfo(fieldInfo)">
		</CreateNewField>
		<div class="col-md-4 col">
			<div class="label">
				Calculate
			</div>
			<select class="form-control" v-model="calcType">
				<option value="-log10">-Log10</option>
			</select>
		</div>
	</div>
</template>
<script setup>
	import CreateNewField from '@/components/configcomponents/CreateNewField.vue';
	const props = defineProps({newFieldName: String, loadConfig: String});
    const emit = defineEmits(['configChanged']);
    const selectedField = ref(null);
	const fieldIsLoaded = ref(false);
	const calcType = ref("-log10");
    const latestFieldName = ref("");
	const createNewField = ref(false);
	const defaultCreateNew = ref(false);
	
    if (props.loadConfig !== "{}"){
		fieldIsLoaded.value = true;
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		calcType.value = oldConfig["calculation type"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
		defaultCreateNew.value = oldConfig["create new"];
    }
    watch([latestFieldName, selectedField, calcType], ()=>{
        emitConfig();
    })
    function preSaveCheck(){
		let check = {
			ready: false,
			msg: ""
		};
		if (selectedField.value === null){
			check.msg = "Select a field.";
			return check;
		}
		check.ready = true;
		return check;
    }
	function emitConfig(){
		let calcConfig = {
			"type": "calculate",
			"field name": latestFieldName.value,
			"raw field": selectedField.value,
			"calculation type": calcType.value,
			"create new": createNewField.value
    	};
		emit('configChanged', calcConfig, preSaveCheck());
	}
	function processFieldInfo(fieldInfo){
		createNewField.value = fieldInfo["create new"];
		latestFieldName.value = fieldInfo["field name"];
		selectedField.value = fieldInfo["raw field"];
	}
</script>