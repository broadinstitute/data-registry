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
            <input type="number" class="form-control input-default form-control-sm" v-model="height"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Star key:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="starKey">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Zoom:
        </div>
        <div class="col-md-9">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="zoom" id="flexCheckDefault"/>
            </div>
        </div>
    </div>
    <div class="label">
        LD server
    </div>
    <div class="row">
        <div class="col-md-3">
            Position field:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="positionField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Reference allele:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="refField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Alternative allele:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="altField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Reference variant field:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="refVarField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Populations type:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="popType">
                <option value="static">Static</option>
                <option value="dynamic">Dynamic</option>
            </select>
        </div>
    </div>
    <div v-if="popType == 'dynamic'">
        <div class="row">
            <div class="col-md-3">
                Populations parameter:
            </div>
            <div class="col-md-9">
                <input type="text" class="form-control input-default form-control-sm" v-model="popParam"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                Populations ids:
            </div>
        <div class="col-md-9">
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAll" class="col-sm-2 form-check-label">
                    ALL
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAll"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popEur" class="col-sm-2 form-check-label">
                    EUR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popEur"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAfr" class="col-sm-2 form-check-label">
                    AFR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAfr"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popEas" class="col-sm-2 form-check-label">
                    EAS
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popEas"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAmr" class="col-sm-2 form-check-label">
                    AMR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAmr"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popSas" class="col-sm-2 form-check-label">
                    SAS
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popSas"
                    />
                </div>
            </div>
        </div>
</div>
    </div>
    <div class="row" v-else>
        <div class="col-md-3">
            Populations ids:
        </div>
        <div class="col-md-9">
            <div>
                <label class="form-check-label">
                    Check only 1 if type static
                </label>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAll" class="col-sm-2 form-check-label">
                    ALL
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAll"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popEur" class="col-sm-2 form-check-label">
                    EUR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popEur"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAfr" class="col-sm-2 form-check-label">
                    AFR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAfr"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popEas" class="col-sm-2 form-check-label">
                    EAS
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popEas"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popAmr" class="col-sm-2 form-check-label">
                    AMR
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popAmr"
                    />
                </div>
            </div>
            <div class="form-group row">
                <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                />
                <label for="popSas" class="col-sm-2 form-check-label">
                    SAS
                </label>
                <div class="col-sm-7">
                    <input
                        type="text"
                        class="form-control input-default form-control-sm"
                        id="popSas"
                    />
                </div>
            </div>
        </div>
    </div>
<div class="label">
    Genes track
</div>
<div class="row">
    <div class="col-md-3">
        Input type:
    </div>
    <div class="col-md-9">
        <select class="form-control form-control-sm">
            <option>Static</option>
            <option>Dynamic</option>
            <option>From data</option>
        </select>
    </div>
</div>
<!-- if input type static -->
<div class="row">
    <div class="col-md-6">
        Region (chromosome:start-end):
    </div>
    <div class="col-md-6">
        <input
            type="text"
            class="form-control input-default form-control-sm"
        />
    </div>
</div>
<!-- if input type dynamic -->
<div class="row">
    <div class="col-md-6">
        Region parameter:
    </div>
    <div class="col-md-6">
        <input
            type="text"
            class="form-control input-default form-control-sm"
        />
    </div>
</div>
<!-- if input type from data -->
<div class="row">
    <div class="col-md-12">
        Required fields in data: chromosome, position
    </div>
</div>
<div class="row">
    <div class="col-md-3">
        Height:
    </div>
    <div class="col-md-9">
        <input
            type="text"
            class="form-control input-default form-control-sm"
        />
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
    const hoverContent = ref([]);
    const height = ref(200);
    const starKey = ref("");
    const zoom = ref(true);
    const positionField = ref("");
    const refField = ref("");
    const altField = ref("");
    const refVarField = ref("");
    const popField = ref("");
    const popType = ref("dynamic");
    const popParam = ref("");
    const configObject = computed(() => {
        let config = {
            "type":"region plot",
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value,
            "y axis field": yAxisField.value,
            "y axis label": yAxisLabel.value,
            "render by": renderBy.value,
            "hover content": hoverContent.value,
            "height": parseInt(height.value),
            "zoom": zoom.value ? "true" : false,
            "star key": starKey.value,
            "ld server": {
                "pos": positionField.value,
                "ref": refField.value,
                "alt": altField.value,
                "ref variant field": refVarField.value,
        "populations field":"Ancestry",
                "populations type": popType.value,
    "populations":{"Mixed":"ALL","EU":"EUR","AA":"AFR","EA":"EAS","HS":"AMR","SA":"SAS"}},
    "genes track":{"input type":"dynamic","dynamic parameter":"region"}
            }
        return config;
    });
    watch(configObject, () =>{
        emit('updateVisualizer', JSON.stringify(configObject.value));
    });
</script>