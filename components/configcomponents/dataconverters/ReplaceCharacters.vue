<template>
    <div class="row" id="replaceCharactersConfig">
		<div class="col-md-6 col">
			<div class="label">
				Replace characters | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="replace" :value="rawField" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-2 col">
			<div class="label">
				Replace
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="entry, index in replaceChars">
						<input type="text" class="form-control input-default"
							:value="entry['from']"
							@change="(event)=>updateFrom(index, event.target.value)"/>
				</li>
			</ul>
		</div>
		<div class="col-md-2 col">
			<div class="label">
				With
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="entry, index in replaceChars">
						<input type="text" class="form-control input-default"
							:value="entry['to']"
							@change="(event)=>updateTo(index, event.target.value)"/>
				</li>
			</ul>
			<button class="btn btn-primary" @click="addEntry()">Add</button>
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
	const numReplaces = ref(1);
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
	const replaceChars = ref([
		{
			"from": "",
			"to": ""
		}
	]);
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
    }
    const replaceCharConfig = ref({
        "type": "replace characters",
        "field name": latestFieldName,
        "raw field": selectedField,
		"replace": replaceChars
    });
	function addEntry(){
		replaceChars.value.push({
			"from": "",
			"to": ""
		});
	}
	function updateFrom(index, value){
		replaceChars.value[index]["from"] = value;
	}
	function updateTo(index, value){
		replaceChars.value[index]["to"] = value;
	}
    watch([latestFieldName, selectedField, replaceChars], ()=>{
        emit('configChanged', replaceCharConfig.value, readyToSave());
    })
    function readyToSave(){
        return (!!replaceCharConfig.value["field name"] && !!replaceCharConfig.value["raw field"]
            && replaceCharConfig.value["field name"].trim() != "");
    }
</script>