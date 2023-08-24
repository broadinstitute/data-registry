<template>
    <div class="row" id="scoreColumnsConfig">
		<div class="col-md-4 col">
			<div class="label">
				Score columns | Select field(s) (Boolean)
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fieldColumnNames" class="form-check form-check-inline">
						<input class="form-check-input" type="checkbox" :value="field[0]" 
							id="flexCheckDefault" v-model="selectedFields"
							@change="(event)=>addRemoveEntry(event)"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
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
		<div class="label">
			New field name
			<label>
				<input type="text" class="form-control input-default" v-model="latestFieldName">
			</label>
		</div>
	</div>
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
	const fieldColumnNames = computed(() => store.getSelectedColumns);
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
	function getColumnName(field){
		return store.getColumnName(field);
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
		emit('configChanged', scoreColumnsConfig.value, preSaveCheck());
	}
    function preSaveCheck(){
		if (scoreColumnsConfig.value["fields to score"].length < 1){
			return [false, "Select fields to score."];
		}
		scoreColumnsConfig.value["fields to score"].forEach(field => {
			if (!scoreColumnsConfig.value["score by"][field]){
				return [false, "Specify values for score calculation."];
			}
		});
        return [true, ""]
    }
</script>