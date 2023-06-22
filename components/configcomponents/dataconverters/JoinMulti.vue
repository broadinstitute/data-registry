<template>
    <div class="row" id="joinMultiConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join multi | Select field(s)
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
						<input class="form-check-input" type="checkbox" :value="rawField" 
							id="flexCheckDefault" v-model="selectedFields"
							@change="(event)=>removeJoinEntry(event)"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>
			</ul>
			<button @click="()=>clearAll()" class="btn btn-primary">Clear selection</button>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Selected fields | Join by
			</div>
			<tbody class="dr-byor-data-columns">
				<tr v-for="field, index in selectedFields" class="arrow-button-list">
					<td>{{ field }}</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUpDown(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedFields.length - 1" @click="moveUpDown(index, true)">
						&darr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<input v-if="index != selectedFields.length - 1" 
							type="text" class="form-control input-default arrow-field"
							:value="!!joinBy[index]? joinBy[index] : ''"
							@change="(event)=>getInput(index, event.target.value)"/>
					</td>
				</tr>
			</tbody>
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
	const joinBy = ref([]);
	const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
	const joinMultiConfig = ref({
        "type": "join multi",
        "field name": latestFieldName,
		"fields to join": selectedFields,
		"join by": joinBy
    });
	let readySaveMsg = "";
	function emitConfig(){
		emit('configChanged', joinMultiConfig.value, readyToSave(), readySaveMsg);
	}
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedFields.value = oldConfig["fields to join"];
		joinBy.value = oldConfig["join by"];
		
    }
	function moveUpDown(index, down=false){
		if (down) { index++; }
		let risingItem = selectedFields.value[index];
		selectedFields.value.splice(index, 1);
		selectedFields.value.splice(index - 1, 0, risingItem);
	}
	function getInput(index, input){
		joinBy.value[index] = input;
		emitConfig();
	}
	function removeJoinEntry(event){
		// Trims the list of joins when an item is deselected.
		let box = event.target.value;
		let boxes = event.target._modelValue;
		if(!boxes.includes(box)){
			joinBy.value.pop();
			emitConfig();
		}
	}
	function clearAll(){
		selectedFields.value = [];
		joinBy.value = [];
		emitConfig();
	}
	
    function readyToSave(){
		let fieldsLength = joinMultiConfig.value["fields to join"].length;
		let joinLength = joinMultiConfig.value["join by"].length;
		if (joinMultiConfig.value["fields to join"].length < 2){
			readySaveMsg = "Select some fields to join.";
			return false;
		}
		if (joinLength != fieldsLength - 1){
			readySaveMsg = "Specify join separators.";
			return false;
		}
		for (let i = 0; i < joinLength; i++){
			let joinEntry = joinMultiConfig.value["join by"][i];
			if (joinEntry.includes(",")){
				readySaveMsg = "Commas may not be used in field joins.";
				return false;
			}
		}
		readySaveMsg = "";
        return true;
    }
	watch([latestFieldName, selectedFields, joinBy], ()=>{
        emitConfig();
    });
</script>