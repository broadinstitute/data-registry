<template>
    <div class="row" id="calculateConfig">
		<div class="col-md-6 col">
			<div class="label">
				Calculate | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fieldColumnNames" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="calculate" :value="field[0]" 
					id="flexCheckDefault" v-model="selectedField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
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
				:field-is-loaded="fieldIsLoaded"
				:loaded-field-create-new="defaultCreateNew"
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
	const fieldColumnNames = computed(() => store.selectedColumns);
    const selectedField = ref(null);
	const fieldIsLoaded = ref(false);
	const calcType = ref("-log10");
    const latestFieldName = ref("");
	const createNewField = ref(false);
	const defaultCreateNew = ref(false);
	
    if (props.loadConfig != "{}"){
		fieldIsLoaded.value = true;
        let oldConfig = JSON.parse(props.loadConfig);
        selectedField.value = oldConfig["raw field"];
		calcType.value = oldConfig["calculation type"];
		latestFieldName.value = oldConfig["field name"];
		createNewField.value = oldConfig["create new"];
		defaultCreateNew.value = oldConfig["create new"];
    }
	watch(selectedField, () => latestFieldName.value = store.getColumnName(selectedField.value));
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