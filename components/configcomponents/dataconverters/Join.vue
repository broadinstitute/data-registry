<template>
    <div class="row" id="joinConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join | Select field 1
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="first" :value="field" 
                        id="flexCheckDefault" v-model="firstField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ fieldColumnNames[field] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Select field 2
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="second" :value="field" 
                        id="flexCheckDefault" v-model="secondField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ fieldColumnNames[field] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Join by
			</div>
			<input type="text" class="form-control input-default" v-model="joinBy"/>
		</div>
	</div>
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({newFieldName: String, loadConfig: String});
	const fieldColumnNames = computed(() => store.getSelectedColumns);
	const fields = computed(() => Object.keys(fieldColumnNames.value));
    const emit = defineEmits(['configChanged']);
    const firstField = ref(null);
	const secondField = ref(null);
	const fieldsToJoin = computed(()=>[firstField.value, secondField.value]);
	const joinBy = ref("");
    const latestFieldName = computed(()=>{
        return props.newFieldName;
    });
	const joinConfig = ref({
        "type": "join",
        "field name": latestFieldName,
		"fields to join": fieldsToJoin,
		"join by": joinBy
    });
	let readySaveMsg = "";
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        firstField.value = oldConfig["fields to join"][0];
		secondField.value = oldConfig["fields to join"][1];
		joinBy.value = oldConfig["join by"]
		
    }
    watch([latestFieldName, fieldsToJoin, joinBy], ()=>{
        emitConfig();
    })
    function readyToSave(){
		if (joinConfig.value["join by"].includes(",")){
			readySaveMsg = "Commas may not be used in field joins.";
			return false;
		}
		if (!joinConfig.value["fields to join"][0] || !joinConfig.value["fields to join"][1]){
			readySaveMsg = "Select two fields to join.";
			return false;
		}
		readySaveMsg = "";
        return true;
    }
	function emitConfig(){
		emit('configChanged', joinConfig.value, readyToSave(), readySaveMsg);
	}
</script>