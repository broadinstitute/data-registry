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
					{{ field }}
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUp(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedFields.length - 1" @click="moveDown(index)">
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
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedFields.value = oldConfig["fields to join"];
		joinBy.value = oldConfig["join by"];
    }
	const joinMultiConfig = ref({
        "type": "join multi",
        "field name": latestFieldName,
		"fields to join": selectedFields,
		"join by": joinBy
    });
	function moveUp(index){
		let beginning = selectedFields.value.slice(0, index-1);
		let risingItem = selectedFields.value[index];
		let fallingItem = selectedFields.value[index-1]
		let end = selectedFields.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedFields.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = selectedFields.value.slice(0, index);
		let risingItem = selectedFields.value[index+1];
		let fallingItem = selectedFields.value[index]
		let end = selectedFields.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedFields.value = beginning.concat(end);
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
	watch([latestFieldName, selectedFields, joinBy], ()=>{
        emitConfig();
    })
	function emitConfig(){
		emit('configChanged', joinMultiConfig.value, readyToSave());
	}
    function readyToSave(){
		let fieldsLength = joinMultiConfig.value["fields to join"].length;
		let joinLength = joinMultiConfig.value["join by"].length;
        return (!!joinMultiConfig.value["field name"] 
			&& joinMultiConfig.value["fields to join"].length >= 2
			&& joinLength == fieldsLength - 1
            && joinMultiConfig.value["field name"].trim() != "");
    }

</script>