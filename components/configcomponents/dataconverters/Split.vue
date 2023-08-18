<template>
    <div class="row" id="splitConfig">
		<div class="col-md-4 col">
			<div class="label">
				Split | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="replace" :value="field" 
						id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ fieldColumnNames[field] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<table>
					<tr>
						<th>New field name</th>
						<th>Split by</th>
					</tr>
				<tr v-for="entry, index in newFieldNames">
					<td>
						<input type="text" class="form-control input-default"
							:value="entry"
							@change="(event)=>updateNames(index, event.target.value)"/>
					</td>
					<td v-if="index != newFieldNames.length - 1">
						<input type="text" class="form-control input-default"
							:value="splitBy[index]"
							@change="(event)=>updateSplitBy(index, event.target.value)"/>
					</td>
					<td>
						<button class="btn btn-secondary replace-chars-button delete-button"
							v-if="newFieldNames.length > 2" @click="deleteEntry(index)">&times;
						</button>
					</td>
				</tr>
			</table>
			<button class="btn btn-primary" @click="addEntry()">Add</button>
		</div>
	</div>
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
	const fieldColumnNames = computed(() => store.getSelectedColumns);
	const fields = computed(() => Object.keys(fieldColumnNames.value));
	const emit = defineEmits(['configChanged']);
	const selectedField = ref(null);
	const splitBy = ref([""]);
	const newFieldNames = ref(["", ""]);

	function emitConfig(){
		let check = preSaveCheck();
		let ready = check[0];
		let msg = check[1];
		let splitConfig = {
			"type": "split",
			"field name": newFieldNames.value,
			"field to split": selectedField.value,
			"split by": splitBy.value,
			"create new": true
		};
		emit('configChanged', splitConfig, ready, msg);
	}
	if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["field to split"];
		splitBy.value = oldConfig["split by"];
		newFieldNames.value = oldConfig["field name"];
    }

	function updateNames(index, name){
		newFieldNames.value[index] = name;
		emitConfig();
	}

	function updateSplitBy(index, splitChar){
		splitBy.value[index] = splitChar;
		emitConfig();
	}
	function addEntry(){
		newFieldNames.value.push("");
		splitBy.value.push("");
		emitConfig();
	}
	function deleteEntry(index){
		newFieldNames.value.splice(index, 1);
		let splicePos = index == splitBy.value.length ? index - 1 : index;
		splitBy.value.splice(splicePos, 1);
		emitConfig();
	}
	
    function preSaveCheck(){
		let fieldsLength = newFieldNames.value.length;
		let splitLength = splitBy.value.length;
		if (fieldsLength < 2){
			return [false, "Specify at least 2 fields."];
		}
		if (splitLength != fieldsLength - 1){
			return [false, "Specify split separators."];
		}
		for (let i = 0; i < splitLength; i++){
			let splitEntry = splitBy.value[i]
			if (splitEntry == ""){
				return [false, "Specify split separators."];
			}
		}
        return [true, ""]
    }
	watch([newFieldNames, selectedField, splitBy], ()=>{
        emitConfig();
    });
</script>