<template>
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
            X Axis label<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Y Axis field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Y Axis label<sup class="required"> *</sup>
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
            Star key
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="starKey">
                <option value="">None</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Height
        </div>
        <div class="col-md-4">
            <input v-model="height" class="form-control input-default form-control-sm"
                @change="$event => height = toNumber($event.target.value)"/>
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
    <div class="label">
        Set region
    </div>
    <div class="row">
        <div class="col-md-2">
            Input type<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="inputType">
                <option value="from data">From data</option>
            </select>
        </div>
    </div>
    <div v-if="inputType == 'from data'" class="row">
        <div class="col-md-2">
            Chromosome field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="chrField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Position field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="posField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="label">
        LD server
    </div>
    <div class="row">
        <div class="col-md-2">
            Position field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="posField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Reference allele<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="refField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Alternative allele<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="altField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Reference variant field<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="refVarField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Fixed population<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="fixedPop">
                <option value="">Select a population</option>
                <option v-for="item in popOptions">{{ item }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Include genes track
        </div>
        <div class="col-md-2">
            <input type="checkbox" v-model="showGenesTrack"/>
        </div>
    </div>
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const store = useConfigBuilderStore();
    const runtimeConfig = useRuntimeConfig();
    const axios = useAxios(runtimeConfig, undefined, (error) => {
        console.log(error);
        throw new Error("Server Error");
    });
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(()=> store.allFields);
    const selectAllBox = ref(false);
    const xAxisField = ref("");
    const xAxisLabel = ref("");
    const yAxisField = ref("");
    const yAxisLabel = ref("");
    const renderBy = ref("");
    const inputType = ref("from data");
    const hoverContent = ref([]);
    const height = ref(200);
    const starKey = ref("");
    const chrField = ref("");
    const posField = ref("");
    const refField = ref("");
    const altField = ref("");
    const refVarField = ref("");
    const showGenesTrack = ref(true);
    const fixedPop = ref("");
    const popOptions = ref([]);
    const POPULATIONS_URL = "https://portaldev.sph.umich.edu/ld/genome_builds/GRCh37/references/1000G/populations";
    const VALIDATORS = [];
    const configObject = computed(() => {
        // Dynamic population has been removed as an option for now - we're working on it.
        let config = {
            "type":"region plot",
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value.trim(),
            "y axis field": yAxisField.value,
            "y axis label": yAxisLabel.value.trim(),
            "render by": renderBy.value,
            "height": parseInt(height.value),
            "star key": starKey.value,
            "ld server": {
                "pos": posField.value,
                "ref": refField.value,
                "alt": altField.value,
                "ref variant field": refVarField.value,
            }
        }
            if (hoverContent.value.length !== 0){
                config["hover content"] = hoverContent.value;
            }
            if (inputType.value === "from data"){
                config["region fields"] = {
                    "chromosome": chrField.value,
                    "position": posField.value
                }
            }
            if (!!showGenesTrack.value) {
                let genesTrack = {
                    "input type": inputType.value
                }
                if (inputType.value === "dynamic"){
                    genesTrack["dynamic parameter"] = "region";
                }
                if (inputType.value === "from data"){
                    genesTrack["region fields"] = config["region fields"];
                }
                config["genes track"] = genesTrack;
            }
        return config;
    });
    function readyToSave(){
        let check = {
            ready: false,
            msg: ""
        };
        if (xAxisField.value === "" || yAxisField.value === "" ){
            check.msg = "Specify fields for both axes.";
            return check;
        }
        if (xAxisLabel.value.trim() === "" || yAxisLabel.value === ""){
            check.msg = "Specify labels for both axes.";
            return check;
        }
        if (renderBy.value  === ""){
            check.msg = "Specify field to render by.";
            return check;
        }
        if (inputType.value === "from data" && chrField.value === ""){
            check.msg = "Specify chromosome field.";
            return check;
        }
        if (posField.value === "" ||
            refField.value === "" ||
            altField.value === "" ||
            refVarField.value === ""){
                check.msg = "Specify position, ref, alt, and reference variant fields.";
                return check;
            }
        if (fixedPop.value === ""){
            check.msg = "Specify fixed population.";
            return check;
        }
        check.ready = true;
        return check;
    }
    onMounted(async () => {
        await loadPopulationOptions();
    });
    watch(configObject, () =>{
        emit('updateVisualizer', configObject.value, readyToSave());
    });
    async function loadPopulationOptions(){
        let populations = (await axios.get(POPULATIONS_URL)).data;
        let popListStart = [];
        if (populations.data.includes("ALL")){
            popListStart.push("ALL");
            fixedPop.value = "ALL";
        }
        popOptions.value = popListStart.concat(populations.data.filter(item => item !== "ALL"));
    }
    function toggleSelectAll(){
        hoverContent.value = !selectAllBox.value ? [] : availableFields.value.slice();
    }
</script>