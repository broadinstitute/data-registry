<template>
    <div class="row">
        <div class="col-md-3">
            Graphic format:
        </div>
        <div class="col-md-9">
            <select class="form-control form-control-sm" v-model="graphicFormat">
                <option>Vector</option>
                <option>Bitmap</option>
            </select>
        </div>
    </div>
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
            X Axis label:
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
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
            Link to:
        </div>
        <div class="col-md-9">
            <input type="text" class="form-control input-default form-control-sm" v-model="linkTo"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            Height:
        </div>
        <div class="col-md-9">
            <input type="number" class="form-control input-default form-control-sm" v-model="height"
            @change="parseHeight()"/>
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
    const graphicFormat = ref("Vector");
    const xAxisField = ref("");
    const yAxisField = ref("");
    const renderBy = ref("");
    const xAxisLabel = ref("");
    const yAxisLabel = ref("");
    const height = ref(250);
    const linkTo = ref("");
    const hoverContent = ref([]);
    // Do we want to bother checking that they aren't the same field?
    const configObject = computed(() => {
        let type = graphicFormat.value === "Vector" ? "manhattan plot" : "manhattan bitmap plot";
        let config = {
            "type": type,
            "x axis field": xAxisField.value,
            "y axis field": yAxisField.value,
            "render by": renderBy.value,
            "x axis label": xAxisLabel.value,
            "y axis label": yAxisLabel.value,
            "height": height.value,
            "link to": linkTo.value, // is this optional?
            "hover content": hoverContent.value
        };
        return config;
    });
    function readyToSave(){
        let check = {
			ready: false,
			msg: ""
		};
        if (xAxisField.value === "" || yAxisField.value === ""){
            check.msg = "Specify fields for both axes.";
            return check;
        }
        if (renderBy.value === ""){
            check.msg = "Specify field to render by.";
            return check;
        }
        if (xAxisLabel.value === "" || yAxisLabel.value === ""){
            check.msg = "Specify labels for both axes.";
            return check;
        }
        check.ready = true;
        return check;
    }
    function parseHeight(){
        let numHeight = parseInt(height.value);
        if (isNaN(numHeight)){
            height.value = 250;
            return;
        }
        height.value = numHeight;
    }
    watch(configObject, () =>{
        emit('updateVisualizer', JSON.stringify(configObject.value), readyToSave());
    });
</script>