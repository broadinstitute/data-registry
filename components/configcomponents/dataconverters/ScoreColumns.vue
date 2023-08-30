<template>
    <div class="row" id="scoreColumnsConfig">
		<div class="col-md-4 col">
			<div class="label">
				Select fields
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fieldColumnNames" class="form-check form-check-inline">
						<input class="form-check-input" type="checkbox" :value="field['raw field']" 
							id="flexCheckDefault" v-model="selectedFields"
							@change="(event)=>addRemoveEntry(event)"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field["field name"] }}</span>
				</li>
			</ul>
			<button @click="()=>clearAll()" class="btn btn-primary">Clear selection</button>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				New field name
				<input type="text" class="form-control input-default" v-model="latestFieldName">
			</div>
		</div>
		<div class="col-md-4 col">
			<table class="dr-byor-data-columns">
				<tr>
					<th></th>
					<th><div class="label">Score true</div></th>
					<th><div class="label">Score false</div></th>
				</tr>
				<tr v-for="field in selectedFields">
					<td>{{ getColumnName(field) }}</td>
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
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
	const fieldColumnNames = computed(() => store.selectedColumns);
	const emit = defineEmits(['configChanged']);
	const selectedFields = ref([]);
	const scores = ref({});
	const latestFieldName = ref("");
	const scoreColumnsConfig = ref({
        "type": "score columns",
        "field name": latestFieldName,
		"fields to score": selectedFields,
		"score by": scores,
		"create new": true
    });
	if (props.loadConfig !== "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
		latestFieldName.value = oldConfig["field name"];
		let fields = oldConfig["fields to score"];
        selectedFields.value = fields;
		fields.forEach(field => {
			let yesVal = oldConfig['score by'][field]['value to score']['yes'];
			let noVal = oldConfig['score by'][field]['value to score']['no'];
			addNewEntry(field, yesVal, noVal);
		});
		
    }
	function getColumnName(field){
		return field === null ? "" : store.getColumnName(field);
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
		let scoreValue = parseInt(value);
		if (value === "" || value === null || typeof(scoreValue) !== 'number'){
			// Force emit a value of false for ready to save
			emit('configChanged', scoreColumnsConfig.value, {
				ready: false,
				msg: "Scores must be numerical."
			});
		} else {
			scores.value[field]["value to score"][yesOrNo] = scoreValue;
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
		emit('configChanged', scoreColumnsConfig.value, preSaveCheck());
	}
    function preSaveCheck(){
		let check = {
			ready: false,
			msg: ""
		};
		if (scoreColumnsConfig.value["fields to score"].length < 1){
			check.msg = "Select fields to score.";
			return check;
		}
		for (let i = 0; i < scoreColumnsConfig.value["fields to score"].length; i++){
			let field = scoreColumnsConfig.value["fields to score"][i];
			if (!scoreColumnsConfig.value["score by"][field]){
				check.msg = "Specify values for score calculation.";
				return check;
			}
		}
        check.ready = true;
		return check;
    }
</script>