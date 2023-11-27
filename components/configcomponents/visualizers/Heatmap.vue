<template>
    <div class="row">
        <div class="col-md-2">
            Plot label<sup class="required"> *</sup>
        </div>
        <div class="col-md-10">
            <input type="text" v-model="plotLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Column field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="columnField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Column label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" v-model="columnLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Row field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="rowField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Row label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" v-model="rowLabel"
            class="form-control input-default form-control-sm"/>
        </div>
    </div>
<div class="row">
    <div class="col-md-2">
        Font size<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <input class="form-control form-control-sm" v-model="fontSize" type="number"/>
    </div>
</div>
<div class="label">
    Box color coding
</div>
<div class="row">
    <div class="col-md-2">
        Field<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainField">
            <option value="">Select a field</option>
            <option v-for="field in availableFields">{{ field }}</option>
        </select>
    </div>
    <div class="col-md-2">
        Label<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <input type="text" v-model="mainLabel"
            class="form-control input-default form-control-sm"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Render type<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainRenderType">
            <option value="scale">Scale</option>
        </select>
    </div>
    <div class="col-md-2">
        Direction<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <select class="form-control form-control-sm" v-model="mainDirection">
            <option value="positive">Positive (higher darker)</option>
            <option value="negative">Negative (lower darker)</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Lowest value<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <input class="form-control form-control-sm" v-model="mainLow" type="number"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Middle value<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <input class="form-control form-control-sm" v-model="mainMid" type="number"/>
    </div>
</div>
    <div class="row">
        <div class="col-md-2">
            Highest value<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input class="form-control form-control-sm" v-model="mainHigh" type="number"/>
        </div>
    </div>
    <div class="label">
        Sub circle scaling
    </div>
    <div class="row">
        <div class="col-md-2">
            Field
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="subField">
                <option value="">None</option>
                <option v-for="field in availableFields" :value="field">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2" v-if="subField !== ''">
            Label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4" v-if="subField !== ''">
            <input type="text" v-model="subLabel"
                class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div v-if="subField !== ''">
        <div class="row">
            <div class="col-md-2">
                Render type<sup class="required"> *</sup>
            </div>
            <div class="col-md-4">
                <select class="form-control form-control-sm" v-model="subRenderType">
                    <option value="steps">Steps</option>
                </select>
            </div>
            <div class="col-md-2">
                Direction<sup class="required"> *</sup>
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
                Value steps<sup class="required"> *</sup>
            </div>
            <div class="col-md-4 col">
                <table>
                    <tr v-for="(, index) in subSteps">
                        <td>
                            <input class="form-control form-control-sm" type="number"
                                v-model="subSteps[index]"/>
                        </td>
                        <td>
                            <button class="btn btn-secondary replace-chars-button delete-button"
                                v-if="subSteps.length > 1" 
                                @click="subSteps.splice(index, 1)">&times;
                            </button>
                        </td>
                    </tr>
                </table>
                <button class="btn btn-primary add-button" @click="subSteps.push('')">Add</button>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const store = useConfigBuilderStore();
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(()=> store.allFields);
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
    const mainLow = ref("");
    const mainMid = ref("");
    const mainHigh = ref("");
    const subSteps = ref([""]);
    const subField = ref("");
    const subLabel = ref("");
    const subRenderType = ref("steps");
    const subDirection = ref("positive");
    const configString = computed(() => {
        let config = {
            "type":"heat map",
            "label": plotLabel.value,
            "column field": columnField.value,
            "column label": columnLabel.value,
            "row field": rowField.value,
            "row label": rowLabel.value,
            "font size": fontSize.value,
            "main": {
                "field": mainField.value, 
                "label": mainLabel.value,
                "type": mainRenderType.value, 
                "direction": mainDirection.value, 
                "low": mainLow.value, 
                "middle": mainMid.value, 
                "high": mainHigh.value,
                }
            };
        if (subField.value !== ""){
            let sub = {
                "field": subField.value, 
                "label": subLabel.value, 
                "type": subRenderType.value, 
                "direction": subDirection.value, 
                "value range": subSteps.value
            };
            config["sub"] = sub;
        }

        // tracking the string rather than the object picks up changes within arrays
        return JSON.stringify(config);
    });
    const VALIDATORS = [
        { condition: () => plotLabel.value === "", msg: "Specify a label for the plot."},
        { condition: () => columnField.value === "" || rowField.value === "", msg: "Specify column and row fields."},
        { condition: () => columnLabel.value === "" || rowLabel.value === "", msg: "Specify column and row labels."},
        { condition: () => mainField.value === "", msg: "Specify main field."},
        { condition: () => mainLabel.value === "", msg: "Specify main label."},
        { condition: () => fontSize.value === "", msg: "Specify font size."},
        { condition: () => !(mainLow.value < mainMid.value && mainMid.value < mainHigh.value), msg: "Assign low, middle, and high values in order"},
        { condition: () => subField.value !== "" && subLabel.value === "", msg: "Specify a label for the sub circle"},
        { condition: () => subField.value !== "" && 
            (subSteps.value.length === 0 || subSteps.value.includes("")), msg: "Specify steps for the sub circle."}
    ];
    watch(configString, () =>{
        emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
    });
</script>