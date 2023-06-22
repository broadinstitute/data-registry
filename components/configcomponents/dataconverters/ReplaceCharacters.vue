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
	const replaceCharConfig = ref({
        "type": "replace characters",
        "field name": latestFieldName,
        "raw field": selectedField,
		"replace": replaceChars
    });
	let readySaveMsg = "";
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		replaceChars.value = oldConfig["replace"];
		
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
	function emitConfig(){
        emit('configChanged', replaceCharConfig.value, readyToSave(), readySaveMsg);
	}
    function readyToSave(){
		if (!replaceCharConfig.value["field name"] || replaceCharConfig.value["field name"].trim() == ""){
			readySaveMsg = "Enter a field name.";
            return false;
		}
		if(!replaceCharConfig.value["raw field"]){
			readySaveMsg = "Select a raw field.";
            return false;
		}
		let emptyEntries = false;
		let foundCommas = false;
		replaceCharConfig.value["replace"].forEach(entry => {
			if(entry["from"] == ""){
				emptyEntries = true;
			}
			if(entry["to"].includes(",")){
				foundCommas = true;
			}
		});
		if (emptyEntries){
			readySaveMsg = "Fill in all 'Replace' entries.";
			return;
		}
		if (foundCommas){
			readySaveMsg = "Commas may not be used in character replacements.";
			return;
		}
		readySaveMsg = "";
        return true;
    }
</script>