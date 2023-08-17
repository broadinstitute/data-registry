<template>
    <div class="label">
            <input class="form-check-input" type="radio" name="first" value="convert" 
                id="true-button" v-model="convertOrCreate"/>
            Convert "{{ selectedFieldColName }}"
    </div>
    <div class="label">
            <input class="form-check-input" type="radio" name="first" value="create" 
                id="false-button" v-model="convertOrCreate"/>
            Create new field
    </div>
    <div class="label new-field-name" v-if="createNewField">
            New field name <sup>required</sup>
            <label>
                <input type="text" class="form-control input-default" v-model="newFieldName"/>
            </label>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
	const store = useConfigBuilderStore();
    const props = defineProps({
        selectedField: String
    });
    const emit = defineEmits(["fieldNameSet"]);
    const convertOrCreate = ref("convert");
    const createNewField = computed(() => convertOrCreate.value == "create");
    const selectedField = computed(()=> props.selectedField);
    const selectedFieldColName = computed(() => store.getColumnObject[selectedField.value]);
    const newFieldName = ref("");
    function emitNewName(){
        let nameToEmit = !!createNewField.value ? newFieldName.value : selectedFieldColName.value;
        emit("fieldNameSet", createNewField.value, nameToEmit);
    }
    watch([selectedField, createNewField, newFieldName], () => {
        emitNewName();
    });
</script>