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
            X Axis label:
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control input-default form-control-sm" v-model="xAxisLabel"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Y Axis field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Y Axis label:
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
    <div class="row">
        <div class="col-md-2">
            Hover content:
        </div>
        <table class="col-md-10">
            <tr>
                <th>
                    <input class="form-check-input" type="checkbox" 
                        v-model="selectAllBox" @change="toggleSelectAll()"/>
                </th>
                <th>
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
            Height:
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control input-default form-control-sm" v-model="height"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Star key:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="starKey">
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
            Position field:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="positionField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Reference allele:
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
            Alternative allele:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="altField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Reference variant field:
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
            Fixed population:
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="refVarField">
                <option value="">Select a population</option>
                <option v-for="item in popOptions">{{ item }}</option>
            </select>
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
    const runtimeConfig = useRuntimeConfig();
    const axios = useAxios(runtimeConfig, undefined, (error) => {
        console.log(error);
        throw new Error("Server Error");
    });
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(() => props.fields);
    const selectAllBox = ref(false);
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
    const fixedPop = ref("");
    const popOptions = ref([]);
    const POPULATIONS_URL = "https://portaldev.sph.umich.edu/ld/genome_builds/GRCh37/references/1000G/populations";
    const configObject = computed(() => {
        // Dynamic population has been removed as an option for now - we're working on it.
        let config = {
            "type":"region plot",
            "x axis field": xAxisField.value,
            "x axis label": xAxisLabel.value,
            "y axis field": yAxisField.value,
            "y axis label": yAxisLabel.value,
            "render by": renderBy.value,
            "height": parseInt(height.value),
            "star key": starKey.value,
            "ld server": {
                "pos": positionField.value,
                "ref": refField.value,
                "alt": altField.value,
                "ref variant field": refVarField.value,
            }
        }
            if (hoverContent.value.length !== 0){
                config["hover content"] = hoverContent.value;
            }
        return config;
    });
    onMounted(async () => {
        console.log("Loading population options");
        await loadPopulationOptions();
    });
    watch(configObject, () =>{
        emit('updateVisualizer', JSON.stringify(configObject.value));
    });
    async function loadPopulationOptions(){
        let populations = (await axios.get(POPULATIONS_URL)).data;
        let popListStart = populations.data.includes("ALL") ? ["ALL"] : [];
        popOptions.value = popListStart.concat(populations.data.filter(item => item !== "ALL"));
    }
    function toggleSelectAll(){
        console.log("Select all");
    }
</script>