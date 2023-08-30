<template>
    <div class="col-md-4 col">
		<div class="label">Select field</div>
        <SingleFieldSelect :selectedField="selectedField"
            @fieldSelected="field => acceptField(field)">
        </SingleFieldSelect>
    </div>
    <div class="col-md-4 col">
        <div class="label">
            <input class="form-check-input" type="checkbox" name="first" value="create" 
                id="false-button" v-model="createNewField" :disabled="!fieldAvailable"/>
            Create new field
        </div>
        <div class="label new-field-name" v-if="createNewField">
            New field name <sup>required</sup>
            <label>
                <input type="text" class="form-control input-default" v-model="newFieldName"/>
            </label>
        </div>
    </div>
</template>
<script setup>
    import SingleFieldSelect from '@/components/configcomponents/SingleFieldSelect.vue';
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
	const store = useConfigBuilderStore();
    const props = defineProps({
        fieldIsLoaded: Boolean,
        selectedField: String,
        loadedFieldCreateNew: Boolean,
        loadedFieldName: String
    });
    const emit = defineEmits(["fieldNameSet"]);
    const createNewField = ref(props.loadedFieldCreateNew);
    const selectedField = ref(props.selectedField);
    const selectedFieldColName = computed(() => 
        selectedField.value === null ? "" : store.getColumnName(selectedField.value)
    );
    const unConvertedFields = computed(() => 
        store.getUnConvertedFields.map(field => field["raw field"])
    );
    const fieldAvailable= computed(() => {
        let available = unConvertedFields.value.includes(selectedField.value);
        if (!props.fieldIsLoaded && !available){
            createNewField.value = true;
        }
        // Force enable the convert option if you're loading a field which already has it chosen
        return (props.fieldIsLoaded && !props.loadedFieldCreateNew) ? true : available;
    });
    const newFieldName = ref(!!props.loadedFieldCreateNew ? props.loadedFieldName : "");
    function acceptField(field){
        selectedField.value = field;
    }
    watch([selectedField, createNewField, newFieldName], () => {
        let emitObject = {
            "create new": createNewField.value,
            "raw field": selectedField.value,
            "field name": !!createNewField.value ? newFieldName.value : selectedFieldColName.value,
        }
        emit("fieldNameSet", emitObject);
    });
</script>