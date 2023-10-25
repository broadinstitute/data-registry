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
        <input class="form-control form-control-sm" v-model="fontSize" 
                @change="$event => fontSize = toNumber($event.target.value)"/>
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
        <input class="form-control form-control-sm" v-model="mainLow"
                @change="$event => mainLow = toNumber($event.target.value)"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Middle value<sup class="required"> *</sup>
    </div>
    <div class="col-md-4">
        <input class="form-control form-control-sm" v-model="mainMid"
                @change="$event => mainMid = toNumber($event.target.value)"/>
    </div>
</div>
    <div class="row">
        <div class="col-md-2">
            Highest value<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input class="form-control form-control-sm" v-model="mainHigh" 
                @change="$event => mainHigh = toNumber($event.target.value)"/>
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
                        <input class="form-control form-control-sm" :value="subSteps[index]"
                            @change="$event => subSteps[index] = toNumber($event.target.value)"/>
					</td>
					<td>
						<button class="btn btn-secondary replace-chars-button delete-button"
							v-if="subSteps.length > 1" 
                            @click="subSteps.splice(index, 1)">&times;
						</button>
					</td>
				</tr>
			</table>
			<button class="btn btn-primary" @click="subSteps.push(0)">Add</button>
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
    const subSteps = ref([0,0]);
    const subField = ref("");
    const subLabel = ref("");
    const subRenderType = ref("steps");
    const subDirection = ref("positive");
    const configObject = computed(() => {
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
        return config;
    });
    function readyToSave(){
        let check = {
			ready: false,
			msg: ""
		};
        if (plotLabel.value === ""){
            check.msg = "Specify a label for the plot.";
            return check;
        }
        if (columnField.value === "" || rowField.value === ""){
            check.msg = "Specify column and row fields.";
            return check;
        }
        if (columnLabel.value === "" || rowLabel.value === ""){
            check.msg = "Specify column and row labels.";
            return check;
        }
        if (mainField.value === ""){
            check.msg = "Specify main field.";
            return check;
        }
        if (mainLabel.value === ""){
            check.msg = "Specify main label.";
            return check;
        }
        if (fontSize.value === null){
            check.msg = "Specify font size.";
        }
        // Render type and direction will never be blank
        if (!(mainLow.value <= mainMid.value && mainMid.value <= mainHigh.value)){
                check.msg = "Assign low, middle, and high values in order";
                return check;
            }
        if (subField.value !== ""){
            if (subLabel.value === ""){
                check.msg = "Specify a label for the sub circle";
                return check;
            }
        }
        check.ready = true;
        return check;
    }
    function toNumber(input){
        let floatInput = parseFloat(input);
        return Number.isNaN(floatInput) ? null : floatInput;
    }
    watch(configObject, () =>{
        emit('updateVisualizer', configObject.value, readyToSave());
    });
</script>