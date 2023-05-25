<template>
    <div class="row" id="joinConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join | Select field 1
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="first" :value="rawField" 
                        id="flexCheckDefault" v-model="firstField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Select field 2
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="second" :value="rawField" 
                        id="flexCheckDefault" v-model="secondField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Join by
			</div>
			<input type="text" class="form-control input-default" v-model="joinBy"/>
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
    const firstField = ref(null);
	const secondField = ref(null);
	const joinBy = ref("");
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        firstField.value = oldConfig["first field"];
		secondField.value = oldConfig["second field"];
		joinBy.value = oldConfig["join by"]
    }
    const joinConfig = ref({
        "type": "join",
        "field name": latestFieldName,
		"first field": firstField,
		"second field": secondField,
		"join by": joinBy
    });
    watch([latestFieldName, firstField, secondField, joinBy], ()=>{
        emit('configChanged', joinConfig.value, readyToSave());
    })
    function readyToSave(){
        return (!!joinConfig.value["field name"] 
			&& !!joinConfig.value["first field"]
			&& !!joinConfig.value["second field"]
            && joinConfig.value["field name"].trim() != "");
    }
</script>