<template>
    <div class="row">
        <div class="col-md-2">
            Plot label:
        </div>
        <div class="col-md-10">
            <input type="text" v-model="plotLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Column field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="columnField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>

        <div class="col-md-2">
            Column label:
        </div>
        <div class="col-md-4">
            <input type="text" v-model="columnLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Row field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="rowField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Row label:
        </div>
        <div class="col-md-4">
            <input type="text" v-model="rowLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
<div class="row">
    <div class="col-md-2">
        Font size
    </div>
    <div class="col-md-10">
        <input type="number" v-model="fontSize"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
<div class="label">
    Main box
</div>
<div class="row">
    <div class="col-md-2">
        Field:
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainField">
            <option value="">Select a field</option>
            <option v-for="field in availableFields">{{ field }}</option>
        </select>
    </div>
    <div class="col-md-2">
        Label
    </div>
    <div class="col-md-4">
        <input type="text" v-model="mainLabel"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Render type
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainRenderType">
            <option value="scale">Scale</option>
        </select>
    </div>
    <div class="col-md-2">
        Direction
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainDirection">
            <option value="positive">Positive(higher darker)</option>
            <option value="negative">Negative(lower darker)</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Lowest value
    </div>
    <div class="col-md-4">
        <input type="text" v-model="mainLow"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Middle value
    </div>
    <div class="col-md-4">
        <input type="text" v-model="mainMid"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Highest value
    </div>
    <div class="col-md-4">
        <input type="text" v-model="mainHigh"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
    <div class="label">
        Sub circle (optional)
    </div>
    <div class="row">
        <div class="col-md-2">
            Field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="subField">
                <option value="">None</option>
                <option v-for="field in availableFields" :value="field">{{ field }}</option>
            </select>
        </div>
        <div v-if="subField != ''">
            <div class="col-md-2">
                Label
            </div>
            <div class="col-md-4">
                <input type="text" v-model="subLabel"
                    class="form-control input-default form-control-sm"/>
            </div>
        </div>
    </div>
    <div v-if="subField != ''">
        <div class="row">
            <div class="col-md-2">
                Render type
            </div>
            <div class="col-md-2">
                <select class="form-control form-control-sm" v-model="subRenderType">
                    <option value="steps">Steps</option>
                </select>
            </div>
            <div class="col-md-2">
                Direction
            </div>
            <div class="col-md-4">
                <select class="form-control form-control-sm" v-model="subDirection">
                    <option value="positive">Positive (higher bigger)</option>
                    <option value="negative">Negative (lower bigger)</option>
                </select>
            </div>
        </div>
        <div class="row" v-if="subRenderType == 'steps'">
            <div class="col-md-2">
                Value steps
                <small>(separate with ,)</small>
            </div>
            <div class="col-md-10">
                <input type="text" v-model="subValueSteps"
                    class="form-control input-default form-control-sm"/>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const store = useConfigBuilderStore();
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(()=> store.allFields);
    const fieldNameOld = computed(() => store.latestFieldRename[0]);
    const fieldNameNew = computed(() => store.latestFieldRename[1]);
    const plotLabel = ref("");
    const columnField = ref("");
    const columnLabel = ref("");
    const rowField = ref("");
    const rowLabel = ref("");
    const fontSize = ref(12);
    const mainField = ref("");
    const mainLabel = ref("");
    const mainRenderType = ref("scale");
    const mainDirection = ref("positive");
    const mainLow = ref(0);
    const mainMid = ref(0);
    const mainHigh = ref(0);
    const subField = ref("");
    const subLabel = ref("");
    const subRenderType = ref("steps");
    const subDirection = ref("positive");
    const subValueSteps = ref(0,0);
    const configObject = computed(() => {
        console.log(subField.value);
        let config = {
            "type":"heat map",
            "label": plotLabel.value,
            "column field": columnField.value,
            "column label": columnLabel.value,
            "row field": rowField.value,
            "row label": rowLabel.value,
            "font size": parseInt(fontSize.value),
            "main": {
                "field": mainField.value, 
                "label": mainLabel.value,
                "type": mainRenderType.value, 
                "direction": mainDirection.value, 
                "low": parseFloat(mainLow.value), 
                "middle": parseFloat(mainMid.value), 
                "high": parseFloat(mainHigh.value),
                }
            };
        if (subField.value != ""){
            let sub = {
                "field": subField.value, 
                "label": subLabel.value, 
                "type": subRenderType.value, 
                "direction": subDirection.value, 
                "value range": [0.001, 0.05] // figure this out!
            }
            config["sub"] = sub;
        }
        return config;
    });
    watch(configObject, () =>{
        emit('updateVisualizer', JSON.stringify(configObject.value));
    });
</script>