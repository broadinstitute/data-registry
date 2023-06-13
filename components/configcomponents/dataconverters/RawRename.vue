<template>
    <div class="row" id="rawConfig">
        <div class="col-md-6 col">
            <div class="label"> 
                Raw (rename) | Select field
            </div>
            <ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="raw" :value="rawField" 
                        id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
        </div>
        <div class="col-md-6 col">
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
    const rawRenameConfig = ref({
        "type": "raw",
        "field name": latestFieldName,
        "raw field": selectedField
    });
    let readySaveMsg = "";
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
        
    }
    watch([latestFieldName, selectedField], ()=>{
        emitConfig();
    })
    function readyToSave(){
        if (!rawRenameConfig.value["field name"] || 
                rawRenameConfig.value["field name"].trim() == ""){
            readySaveMsg = "Enter a field name.";
            return false;
        }
        if (rawRenameConfig.value["field name"].includes(",")){
			readySaveMsg = "Commas may not be used in field names.";
			return false;
		}
        if (!rawRenameConfig.value["raw field"]){
            readySaveMsg = "Select a raw field.";
            return false;
        }
        readySaveMsg = "";
        return true;
    }
    function emitConfig(){
        emit('configChanged', rawRenameConfig.value, readyToSave(), readySaveMsg);
    }
</script>