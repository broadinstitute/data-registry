<template>
    <div class="row">
        <div class="col-md-2">
            Label:
        </div>
        <div class="col-md-10">
            <input type="text" v-model="label"
                class="form-control input-default form-control-sm"
            />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            X axis field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="xAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            X axis label:
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Y axis field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Y axis label:
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="yAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Render by:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="renderBy">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="label">
        X axis field condition
    </div>
    <div class="row">
        <div class="col-md-2">
            Condition:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="xAxisCondition">
                <option value="greater than">Greater than</option>
                <option value="lower than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2" v-if="xAxisCondition != 'lower than'">
            Greater than
        </div>
        <div class="col-md-4" v-if="xAxisCondition != 'lower than'">
            <input type="number" id="xGT" class="form-control input-default form-control-sm" :value="0"
                @change="event => fixNumber('xGT', event.target.value)"/>
        </div>

        <div class="col-md-2" v-if="xAxisCondition != 'greater than'">
            Less than
        </div>
        <div class="col-md-4" v-if="xAxisCondition != 'greater than'">
            <input type="number" id="xLT" class="form-control input-default form-control-sm" :value="0"
                @change="event => fixNumber('xLT', event.target.value)"/>
        </div>
    </div>
    <div class="label">
        Y axis field condition
    </div>
    <div class="row">
        <div class="col-md-2">
            Condition:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisCondition">
                <option value="greater than">Greater than</option>
                <option value="lower than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2" v-if="yAxisCondition != 'lower than'">
            Greater than
        </div>
        <div class="col-md-4" v-if="yAxisCondition != 'lower than'">
            <input type="number" id="yGT" class="form-control input-default form-control-sm" :value="0"
                @change="event => fixNumber('yGT', event.target.value)"/>
        </div>

        <div class="col-md-2" v-if="yAxisCondition != 'greater than'">
            Less than
        </div>
        <div class="col-md-4" v-if="yAxisCondition != 'greater than'">
            <input type="number" id="yLT" class="form-control input-default form-control-sm" :value="0"
                @change="event => fixNumber('yLT', event.target.value)"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Label dots if meet:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="dotLabelScore">
                <option :value="1">1 condition</option>
                <option :value="2">2 conditions</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Width:
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control input-default form-control-sm" id="width" :value="800"
                @change="event => fixNumber('width', event.target.value)"/>
        </div>
        <div class="col-md-2">
            Height:
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control input-default form-control-sm" id="height" :value="400"
                @change="event => fixNumber('height', event.target.value)"/>
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
    const label = ref("");
    const xAxisField = ref("");
    const xAxisLabel = ref("");
    const yAxisField = ref("");
    const yAxisLabel = ref("");
    const renderBy = ref("");
    const dotLabelScore = ref(1);
    const xAxisCondition = ref("greater than");
    const yAxisCondition = ref("greater than");
    const numbers = ref({
        "xGT": 0,
        "xLT": 0,
        "yGT": 0,
        "yLT": 0,
        "width": 800,
        "height": 400
    });
    const configObject = computed(() => {
        let config = {
            "type":"volcano plot",
            "label": label.value.trim(),
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value.trim(),
            "y axis field": yAxisField.value,
            "y axis label": yAxisLabel.value.trim(),
            "render by": renderBy.value,
            "x condition": {
                "combination": xAxisCondition.value,
                "greater than": numbers.value.xGT,
                "lower than": numbers.value.xLT
            },
            "y condition": {
                "combination": yAxisCondition.value,
                "greater than": numbers.value.yGT,
                "lower than": numbers.value.yLT
            },
            "dot label score": dotLabelScore.value,
            "width": numbers.value.width,
            "height": numbers.value.height,
        };
        if (xAxisCondition.value == 'greater than'){
            delete config["x condition"]["lower than"];
        }
        if (xAxisCondition.value == 'lower than'){
            delete config["x condition"]["greater than"];
        }
        if (yAxisCondition.value == 'greater than'){
            delete config["y condition"]["lower than"];
        }
        if (yAxisCondition.value == 'lower than'){
            delete config["y condition"]["greater than"];
        }
        return config;
    });
    function readyToSave(){
        let check = {
            ready: false,
            msg: ""
        };
        if (label.value.trim() === ""){
            check.msg = "Specify a label for the plot.";
            return check;
        }
        if (xAxisField.value === "" || yAxisField.value === ""){
            check.msg = "Specify fields for both axes.";
            return check;
        }
        if (xAxisLabel.value.trim() === "" || yAxisLabel.value.trim() === ""){
            check.msg = "Specify labels for both axes.";
            return check;
        }
        if (renderBy.value === ""){
            check.msg = "Specify field to render by.";
            return check;
        }
        if (xAxisCondition.value === "and" && numbers.value.xGT >= numbers.value.xLT){
            check.msg = "X-axis 'AND' condition must be corrected.";
            return check;
        }
        if (yAxisCondition.value === "and" && numbers.value.yGT >= numbers.value.yLT){
            check.msg = "Y-axis 'AND' condition must be corrected.";
            return check;
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
        numbers.value[field] = numValue;
    }
    watch(configObject, () =>{
        emit('updateVisualizer', configObject.value, readyToSave());
    });
</script>