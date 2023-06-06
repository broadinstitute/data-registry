<template>
	<h5>
		Column formatting
		<sup class="optional">Tutorial</sup>
	</h5>
	<div class="row dr-builder-ui">
		<div class="col-md-3 col">
            <div class="label">Output</div>
            <pre class="output">{{ singleColumnConfigString }}</pre>
            <pre class="output">{{ allColumnsConfigString }}</pre>
        </div>
		<div class="col-md-2 col">
                <div class="label">
                    Select column
                </div>
                <ul class="dr-byor-data-columns">
                    <li v-for="field in availableFields" class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="column" :value="field" 
                                id="flexCheckDefault" :disabled="savedColumns.includes(selectedColumn)" 
								v-model="selectedColumn"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                    </li>
                </ul>
            </div>
		<div class="col-md-2 col">
			<div class="label">
				Select formatting options
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="formatOption in Object.keys(formatOptions)" class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" :value="formatOption" 
                                id="flexCheckDefault" v-model="selectedOptions"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ formatOptions[formatOption] }}</span>
                    </li>
			</ul>
		</div>
		<div class="col-md-2 col">
			<div class="label">
				Selected options | Change formatting order
			</div>
			<tbody class="dr-byor-data-columns">
				<tr v-for="option, index in selectedOptions" class="arrow-button-list">
					{{ formatOptions[option] }}
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUp(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedOptions.length - 1" @click="moveDown(index)">
						&darr;
						</button>
					</td>
				</tr>
			</tbody>
		</div>
		<div class="col-md-2 col">	
			<div v-if="selectedOptions.includes('link')" id="linkFormat">
				<div class="label">
					Link
				</div>
				<div class="form-inline">
					<span>Link to:</span>
					<input type="text" class="form-control form-control-sm input-default" 
						style="width: 80%; margin-left: 5px;" v-model="linkTo"/>
				</div>
				<div class="form-inline">
					<div class="form-check" style="margin-right: 10px;">
						<label class="form-check-label">
							<input class="form-check-input" type="checkbox" v-model="newTab"/>
							New tab
						</label>
					</div>
					<div class="form-check">
						<label class="form-check-label">
							<input class="form-check-input" type="checkbox" v-model="asButton"/>
							As button
						</label>
					</div>
				</div>
				<div class="form-inline" v-if="asButton">
					<span>Button label:</span>
					<input type="text" class="form-control form-control-sm input-default"
						style="width: 80%; margin-left: 5px;" v-model="buttonLabel"/>
				</div>
			</div>
			<div v-if="selectedOptions.includes('render background percent') || 
					selectedOptions.includes('render background percent negative')">
				<div class="label">
					Render background %
				</div>
				<div class="form-inline">
					<span>Percent if no value:</span>
					<input type="number" class="form-control form-control-sm input-default"
						style="width: 50%; margin-left: 5px;" v-model="percentNoValue"/>
				</div>
			</div>
			<div v-if="selectedOptions.includes('fixed')">
				<div class="label">
				Fixed after decimal point
				</div>
				<div class="form-inline">
					<span>Place </span>
					<select class="form-control form-control-sm" v-model="fixedPlaces"
							style=" width: 50%; margin-left: 5px;">
						<option v-for="i in 9">{{ i + 1 }}</option>
					</select>
				</div>
			</div>
			<div v-if="selectedOptions.includes('js math')">
				<div class="label">
				JavaScript math
				</div>
				<div class="form-inline">
					<span>Method </span>
					<input type="text" class="form-control form-control-sm input-default"
						v-model="mathMethod" style="width: 50%; margin-left: 5px;"/>
				</div>
			</div>
		</div>
		<div class="col-md-1 col">
			<button class="btn btn-primary btn-sm" type="button" @click="saveColumn()">
				Save
			</button>
			<button class="btn btn-warning btn-sm" type="button" @click="clearAll()">
				Cancel
			</button>
			<button class="btn btn-danger btn-sm" type="button" @click="deleteColumn()">
				Delete
			</button>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12 col text-center dr-bubbles-wrapper">
			<div v-for="column in savedColumns" class="dr-format-bubble">
                    <span class="name">{{ column }}</span> |
					<span class="type">{{ allColumnsConfig[column]['type'][0] }}</span>
                    <span class="editing" v-if="selectedColumn == column">Editing</span>
                    <a v-else-if="selectedColumn == null" @click="editColumn(column)"><span class="edit">Edit</span></a>
                    <a v-else @click="warnEditingAlready()"><span class="edit">Edit</span></a>
                </div>
		</div>
	</div>
</template>
<style scoped>
    @import "public/css/mdkp.css";
    @import "public/css/configbuilder.css";
</style>
<script setup>
    import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
import { all } from "axios";
	const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const availableFields = computed(()=> props.fields);
    const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1]);
	const formatOptions = {
		"link": "Link",
		"js math": "JavaScript math",
		"scientific notation": "Scientific notation",
		"fixed": "Fixed decimal",
		"direction triangle": "Direction triangle",
		"render background percent": "Render background %",
		"render background percent negative": "Render background % (negative)"
	}
	const selectedColumn = ref(null);
	const selectedOptions = ref([]);
	const fixedPlaces = ref(2);
	const mathMethod = ref("");
	const linkTo = ref("");
	const newTab = ref(true);
	const asButton = ref(false);
	const buttonLabel = ref("");
	const percentNoValue = ref(0);
	const selectedOptionsMod = computed(()=> selectedOptions.value.map(
			item => item == "fixed" ? `fixed ${fixedPlaces.value}` : item
		));
	const singleColumnConfig = ref({
		"type": []
	});
	const singleColumnConfigString = computed(() => 
		`"${selectedColumn.value}": ${JSON.stringify(singleColumnConfig.value)}`);
	const allColumnsConfig = ref({});
	const allColumnsConfigString = computed(() => JSON.stringify(allColumnsConfig.value));
	const savedColumns = computed(() => Object.keys(allColumnsConfig.value));
	// make sure clicking a bubble is the same as clicking edit
	watch([selectedOptions, 
			fixedPlaces, 
			mathMethod, 
			linkTo, 
			newTab, 
			asButton, 
			buttonLabel, 
			percentNoValue], ()=>{
		updateFormat();
	});
	watch(selectedColumn, ()=> {
		if(selectedColumn.value != null && savedColumns.value.includes(selectedColumn.value)){
			editColumn(selectedColumn.value);
		}
	});
	watch(fieldNameOld, () => {
		if (selectedColumn.value == fieldNameOld.value){
			selectedColumn.value = fieldNameNew.value;
		}
		if (!!allColumnsConfig.value[fieldNameOld.value]){
			let updatedFieldConfig = JSON.parse(JSON.stringify(allColumnsConfig.value[fieldNameOld.value]));	
			delete allColumnsConfig.value[fieldNameOld.value];
			allColumnsConfig.value[fieldNameNew.value] = updatedFieldConfig;
		}
		
	});
	watch(availableFields, (newFields, oldFields) => {
		oldFields.forEach(oldField => {
			if(!newFields.includes(oldField)){
				delete allColumnsConfig.value[oldField];
				if (selectedColumn.value == oldField){
					clearAll();
				}
			}
		});
	});
	function clearAll(){
		selectedColumn.value = null;
		selectedOptions.value = [];
		fixedPlaces.value = 2;
		mathMethod.value = "";
		linkTo.value = "";
		newTab.value = true;
		asButton.value = false;
		buttonLabel.value = "";
		percentNoValue.value = 0;
	}
	function moveUp(index){
		let beginning = selectedOptions.value.slice(0, index-1);
		let risingItem = selectedOptions.value[index];
		let fallingItem = selectedOptions.value[index-1]
		let end = selectedOptions.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedOptions.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = selectedOptions.value.slice(0, index);
		let risingItem = selectedOptions.value[index+1];
		let fallingItem = selectedOptions.value[index]
		let end = selectedOptions.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedOptions.value = beginning.concat(end);
	}
	function updateFormat(){
		singleColumnConfig.value["type"] = selectedOptionsMod.value;
		if (selectedOptions.value.includes("link")){
			linkTo.value = linkTo.value.trim();
			singleColumnConfig.value["link to"] = linkTo.value;
			singleColumnConfig.value["new tab"] = `${newTab.value}`;
			if (asButton.value){
				singleColumnConfig.value["link type"] = "button";
				singleColumnConfig.value["link label"] = buttonLabel.value;
			} else {
				delete singleColumnConfig.value["link type"];
				delete singleColumnConfig.value["link label"];
			}
		} else {
			delete singleColumnConfig.value["link to"];
			delete singleColumnConfig.value["new tab"];
			delete singleColumnConfig.value["link type"];
			delete singleColumnConfig.value["link label"];
		}
		if (selectedOptions.value.includes("js math")){
			singleColumnConfig.value["method"] = mathMethod.value;
		} else {
			delete singleColumnConfig.value["method"]
		}
		if (selectedOptions.value.includes("render background percent") 
			|| selectedOptions.value.includes("render background percent negative")){
				singleColumnConfig.value["percent if empty"] = 
					typeof percentNoValue.value == "number" ? percentNoValue.value : 0;
		} else {
			delete singleColumnConfig.value["percent if empty"];
		}
	}
	function saveColumn(){
		if (selectedColumn.value == null){
			console.log("Select a column.");
			return;
		}
		if (selectedOptions.value.length == 0){
			console.log("Select some options.");
			return;
		}
		if (selectedOptions.value.includes("render background percent") && 
			selectedOptions.value.includes("render background percent negative")){
				console.log("Select 'render background %' as either positive or negative, not both.");
				return;
			}
		let columnConfig = JSON.parse(JSON.stringify(singleColumnConfig.value));
		allColumnsConfig.value[selectedColumn.value] = columnConfig;
		clearAll();
		// EMIT CONFIG GOES HERE
	}
	function deleteColumn(){
		if (selectedColumn.value != null){
			delete allColumnsConfig.value[selectedColumn.value];
		}
		clearAll();
		// EMIT CONFIG GOES HERE
	}
	function editColumn(column, oldColumn=null){
		let loadConfig = JSON.parse(JSON.stringify(allColumnsConfig.value[column]));
		clearAll();
		selectedColumn.value = column;
		singleColumnConfig.value = loadConfig;
		for (let i = 0; i < loadConfig["type"].length; i++){
			let item = loadConfig["type"][i]
			let splitItem = item.split(" ");
			if (splitItem[0] == "fixed"){
				fixedPlaces.value = parseInt(splitItem[1]);
				loadConfig["type"][i] = "fixed";
			}
		}
		selectedOptions.value = loadConfig["type"];
		let configKeys = Object.keys(loadConfig);
		if (configKeys.includes("link to")){
			linkTo.value = loadConfig["link to"]; 
		}
		if (configKeys.includes("new tab")){
			newTab.value = loadConfig["new tab"] == "true" ? true : false;
		}
		if (configKeys.includes("link type")){
			asButton.value = loadConfig["link type"] == "button";
		}
		if (configKeys.includes("link label")){
			buttonLabel.value = loadConfig["link label"];
		}
		if (configKeys.includes("method")){
			mathMethod.value = loadConfig["method"];
		}
		if (configKeys.includes("percent if empty")){
			percentNoValue.value = loadConfig["percent if empty"];
		}
	}
	function warnEditingAlready(){
		console.log("Already editing another column. Save or cancel to proceed.");
	}
</script>