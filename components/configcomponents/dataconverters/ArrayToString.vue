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
	const props = defineProps({rawFields: Array, newFieldName: String});
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
    watchEffect(()=> {
        if (selectedField.value){
            emit('configChanged', arrayRenameConfig.value, readyToSave());
        }
        console.log(readyToSave());
    });
    function readyToSave(){
		//separator CAN be an empty string so we don't check that
        return (!!arrayRenameConfig.value["field name"] && !!arrayRenameConfig.value["raw field"]
		&& arrayRenameConfig.value["field name"].trim() != "");
    }
</script>