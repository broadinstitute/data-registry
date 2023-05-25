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
	const fieldsToJoin = computed(()=>[firstField.value, secondField.value]);
	const joinBy = ref("");
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        firstField.value = oldConfig["fields to join"][0];
		secondField.value = oldConfig["fields to join"][1];
		joinBy.value = oldConfig["join by"]
    }
    const joinConfig = ref({
        "type": "join",
        "field name": latestFieldName,
		"fields to join": fieldsToJoin,
		"join by": joinBy
    });
    watch([latestFieldName, fieldsToJoin, joinBy], ()=>{
        emit('configChanged', joinConfig.value, readyToSave());
    })
    function readyToSave(){
        return (!!joinConfig.value["field name"] 
			&& !!joinConfig.value["fields to join"][0]
			&& !!joinConfig.value["fields to join"][1]
            && joinConfig.value["field name"].trim() != "");
    }
</script>