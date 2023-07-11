<template>
    <div class="row">
        <div class="col-md-3">
            X Axis field:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="xAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            X Axis label:
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Y Axis field:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Y Axis label:
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control input-default form-control-sm" v-model="yAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Render by:
        </div>
        <div class="col-md-9">
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
        <div class="col-md-3">
            Condition:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="xAxisCondition">
                <option value="greater than">Greater than</option>
                <option value="lower than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
        </div>
        <div class="col-md-9">
            <div class="form-group row" v-if="xAxisCondition != 'lower than'">
                <label for="xGT" class="col-sm-6 form-check-label">
                    Greater than
                </label>
                <div class="col-sm-6">
                    <input type="text" id="xGT" class="form-control input-default form-control-sm" v-model="xGT"/>
                </div>
            </div>
            <div class="form-group row" v-if="xAxisCondition != 'greater than'">
                <label for="xLT" class="col-sm-6 form-check-label">
                        Less than
                </label>
                <div class="col-sm-6">
                    <input type="text" id="xLT" class="form-control input-default form-control-sm" v-model="xLT"/>
                </div>
            </div>
        </div>
    </div>
    <div class="label">
        Y axis field condition
    </div>
    <div class="row">
        <div class="col-md-3">
            Condition:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="yAxisCondition">
                <option value="greater than">Greater than</option>
                <option value="less than">Less than</option>
                <option value="and">AND</option>
                <option value="or">OR</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
        </div>
        <div class="col-md-9">
            <div class="form-group row" v-if="yAxisCondition != 'lower than'">
                <label for="yGT" class="col-sm-6 form-check-label">
                    Greater than
                </label>
                <div class="col-sm-6">
                    <input type="text" id="yGT" class="form-control input-default form-control-sm" v-model="yGT"/>
                </div>
            </div>
            <div class="form-group row" v-if="yAxisCondition != 'greater than'">
                <label for="yLT" class="col-sm-6 form-check-label">
                    Less than
                </label>
                <div class="col-sm-6">
                    <input type="text" id="yLT" class="form-control input-default form-control-sm" v-model="yLT"/>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Label dots if meet:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="dotLabelScore">
                <option :value="1">1 condition</option>
                <option :value="2">2 conditions</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Width:
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control input-default form-control-sm" v-model="width"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Height:
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control input-default form-control-sm" v-model="height"/>
        </div>
    </div>
<div class="row">
    <div class="col-md-3">
        Label:
    </div>
    <div class="col-md-9">
        <input type="text"
            class="form-control input-default form-control-sm"
        />
    </div>
</div>
<div class="row">
    <div class="col-md-3">
        In plot legend:
    </div>
    <div class="col-md-9">
        <textarea rows="6" class="form-control">
        </textarea>
    </div>
</div>
</template>
<script setup>
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(() => props.fields);
    const xAxisField = ref("");
    const xAxisLabel = ref("");
    const yAxisField = ref("");
    const yAxisLabel = ref("");
    const renderBy = ref("");
    const dotLabelScore = ref(1);
    const xAxisCondition = ref("greater than");
    const xGT = ref(0);
    const xLT = ref(0);
    const yAxisCondition = ref("greater than");
    const yGT = ref(0);
    const yLT = ref(0);
    const width = ref(800);
    const height = ref(400);
    const configObject = computed(() => {
        let config = {
            "type":"volcano plot",
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value,
            "y axis field": yAxisField.value,
            "y axis label": yAxisField.value,
            "render by": renderBy.value,
            "x condition": {
                "combination": xAxisCondition.value,
                "greater than": parseFloat(xGT.value),
                "lower than": parseFloat(xLT.value)
            },
            "y condition": {
                "combination": yAxisCondition.value,
                "greater than": parseFloat(yGT.value),
                "lower than": parseFloat(yLT.value)
            },
            "dot label score": dotLabelScore.value,
            "width": parseInt(width.value),
            "height": parseInt(height.value),
            "label": "Volcano Plot of Differentially Expressed Genes - High-risk vs Low-risk APOL1 genotype",
            "legend": "<span class='volcano-score-0'>&nbsp;</span> NS <span class='volcano-score-1'>&nbsp;</span> Log<sub>2</sub> FC <span class='volcano-score-2'>&nbsp;</span> p-value and log<sub>2</sub> FC<br>Genes with positive fold change are upregulated in high-risk samples",
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
</script>