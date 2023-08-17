<template>
    <div class="row" id="array2StringConfig">
		<div class="col-md-6 col">
			<div class="label"> Array to string | Select field</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="array2string" :value="field[0]" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
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
			<CreateConvert :selected-field="selectedField"
				@field-name-set="(createNew, newName) => processFieldInfo(createNew, newName)">
			</CreateConvert>
		</div>
	</div>
</template>
<script setup>
	import CreateConvert from '@/components/configcomponents/CreateConvert.vue';
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
    const emit = defineEmits(['configChanged']);
	const fields = computed(() => store.getSelectedColumns);
    const selectedField = ref(null);
    const latestFieldName = ref("");
	const separator = ref("");
	const createNewField = ref(false);
	
	let readySaveMsg = "";
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		separator.value = oldConfig["separate by"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
    }
	watch(selectedField, () => 
		latestFieldName.value = store.getColumnObject[selectedField.value]
	);
    watch([latestFieldName, selectedField, separator], ()=>{
        emitConfig();
    });
    function readyToSave(config){
		//separator CAN be an empty string so we don't check that
		if (config["separate by"].includes(",")){
			readySaveMsg = "Commas may not be used in separator.";
			return false;
		}
		if (!config["raw field"]){
			readySaveMsg = "Select a raw field.";
            return false;
		}
		readySaveMsg = "";
        return true;
    }
	function emitConfig(){
		let arrayRenameConfig = {
        	"type": "array to string",
        	"field name": latestFieldName.value,
        	"raw field": selectedField.value,
			"separate by": separator.value,
			"create new": createNewField.value
    	};
		emit('configChanged', arrayRenameConfig, readyToSave(arrayRenameConfig), readySaveMsg);
	}
	function processFieldInfo(createNew, newName){
		createNewField.value = createNew;
		latestFieldName.value = newName;
	}
</script>