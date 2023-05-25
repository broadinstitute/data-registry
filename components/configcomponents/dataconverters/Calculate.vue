<template>
    <div class="row" id="calculateConfig">
		<div class="col-md-6 col">
			<div class="label">
				Calculate | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="calculate" :value="rawField" 
					id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-6 col">
			<div class="label">
				Calculate
			</div>
			<select class="form-control" v-model="calcType">
				<option value="-log10">-Log10</option>
			</select>
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
	const calcType = ref("-log10");
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		calcType.value = oldConfig["calculation type"];
    }
    const calcConfig = ref({
        "type": "calculate",
        "field name": latestFieldName,
        "raw field": selectedField,
		"calculation type": calcType
    });
    watch([latestFieldName, selectedField, calcType], ()=>{
        emit('configChanged', calcConfig.value, readyToSave());
    })
    function readyToSave(){
        return (!!calcConfig.value["field name"] 
			&& !!calcConfig.value["raw field"]
            && calcConfig.value["field name"].trim() != ""
			&& !!calcConfig.value["calculation type"]);
    }
</script>