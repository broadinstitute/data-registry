<template>
    <div class="row" id="joinConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join | Select field 1
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fieldColumnNames" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="first" :value="field[0]" 
                        id="flexCheckDefault" v-model="firstField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Select field 2
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="field in fieldColumnNames" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="second" :value="field[0]" 
                        id="flexCheckDefault" v-model="secondField"/>
						<span class="form-check-label" for="flexCheckDefault">{{ field[1] }}</span>
				</li>													
			</ul>
		</div>
		<div class="col-md-4 col">
			<div class="label">
				Join by
			</div>
			<input type="text" class="form-control input-default" v-model="joinBy"/>
		</div>
		<div class="label">
			New field name
			<label>
				<input type="text" class="form-control input-default" v-model="latestFieldName">
			</label>
		</div>
	</div>
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({loadConfig: String});
	const fieldColumnNames = computed(() => store.getSelectedColumns);
    const emit = defineEmits(['configChanged']);
    const firstField = ref(null);
	const secondField = ref(null);
	const fieldsToJoin = computed(()=>[firstField.value, secondField.value]);
	const joinBy = ref("");
    const latestFieldName = ref("");
	const joinConfig = ref({
        "type": "join",
        "field name": latestFieldName,
		"fields to join": fieldsToJoin,
		"join by": joinBy,
		"create new": true
    });
    if (props.loadConfig != "{}"){
        let oldConfig = JSON.parse(props.loadConfig);
        firstField.value = oldConfig["fields to join"][0];
		secondField.value = oldConfig["fields to join"][1];
		joinBy.value = oldConfig["join by"]
		
    }
    watch([latestFieldName, fieldsToJoin, joinBy], ()=>{
        emitConfig();
    })
    function preSaveCheck(){
		if (joinConfig.value["join by"].includes(",")){
			return [false, "Commas may not be used in field joins."]
		}
		if (!joinConfig.value["fields to join"][0] || !joinConfig.value["fields to join"][1]){
			return [false, "Select two fields to join."]
		}
        return [true, ""];
    }
	function emitConfig(){
		emit('configChanged', joinConfig.value, preSaveCheck());
	}
</script>