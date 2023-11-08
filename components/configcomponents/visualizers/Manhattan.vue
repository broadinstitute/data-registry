<template>
    <div class="row">
        <div class="col-md-2">
            Graphic format<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="graphicFormat">
                <option>Vector</option>
                <option>Bitmap</option>
            </select>
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
        <div class="col-md-2">
            Height
        </div>
        <div class="col-md-4">
            <input class="form-control form-control-sm" v-model="height" 
                @change="$event => height = toNumber($event.target.value)"/>
        </div>
    </div>
    <div class="row" v-if="graphicFormat === 'Vector'">
        <div class="col-md-2">
            Link to
        </div>
        <div class="col-md-10">
            <input type="text" class="form-control input-default form-control-sm" v-model="linkTo"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Hover content
        </div>
        <table class="col-md-10" id="hover">
            <tr>
                <th>
                    <input class="form-check-input" type="checkbox" v-model="selectAllBox"
                        @change="hoverContent = !selectAllBox ? [] : availableFields"/>
                    <label class="label form-check-label">Select fields</label>
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
    
</template>
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const store = useConfigBuilderStore();
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(()=> store.allFields);
    const selectAllBox = ref(false);
    const graphicFormat = ref("Vector");
    const xAxisField = ref("");
    const yAxisField = ref("");
    const renderBy = ref("");
    const xAxisLabel = ref("");
    const yAxisLabel = ref("");
    const height = ref(null);
    const linkTo = ref("");
    const hoverContent = ref([]);
    const configString = computed(() => {
        let type = graphicFormat.value === "Vector" ? "manhattan plot" : "manhattan bitmap plot";
        let config = {
            "type": type,
            "x axis field": xAxisField.value,
            "y axis field": yAxisField.value,
            "render by": renderBy.value,
            "x axis label": xAxisLabel.value,
            "y axis label": yAxisLabel.value,
        };
        if (height.value !== null){
            config["height"] = height.value;
        }
        if (linkTo.value !== ""){
            config["link to"] = linkTo.value;
        }
        if (hoverContent.value.length > 0){
            config["hover content"] = hoverContent.value;
        }
        return JSON.stringify(config);
    });
    const VALIDATORS = [
        { condition: () => xAxisField.value === "" || yAxisField.value === "", msg: "Specify fields for both axes."},
        { condition: () => renderBy.value === "", msg: "Specify field to render by."},
        { condition: () => xAxisLabel.value === "" || yAxisLabel.value === "", msg: "Specify labels for both axes."}
    ];
    watch(configString, () =>{
        emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
    });
</script>