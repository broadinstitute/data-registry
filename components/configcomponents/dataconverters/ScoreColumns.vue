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
							@change="(event)=>addNewEntry(event)"/>
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
						@change="(event)=>updateScore(field, 'yes', event.target.value)">
					</td>
					<td>
						<input type="number" class="form-control input-default"
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
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedFields.value = oldConfig["fields to score"];
		
    }
	const scoreColumnsConfig = ref({
        "type": "join multi",
        "field name": latestFieldName,
		"fields to score": selectedFields,
		"score by": scores
    });
	
	function addNewEntry(event){
		// Adds to the score object when a new item is selected
		let stockEntry = { 
			"type": "boolean", 
			"value to score": { 
				"yes": 1, 
				"no": 0
			}
		};
		let box = event.target.value;
		let boxes = event.target._modelValue;
		if(boxes.includes(box)){
			console.log(`should be adding ${box}`);
			scores.value[box] = stockEntry;
			console.log(JSON.stringify(scores.value));
			emitConfig();
		}
	}
	
	function updateScore(field, yesOrNo, value){
		scores.value[field]["value to score"][yesOrNo] = value;
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
		emit('configChanged', scoreColumnsConfig.value, readyToSave());
	}
    function readyToSave(){
        return (!!scoreColumnsConfig.value["field name"] 
			&& scoreColumnsConfig.value["fields to score"].length >= 1
            && scoreColumnsConfig.value["field name"].trim() != "");
    }

</script>