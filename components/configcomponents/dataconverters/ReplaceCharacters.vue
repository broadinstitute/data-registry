<template>
    <div class="row" id="replaceCharactersConfig">
		<div class="col-md-6 col">
			<div class="label">
				Replace characters | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="replace" :value="field[0]" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<table>
					<tr>
						<th>Replace</th>
						<th>With</th>
					</tr>
				<tr v-for="entry, index in replaceChars">
					<td>
						<input type="text" class="form-control input-default"
							:value="entry['from']"
							@change="(event)=>updateFrom(index, event.target.value)"/>
					</td>
					<td>
						<input type="text" class="form-control input-default"
							:value="entry['to']"
							@change="(event)=>updateTo(index, event.target.value)"/>
					</td>
					<td>
						<button class="btn btn-secondary replace-chars-button delete-button"
							v-if="replaceChars.length > 1" @click="deleteEntry(index)">&times;
						</button>
					</td>
				</tr>
			</table>
			<button class="btn btn-primary" @click="addEntry()">Add</button>
		</div>
		<div v-if="selectedField != null">
			<CreateConvert :selected-field="selectedField"
				:loaded-field-create-new="createNewField"
				:loaded-field-name="latestFieldName"
				@field-name-set="(createNew, newName) => processFieldInfo(createNew, newName)">
			</CreateConvert>
		</div>
	</div>
</template>
<script setup>
	import CreateConvert from '@/components/configcomponents/CreateConvert.vue';
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({ newFieldName: String, loadConfig: String});
	const fields = computed(() => store.getSelectedColumns);
    const emit = defineEmits(['configChanged']);
    const selectedField = ref(null);
    const latestFieldName = ref("");
	const createNewField = ref(false);
	const replaceChars = ref([
		{
			"from": "",
			"to": ""
		}
	]);
	watch(selectedField, () => 
		latestFieldName.value = store.getColumnObject[selectedField.value]
	);
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		replaceChars.value = oldConfig["replace"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
    }
	function addEntry(){
		replaceChars.value.push({
			"from": "",
			"to": ""
		});
	}
	function deleteEntry(index){
		replaceChars.value.splice(index, 1);
	}
	function updateFrom(index, value){
		replaceChars.value[index]["from"] = value;
		emitConfig()
	}
	function updateTo(index, value){
		replaceChars.value[index]["to"] = value;
		emitConfig();
	}
    watch([latestFieldName, selectedField, replaceChars], ()=>{
		emitConfig();
    });
    function preSaveCheck(){
		if(selectedField.value == null){
            return [false, "Select a raw field."];
		}
		let emptyEntries = false;
		let foundCommas = false;
		replaceChars.value.forEach(entry => {
			if(entry["from"] == ""){
				emptyEntries = true;
			}
			if(entry["to"].includes(",")){
				foundCommas = true;
			}
		});
		if (emptyEntries){
			return [false, "Fill in all 'Replace' entries."];
		}
		if (foundCommas){
			return [false, "Commas may not be used in character replacements."];
		}
        return [true, ""];
    }
	function emitConfig(){
		let check = preSaveCheck();
		let ready = check[0];
		let msg = check[1];
		let replaceCharConfig = {
        	"type": "replace characters",
        	"field name": latestFieldName.value,
        	"raw field": selectedField.value,
			"replace": replaceChars.value,
			"create new": createNewField.value
    	};
        emit('configChanged', replaceCharConfig, ready, msg);
	}
	function processFieldInfo(createNew, newName){
		createNewField.value = createNew;
		latestFieldName.value = newName;
	}
</script>