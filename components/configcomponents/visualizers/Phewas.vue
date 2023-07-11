<template>
    <div class="row">
        <div class="col-md-3">
            Y axis field:
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
        </div>
        <div class="col-md-9">
            <div class="form-check form-check-inline">
                <input
                    class="form-check-input" type="checkbox" :value="false"
                    id="flexCheckDefault" v-model="convertLog"/>
                <label class="form-check-label" for="flexCheckDefault">
                    <small>
                        Convert y axis value to -log10
                    </small>
                </label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
        </div>
        <div class="col-md-9">
            <div class="row">
                <div class="col-md-8">
                    <small>
                        Places to render after decimal point:
                    </small>
                </div>
                <div class="col-md-4">
                    <input type="number" v-model="yDecimal"
                        class="form-control input-default form-control-sm"/>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Y axis label:
        </div>
        <div class="col-md-9">
            <input type="text" v-model="yLabel"
                class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Beta field
            <small>(Direction)</small>
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm">
                <option value="">None</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
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
    <div class="row">
        <div class="col-md-3">
            Group by:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="groupBy">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Thresholds
            <small>(separate with ,)</small>
        </div>
        <div class="col-md-9">
            <input type="text" v-model="thresholds" class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Hover content:
        </div>
        <div class="col-md-9">
            <div v-for="field in availableFields" class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" :value="field" id="flexCheckDefault" v-model="hoverContent"/>
                <label class="form-check-label" for="flexCheckDefault">{{ field }}</label>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Height:
        </div>
        <div class="col-md-9">
            <input type="number" v-model="height" class="form-control input-default form-control-sm"/>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const availableFields = computed(() => props.fields);
    const yAxisField = ref("");
    const convertLog = ref(false);
    const yDecimal = ref(2);
    const yLabel = ref("");
    const groupBy = ref("");
    const renderBy = ref("");
    const hoverContent = ref([]);
    const betaField = ref("");
    const height = ref(500);
    const thresholds = ref("");
    const configObject = computed(() => {
        let config =  {
            "type":"phewas plot",
            "group by": groupBy.value,
            "y axis field": yAxisField.value,
            "convert y -log10": convertLog.value ? "true" : "false",
            "y ticks decimal point": parseInt(yDecimal.value),
            "render by": renderBy.value,
            "y axis label": yLabel.value,
            "hover content": hoverContent.value,
            "thresholds": thresholds.value, // we will figure out how to do thresholds
            "height": parseInt(height.value),
            "star key":"phenotype"
            }
        // Phenotype map can only be added administratively.
        if (betaField.value != ""){
            config["beta field"] = betaField.value;
        }
        return config;
    });
</script>