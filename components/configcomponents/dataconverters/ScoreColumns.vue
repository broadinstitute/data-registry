<template>
    <div class="row" id="scoreColumnsConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join multi | Select field(s) (Boolean)
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
						<input class="form-check-input" type="checkbox" :value="rawField" 
							id="flexCheckDefault" v-model="selectedFields"
							@change="(event)=>addRemoveEntry(event)"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>
			</ul>
			<button @click="()=>clearAll()" class="btn btn-primary">Clear selection</button>
		</div>
		<div class="col-md-6 col">
			<table class="dr-byor-data-columns">
				<tr>
					<th>Selected fields</th>
					<th>Score true</th>
					<th>Score false</th>
				</tr>
				<tr v-for="field in selectedFields">
					<td>{{ field }}</td>
					<td>
						<input type="number" class="form-control input-default" 
							:value="!!scores[field] ? scores[field]['value to score']['yes'] : 1"
							@change="(event)=>updateScore(field, 'yes', event.target.value)">
					</td>
					<td>
						<input type="number" class="form-control input-default"
						:value="!!scores[field] ? scores[field]['value to score']['no'] : 0"
							@change="(event)=>updateScore(field, 'no', event.target.value)">
						
					</td>
				</tr>
			</table>
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
	const selectedFields = ref([]);
	const scores = ref({});
	const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
	const scoreColumnsConfig = ref({
        "type": "score columns",
        "field name": latestFieldName,
		"fields to score": selectedFields,
		"score by": scores
    });
	let readySaveMsg = "";
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
		let fields = oldConfig["fields to score"];
        selectedFields.value = fields;
		fields.forEach(field => {
			let yesVal = oldConfig['score by'][field]['value to score']['yes'];
			let noVal = oldConfig['score by'][field]['value to score']['no'];
			addNewEntry(field, yesVal, noVal);
		});
		
    }
	function addRemoveEntry(event){
		let box = event.target.value;
		let boxes = event.target._modelValue;
		if(boxes.includes(box)){
			addNewEntry(box);
		} else {
			removeEntry(box);
		}
		emitConfig();
	}
	function removeEntry(field){
		delete scores.value[field];
	}
	function addNewEntry(field, yesVal=1, noVal=0){
		// Adds to the score object when a new item is selected
		let newEntry = { 
			"type": "boolean", 
			"value to score": { 
				"yes": yesVal, 
				"no": noVal
			}
		};
		scores.value[field] = newEntry;
	}
	function updateScore(field, yesOrNo, value){
		if (value == "" || value == null){
			// Force emit a value of false for ready to save
			emit('configChanged', scoreColumnsConfig.value, false, "Specify values for score calculation.");
		} else {
			scores.value[field]["value to score"][yesOrNo] = parseInt(value);
			emitConfig();
		}
		
	}
	function clearAll(){
		selectedFields.value = [];
		scores.value= {};
		emitConfig();
	}
	watch([latestFieldName, selectedFields, scores], ()=>{
        emitConfig();
    })
	function emitConfig(){
		emit('configChanged', scoreColumnsConfig.value, readyToSave(), readySaveMsg);
	}
    function readyToSave(){
		if (!scoreColumnsConfig.value["field name"] || scoreColumnsConfig.value["field name"].trim() == ""){
			readySaveMsg = "Enter a field name.";
            return false;
		}
		if (scoreColumnsConfig.value["field name"].includes(",")){
			readySaveMsg = "Commas may not be used in field names.";
			return false;
		}
		if (scoreColumnsConfig.value["fields to score"].length < 1){
			readySaveMsg = "Select fields to score.";
			return false;
		}
		scoreColumnsConfig.value["fields to score"].forEach(field => {
			if (!scoreColumnsConfig.value["score by"][field]){
				readySaveMsg = "Specify values for score calculation.";
				return false;
			}
		});
		readySaveMsg = "";
        return true;
    }
</script>