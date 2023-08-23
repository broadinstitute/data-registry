<template>
	<a href="https://hugeampkpncms.org/node/47" target="_blank" class="tutorial-link">
        Column formatting tutorial
    </a>
	<div class="row dr-builder-ui">
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
		<div class="col-md-3 col">
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
		<div class="col-md-3 col">
			<div class="label">
				Selected options | Change format order
			</div>
			<tbody class="dr-byor-data-columns">
				<tr v-for="option, index in selectedOptions" class="arrow-button-list">
					{{ formatOptions[option] }}
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUpDown(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedOptions.length - 1" @click="moveUpDown(index, true)">
						&darr;
						</button>
					</td>
				</tr>
			</tbody>
		</div>
		<div class="col-md-3 col">	
			<div v-if="selectedOptions.includes('link')" id="linkFormat">
				<div class="label">
					Link
				</div>
				<div class="form-inline">
					<span>Link to:</span>
					<input type="text" v-model="linkTo"
						class="form-control form-control-sm input-default column-format-wide"/>
				</div>
				<div class="form-inline">
					<div class="form-check column-format-label">
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
					<input type="text" v-model="buttonLabel" 
						class="form-control form-control-sm input-default column-format-wide"/>
				</div>
			</div>
			<div v-if="selectedOptions.includes('render background percent') || 
					selectedOptions.includes('render background percent negative')">
				<div class="label">
					Render background %
				</div>
				<div class="form-inline">
					<span>Percent if no value:</span>
					<input type="number" v-model="percentNoValue" 
						class="form-control form-control-sm input-default column-format-medium"/>
				</div>
			</div>
			<div v-if="selectedOptions.includes('fixed')">
				<div class="label">
				Fixed after decimal point
				</div>
				<div class="form-inline">
					<span>Place </span>
					<select class="form-control form-control-sm column-format-medium" v-model="fixedPlaces">
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
					<input type="text" v-model="mathMethod"
						class="form-control form-control-sm input-default column-format-medium"/>
				</div>
			</div>
			<div class="failed-save">{{ saveErrorMsg }}</div>
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
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
    const emit = defineEmits(["colFormatChanged"]);
    const availableFields = computed(()=> store.getAllFields);
    const fieldNameOld = computed(() => store.getLatestFieldRename[0]);
    const fieldNameNew = computed(() => store.getLatestFieldRename[1]);
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
			item => item == "fixed" ? `fixed ${fixedPlaces.value}` : item));
	const singleColumnConfig = ref({"type": []});
	const allColumnsConfig = ref({});
	const allColumnsConfigString = computed(() => JSON.stringify(allColumnsConfig.value));
	const savedColumns = computed(() => Object.keys(allColumnsConfig.value));
    const saveErrorMsg =ref("");
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
	watch([availableFields, fieldNameOld], (newValues, oldValues) => {
		// Name changes to fields should be handled first
		if (selectedColumn.value == fieldNameOld.value){
			selectedColumn.value = fieldNameNew.value;
		}
		if (!!allColumnsConfig.value[fieldNameOld.value]){
			let updatedFieldConfig = JSON.parse(JSON.stringify(allColumnsConfig.value[fieldNameOld.value])); // Deep copy
			delete allColumnsConfig.value[fieldNameOld.value];
			allColumnsConfig.value[fieldNameNew.value] = updatedFieldConfig;
		}

		// Then handle field deletion
		let newFields = newValues[0];
		let oldFields = oldValues[0];
		oldFields.forEach(oldField => {
			if(!newFields.includes(oldField)){
				delete allColumnsConfig.value[oldField];
				if (selectedColumn.value == oldField){
					clearAll();
				}
			}
		});
	});
	watch(allColumnsConfigString, () => emitFormat());
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
		saveErrorMsg.value = "";
	}
	function moveUpDown(index, down=false){
		if (down) { index++; }
		let risingItem = selectedOptions.value[index];
		selectedOptions.value.splice(index, 1);
		selectedOptions.value.splice(index - 1, 0, risingItem);
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
		saveErrorMsg.value = "";
	}
	function emitFormat(){
		emit("colFormatChanged", allColumnsConfig.value);
	}
	function saveColumn(){
		if (selectedColumn.value == null){
			saveErrorMsg.value = "Select a column.";
			return;
		}
		if (selectedOptions.value.length == 0){
			saveErrorMsg.value = "Select some options.";
			return;
		}
		if (selectedOptions.value.includes("render background percent") && 
			selectedOptions.value.includes("render background percent negative")){
				saveErrorMsg.value = "Select 'render background %' as either positive or negative, not both.";
				return;
		}
		if (selectedOptions.value.includes("js math") && mathMethod.value.trim() === ""){
			saveErrorMsg.value = "Specify a JavaScript math method.";
			return;
		}
		let columnConfig = JSON.parse(JSON.stringify(singleColumnConfig.value)); // Deep copy
		allColumnsConfig.value[selectedColumn.value] = columnConfig;
		clearAll();
	}
	function deleteColumn(){
		if (selectedColumn.value != null){
			delete allColumnsConfig.value[selectedColumn.value];
		}
		clearAll();
	}
	function editColumn(column, oldColumn=null){
		let loadConfig = JSON.parse(JSON.stringify(allColumnsConfig.value[column])); // Deep copy
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
		saveErrorMsg.value = "Already editing another column. Save or cancel to proceed.";
	}
</script>