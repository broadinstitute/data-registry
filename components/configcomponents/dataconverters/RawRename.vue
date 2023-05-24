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
                    <div
                        class="col-md-6 col"
                    ></div>
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
    let rawRenameConfig = ref({
        "type": "raw",
        "field name": latestFieldName,
        "raw field": selectedField
    });
    watchEffect(()=> {
        if (selectedField.value){
            emit('configChanged', rawRenameConfig.value, readyToSave());
        }
        console.log(readyToSave());
    });
    function readyToSave(){
        return (!!rawRenameConfig.value["field name"] && !!rawRenameConfig.value["raw field"]);
    }
</script>