<template>
    <div class="row" id="calculateConfig">
		<div class="col-md-6 col">
			<div class="label">
				Calculate | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="calculate" :value="field" 
					id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ fieldColumnNames[field] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-6 col">
			<div class="label">
				Calculate
			</div>
			<select class="form-control" v-model="calcType">
				<option value="-log10">-Log10</option>
			</select>
		</div>
		<div v-if="selectedField != null">
			<CreateNewField :selected-field="selectedField"
				:loaded-field-create-new="createNewField"
				:loaded-field-name="latestFieldName"
				@field-name-set="(createNew, newName) => processFieldInfo(createNew, newName)">
			</CreateNewField>
		</div>
	</div>
</template>
<script setup>
	import CreateNewField from '@/components/configcomponents/CreateNewField.vue';
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({newFieldName: String, loadConfig: String});
    const emit = defineEmits(['configChanged']);
	const fieldColumnNames = computed(() => store.getSelectedColumns);
	const fields = computed(() => Object.keys(fieldColumnNames.value));
    const selectedField = ref(null);
	const calcType = ref("-log10");
    const latestFieldName = ref("");
	const createNewField = ref(false);
	
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		calcType.value = oldConfig["calculation type"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
    }
	watch(selectedField, () => 
		latestFieldName.value = fieldColumnNames.value[selectedField.value]
	);
    watch([latestFieldName, selectedField, calcType], ()=>{
        emitConfig();
    })
    function preSaveCheck(){
		if (selectedField.value == null){
			return [false, "Select a field."];
		}
		return [true, ""];
    }
	function emitConfig(){
		let calcConfig = {
			"type": "calculate",
			"field name": latestFieldName.value,
			"raw field": selectedField.value,
			"calculation type": calcType.value,
			"create new": createNewField.value
    	};
		emit('configChanged', calcConfig, preSaveCheck());
	}
	function processFieldInfo(createNew, newName){
		createNewField.value = createNew;
		latestFieldName.value = newName;
	}
</script>