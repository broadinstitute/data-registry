<template>
    <div class="label">
            <input class="form-check-input" type="radio" name="first" value="convert" 
                id="true-button" v-model="convertOrCreate" :disabled="!fieldAvailable
                "/>
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
        selectedField: String,
        fieldIsLoaded: Boolean,
        loadedFieldCreateNew: Boolean,
        loadedFieldName: String
    });
    const emit = defineEmits(["fieldNameSet"]);
    const convertOrCreate = ref(!!props.loadedFieldCreateNew ? "create" : "convert");
    const createNewField = computed(() => convertOrCreate.value == "create");
    const selectedField = computed(()=> props.selectedField);
    const selectedFieldColName = computed(() => {
        let columns = store.getSelectedColumns;
        let index = columns.map(item => item[0]).indexOf(selectedField.value);
		return columns[index][1];
    });
    const unConvertedFields = computed(() => store.getUnConvertedFieldsConfig.map(field => field["raw field"]));
    const fieldAvailable= computed(() => {
        let available = unConvertedFields.value.includes(selectedField.value);
        if (!props.fieldIsLoaded && !available){
            convertOrCreate.value = "create";
        }
        // Force enable the convert option if you're loading a field which already has it chosen
        return (props.fieldIsLoaded && !props.loadedFieldCreateNew) ? true : available;
    });
    const newFieldName = ref(!!props.loadedFieldCreateNew ? props.loadedFieldName : "");
    function emitNewName(){
        let nameToEmit = !!createNewField.value ? newFieldName.value : selectedFieldColName.value;
        emit("fieldNameSet", createNewField.value, nameToEmit);
    }
    watch([selectedField, createNewField, newFieldName], () => {
        emitNewName();
    });
</script>