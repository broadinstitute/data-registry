<template>
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
        <div class="col-md-2">
            Render by:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="renderBy">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Hover content:
        </div>
        <table class="col-md-10">
            <tr>
                <th>
                    <input class="form-check-input" type="checkbox" 
                        v-model="selectAllBox" @change="toggleSelectAll()"/>
                    Select fields
                </th>
            </tr>
            <tr v-for="field in availableFields">
                <td>
                    <input class="form-check-input" type="checkbox" :value="field" id="flexCheckDefault" v-model="hoverContent"/>
                    <label class="form-check-label" for="flexCheckDefault">{{ field }}</label>
                </td>
            </tr>
        </table>
    </div>
    <div class="row">
        <div class="col-md-2">
            Link to:
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control input-default form-control-sm" v-model="linkTo"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Height:
        </div>
        <div class="col-md-10">
            <input type="number" class="form-control input-default form-control-sm" v-model="height"
            @change="parseHeight()"/>
        </div>
    </div>
</template>
<script setup>
    const xAxisField = ref("");
    const xAxisLabel = ref("");
    const yAxisField = ref("");
    const yAxisLabel = ref("");

    const configObject = computed(()=>{
        let config = {
            "type":"manhattan qq plot",
            "x axis field": xAxisField.value,
    "y axis field": "Log10PValue",
    "render by": "Gene",
    "m-plot y axis label": "-Log10(P-Value)",
    "m-plot x axis label": "Chromosome",
    "m-plot thresholds":["2.5e-6"],
    "qq-plot y axis label": "-Log10(P-Value)",
    "qq-plot x axis label": "Expected -Log10(P-Value)",
    "hover content": ["Region","P-Value"],
    "height": 150};
    return config;
    }
    );
</script>