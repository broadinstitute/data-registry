<template>
    <div class="row">
        <div class="col-md-2">
            Label<sup class="required"> *</sup>
        </div>
        <div class="col-md-10">
            <input type="text" v-model="label"
                class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            X axis field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="xAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            X axis label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Y axis field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Y axis label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="yAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Render by<sup class="required"> *</sup>
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
            Condition<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="xAxisCondition">
                <option value="">Select a condition</option>
                <option value="greater than">Greater than</option>
                <option value="lower than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2" v-if="GREATER_THANS.includes(xAxisCondition)">
            Greater than<sup class="required"> *</sup>
        </div>
        <div class="col-md-4" v-if="GREATER_THANS.includes(xAxisCondition)">
            <input class="form-control form-control-sm" v-model="xGT"
                @change="$event => xGT = toNumber($event.target.value)"/>
        </div>
        <div class="col-md-2">
            <span v-if="xAxisCondition === 'lower than'">Less than<sup class="required"> *</sup></span>
            <span v-else-if="xAxisCondition === 'and'">AND less than<sup class="required"> *</sup></span>
            <span v-else-if="xAxisCondition === 'or'">OR less than<sup class="required"> *</sup></span>
        </div>
        <div class="col-md-4" v-if="LOWER_THANS.includes(xAxisCondition)">
            <input class="form-control form-control-sm" v-model="xLT"
                @change="$event => xLT = toNumber($event.target.value)"/>
        </div>
    </div>
    <div class="label">
        Y axis field condition
    </div>
    <div class="row">
        <div class="col-md-2">
            Condition<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisCondition">
                <option value="">Select a condition</option>
                <option value="greater than">Greater than</option>
                <option value="lower than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2" v-if="GREATER_THANS.includes(yAxisCondition)">
            Greater than<sup class="required"> *</sup>
        </div>
        <div class="col-md-4" v-if="GREATER_THANS.includes(yAxisCondition)">
            <input class="form-control form-control-sm" v-model="yGT"
                @change="$event => yGT = toNumber($event.target.value)"/>
        </div>
        <div class="col-md-2">
            <span v-if="yAxisCondition === 'lower than'">Less than<sup class="required"> *</sup></span>
            <span v-else-if="yAxisCondition === 'and'">AND less than<sup class="required"> *</sup></span>
            <span v-else-if="yAxisCondition === 'or'">OR less than<sup class="required"> *</sup></span>
        </div>
        <div class="col-md-4" v-if="LOWER_THANS.includes(yAxisCondition)">
            <input class="form-control form-control-sm" v-model="yLT"
                @change="$event => yLT = toNumber($event.target.value)"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Label dots meeting<sup class="required"> *</sup>
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
            Width
        </div>
        <div class="col-md-4">
            <input class="form-control form-control-sm" v-model="width"
                @change="$event => width = toNumber($event.target.value)"/>
        </div>
        <div class="col-md-2">
            Height
        </div>
        <div class="col-md-4">
            <input class="form-control form-control-sm" v-model="height"
                @change="$event => height = toNumber($event.target.value)"/>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const store = useConfigBuilderStore();
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
    const xAxisCondition = ref("");
    const yAxisCondition = ref("");
    const GREATER_THANS = ["greater than", "and", "or"];
    const LOWER_THANS = ["lower than", "and", "or"];
    const xGT = ref(0);
    const xLT = ref(0);
    const yGT = ref(0);
    const yLT = ref(0);
    const width = ref("");
    const height = ref("");
    const configObject = computed(() => {
        let config = {
            "type":"volcano plot",
            "label": label.value,
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value,
            "y axis field": yAxisField.value,
            "y axis label": yAxisLabel.value,
            "render by": renderBy.value,
            "x condition": {
                "combination": xAxisCondition.value,
            },
            "y condition": {
                "combination": yAxisCondition.value,
            },
            "dot label score": dotLabelScore.value,
        };
        if (GREATER_THANS.includes(xAxisCondition.value)){
            config["x condition"]["greater than"] = xGT.value;
        }
        if (LOWER_THANS.includes(xAxisCondition.value)){
            config["x condition"]["lower than"] = xLT.value;
        }
        if (GREATER_THANS.includes(yAxisCondition.value)){
            config["y condition"]["greater than"] = yGT.value;
        }
        if (LOWER_THANS.includes(yAxisCondition.value)){
            config["y condition"]["lower than"] = yLT.value;
        }
        if (width.value !== null){
            config["width"] = width.value;
        }
        if (height.value !== null){
            config["height"] = height.value;
        }
        return config;
    });
    function readyToSave(){
        let check = {
            ready: false,
            msg: ""
        };
        if (label.value === ""){
            check.msg = "Specify a label for the plot.";
            return check;
        }
        if (xAxisField.value === "" || yAxisField.value === ""){
            check.msg = "Specify fields for both axes.";
            return check;
        }
        if (xAxisLabel.value === "" || yAxisLabel.value === ""){
            check.msg = "Specify labels for both axes.";
            return check;
        }
        if (renderBy.value === ""){
            check.msg = "Specify field to render by.";
            return check;
        }
        if (xAxisCondition.value === "" || yAxisCondition.value === ""){
            check.msg = "Specify conditions for both axes.";
            return check;
        }
        if (GREATER_THANS.includes(xAxisCondition.value) && xGT.value === null){
            check.msg = "Specify greater-than threshold for X axis.";
            return check;
        }
        if (LOWER_THANS.includes(xAxisCondition.value) && xLT.value === null){
            check.msg = "Specify less-than threshold for X axis.";
            return check;
        }
        if (GREATER_THANS.includes(yAxisCondition.value) && yGT.value === null){
            check.msg = "Specify greater-than threshold for Y axis.";
            return check;
        }
        if (LOWER_THANS.includes(yAxisCondition.value) && yLT.value === null){
            check.msg = "Specify less-than threshold for Y axis.";
            return check;
        }
        if (xAxisCondition.value === "and" && xGT.value >= xLT.value){
            check.msg = "X axis 'AND' condition must be corrected.";
            return check;
        }
        if (yAxisCondition.value === "and" && yGT.value >= yLT.value){
            check.msg = "Y axis 'AND' condition must be corrected.";
            return check;
        }
        check.ready = true;
        return check;
    }
    watch(configObject, () =>{
        emit('updateVisualizer', configObject.value, readyToSave());
    });
</script>