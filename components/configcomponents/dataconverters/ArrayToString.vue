<template>
    <div class="row" id="array2StringConfig">
		<div class="col-md-6 col">
			<div class="label"> Array to string | Select field</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="array2string" :value="rawField" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
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
<style scoped>
    @import "public/css/mdkp.css";
    @import "public/css/configbuilder.css";
</style>
<script setup>
	const props = defineProps({rawFields: Array, newFieldName: String, loadConfig: String});
    const emit = defineEmits(['configChanged']);
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
		if (!arrayRenameConfig.value["field name"] || arrayRenameConfig.value["field name"].trim() == ""){
			readySaveMsg = "Enter a field name.";
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