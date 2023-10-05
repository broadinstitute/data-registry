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
    <div class="col-md-4">
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
            <option value="positive">Positive (higher darker)</option>
            <option value="negative">Negative (lower darker)</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Lowest value
    </div>
    <div class="col-md-4">
        <input class="column-select form-control input-default" 
            id="mainLow" type="number" :value="0"
            @change="event => fixNumber('mainLow', event.target.value)"/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        Middle value
    </div>
    <div class="col-md-4">
        <input class="column-select form-control input-default" 
            id="mainMid" type="number" :value="0"
            @change="event => fixNumber('mainMid', event.target.value)"/>
    </div>
</div>
    <div class="row">
        <div class="col-md-2">
            Highest value
        </div>
        <div class="col-md-4">
            <input class="column-select form-control input-default" 
                id="mainHigh" type="number" :value="0"
                @change="event => fixNumber('mainHigh', event.target.value)"/>
        </div>
    </div>
<!-- TABLE LIKE THE ONE FROM SELECT COLUMNS?-->
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
        <div class="col-md-2" v-if="subField !== ''">
            Label
        </div>
        <div class="col-md-4" v-if="subField !== ''">
            <input type="text" v-model="subLabel"
                class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div v-if="subField !== ''">
        <div class="row">
            <div class="col-md-2">
                Render type
            </div>
            <div class="col-md-4">
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
            <div class="col-md-4 col">
			<table>
				<tr v-for="entry, index in thresholds.subSteps">
					<td>
						<input type="number" class="form-control input-default"
							:value="entry" :id="`subSteps_${index}`"
							@change="(event)=>fixNumber(`subSteps_${index}`, event.target.value)"/>
					</td>
					<td>
						<button class="btn btn-secondary replace-chars-button delete-button"
							v-if="thresholds.subSteps.length > 1" 
                            @click="thresholds.subSteps.splice(index, 1);">&times;
						</button>
					</td>
				</tr>
			</table>
			<button class="btn btn-primary" @click="thresholds.subSteps.push(0)">Add</button>
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
    const thresholds = ref({
        mainLow: 0,
        mainMid: 0,
        mainHigh: 0,
        subSteps: [0,0]
    });
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
            "font size": parseInt(fontSize.value),
            "main": {
                "field": mainField.value, 
                "label": mainLabel.value,
                "type": mainRenderType.value, 
                "direction": mainDirection.value, 
                "low": thresholds.value.mainLow, 
                "middle": thresholds.value.mainMid, 
                "high": thresholds.value.mainHigh,
                }
            };
        if (subField.value !== ""){
            let sub = {
                "field": subField.value, 
                "label": subLabel.value, 
                "type": subRenderType.value, 
                "direction": subDirection.value, 
                "value range": thresholds.value.subSteps
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
        // Render type and direction will never be blank
        if (!(thresholds.value.mainLow <= thresholds.value.mainMid 
            && thresholds.value.mainMid <= thresholds.value.mainHigh)){
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
    function fixNumber(field, input){
        let numValue = parseFloat(input);
        if (isNaN(numValue)){
            numValue = 0;
        }
        let inputField = document.querySelector(`input#${field}`);
        inputField.value = numValue;
        let fieldSplit = field.split("_");
        if (fieldSplit[0] === "subSteps"){
            let index = parseInt(fieldSplit[1]); 
            thresholds.value.subSteps[index] = numValue;
            return;
        }
        thresholds.value[field] = numValue;
    }
    watch(configObject, () =>{
        emit('updateVisualizer', configObject.value, readyToSave());
    });
</script>