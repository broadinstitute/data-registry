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
	</div>
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({newFieldName: String, loadConfig: String});
    const emit = defineEmits(['configChanged']);
	const fields = computed(() => store.getSelectedColumns);
    const selectedField = ref(null);
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
	const separator = ref("");
	const arrayRenameConfig = ref({
        "type": "array to string",
        "field name": latestFieldName,
        "raw field": selectedField,
		"separate by": separator
    });
	let readySaveMsg = "";
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		separator.value = oldConfig["separate by"];
		
    }
    watch([latestFieldName, selectedField, separator], ()=>{
        emitConfig();
    });
    function readyToSave(){
		//separator CAN be an empty string so we don't check that
		if (arrayRenameConfig.value["separate by"].includes(",")){
			readySaveMsg = "Commas may not be used in separator.";
			return false;
		}
		if (!arrayRenameConfig.value["raw field"]){
			readySaveMsg = "Select a raw field.";
            return false;
		}
		readySaveMsg = "";
        return true;
    }
	function emitConfig(){
		emit('configChanged', arrayRenameConfig.value, readyToSave(), readySaveMsg);
	}
</script>