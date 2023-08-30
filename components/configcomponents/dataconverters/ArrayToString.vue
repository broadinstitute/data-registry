<template>
    <div class="row" id="array2StringConfig">
		<CreateNewField :selectedField="selectedField"
			:fieldIsLoaded="fieldIsLoaded"
			:loadedFieldCreateNew="defaultCreateNew"
			:loadedFieldName="latestFieldName"
			@fieldNameSet="(fieldInfo) => processFieldInfo(fieldInfo)">
		</CreateNewField>
		<div class="col-md-4 col">
			<div class="label">
				Separate items by
			</div>
			<input type="text" class="form-control input-default" v-model="separator"/>
		</div>
	</div>
</template>
<script setup>
	import CreateNewField from '@/components/configcomponents/CreateNewField.vue';
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
    const emit = defineEmits(['configChanged']);
    const selectedField = ref(null);
	const fieldIsLoaded = ref(false);
    const latestFieldName = ref("");
	const separator = ref("");
	const defaultCreateNew = ref(false);
	const createNewField = ref(false);
	
	if (props.loadConfig !== "{}"){
		fieldIsLoaded.value = true;
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		console.log(`Selected field should now be ${selectedField.value}`);
		separator.value = oldConfig["separate by"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
		defaultCreateNew.value = oldConfig["create new"];
    }
    function preSaveCheck(){
		let check = {
			ready: false,
			msg: ""
		};
		if (selectedField.value === null){
			check.msg = "Select a field.";
			return check;
		}
		//separator CAN be an empty string so we don't check that
		if (separator.value.includes(",")){
			check.msg = "Commas may not be used in separator.";
			return check;
		}
		check.ready = true;
		return check;
    }
	function emitConfig(){
		let arrayRenameConfig = {
        	"type": "array to string",
        	"field name": latestFieldName.value,
        	"raw field": selectedField.value,
			"separate by": separator.value,
			"create new": createNewField.value
    	};
		emit('configChanged', arrayRenameConfig, preSaveCheck());
	}
	function processFieldInfo(fieldInfo){
		createNewField.value = fieldInfo["create new"];
		latestFieldName.value = fieldInfo["field name"];
		selectedField.value = fieldInfo["raw field"];
	}
    watch([latestFieldName, selectedField, separator], ()=> emitConfig());
</script>