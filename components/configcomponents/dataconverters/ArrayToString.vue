<template>
    <div class="row" id="array2StringConfig">
		<div class="col-md-6 col">
			<div class="label"> Array to string | Select field</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="array2string" :value="field" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ fieldColumnNames[field] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-6 col">
			<div class="label">
				Separate items by
			</div>
			<input type="text" class="form-control input-default" v-model="separator"/>
		</div>
		<div v-if="selectedField != null">
			<CreateNewField :selected-field="selectedField"
				:loaded-field-create-new="createNewField"
				:loaded-field-name="latestFieldName"
				@field-name-set="(createNew, newName) => processFieldInfo(createNew, newName)">
			</CreateNewField>
		</div>
	</div>
</template>
<script setup>
	import CreateNewField from '@/components/configcomponents/CreateNewField.vue';
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
    const emit = defineEmits(['configChanged']);
	const fieldColumnNames = computed(() => store.getSelectedColumns);
	const fields = computed(() => Object.keys(fieldColumnNames.value));
    const selectedField = ref(null);
    const latestFieldName = ref("");
	const separator = ref("");
	const createNewField = ref(false);
	
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		separator.value = oldConfig["separate by"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
    }
	watch(selectedField, () => 
		latestFieldName.value = fieldColumnNames.value[selectedField.value]
	);
    watch([latestFieldName, selectedField, separator], ()=>{
        emitConfig();
    });
    function preSaveCheck(){
		if (selectedField.value == null){
			return [false, "Select a field."];
		}
		//separator CAN be an empty string so we don't check that
		if (separator.value.includes(",")){
			return [false, "Commas may not be used in separator."];
		}
        return [true, ""];
    }
	function emitConfig(){
		let check = preSaveCheck();
		let ready = check[0];
		let msg = check[1];
		let arrayRenameConfig = {
        	"type": "array to string",
        	"field name": latestFieldName.value,
        	"raw field": selectedField.value,
			"separate by": separator.value,
			"create new": createNewField.value
    	};
		emit('configChanged', arrayRenameConfig, ready, msg);
	}
	function processFieldInfo(createNew, newName){
		createNewField.value = createNew;
		latestFieldName.value = newName;
	}
</script>