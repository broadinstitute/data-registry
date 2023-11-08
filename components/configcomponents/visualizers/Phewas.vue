<template>
    <div class="row">
        <div class="col-md-2">
            Y axis field <sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="yAxisField">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
        <div class="col-md-2">
            Y axis label <sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input type="text" v-model="yLabel"
                class="form-control input-default form-control-sm"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Decimal places<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <input v-model="yDecimal"
                class="form-control input-default form-control-sm"
                @change="$event => yDecimal = toNumber($event.target.value, true)"/>
        </div>
        <div class="col-md-6">
            <div class="form-check form-check-inline">
                <label class="form-check-label" for="flexCheckDefault">
                        Convert Y axis value to -log10
                </label>
                <input
                    class="form-check-input" type="checkbox" :value="false"
                    id="flexCheckDefault" v-model="convertLog"/>
            </div>
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
            Group by<sup class="required"> *</sup>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm" v-model="groupBy">
                <option value="">Select a field</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            Beta field
            <small>(direction)</small>
        </div>
        <div class="col-md-4">
            <select class="form-control form-control-sm">
                <option value="">None</option>
                <option v-for="field in availableFields">{{ field }}</option>
            </select>
        </div>
    </div>
    <div class="row">
            <div class="col-md-2">
                Thresholds
            </div>
            <div class="col-md-4 col">
                <table>
                    <tr v-for="(, index) in thresholds">
                        <td>
                            <input class="form-control form-control-sm" :value="thresholds[index]"
                                :id="`threshold_${index}`"
                                @change="updateThresholds(index, $event.target.value)"/>
                        </td>
                        <td>
                            <button class="btn btn-secondary replace-chars-button delete-button"
                                @click="thresholds.splice(index, 1)">&times;
                            </button>
                        </td>
                    </tr>
                </table>
			<button class="btn btn-primary" @click="thresholds.push(0)">Add</button>
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
</template>
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const store = useConfigBuilderStore();
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(()=> store.allFields);
    const selectAllBox = ref(false);
    const yAxisField = ref("");
    const convertLog = ref(false);
    const yDecimal = ref(2);
    const yLabel = ref("");
    const groupBy = ref("");
    const renderBy = ref("");
    const hoverContent = ref([]);
    const betaField = ref("");
    const height = ref(null);
    const thresholds = ref([null]);
    const VALIDATORS = [
        { condition: () => yAxisField.value === "", msg: "Specify Y axis field"},
        { condition: () => yLabel.value === "", msg: "Specify Y axis label"},
        { condition: () => yDecimal.value === null, msg: "Specify decimal places"},
        { condition: () => renderBy.value === "", msg: "Specify field to render by"},
        { condition: () => groupBy.value === "", msg: "Specify field to group by"},
        { condition: () => hasNullValues(thresholds.value), msg: "Fill in missing threshold value"}
    ];
    const configString = computed(() => {
        let config =  {
            "type":"phewas plot",
            "y axis field": yAxisField.value,
            "y axis label": yLabel.value,
            "y ticks decimal point": yDecimal.value,
            "render by": renderBy.value,
            "group by": groupBy.value,
            "convert y -log10": `${convertLog.value}`,
            "hover content": hoverContent.value,
            }
        // Phenotype map can only be added administratively.
        if (height.value !== null){
            config["height"] = height.value;
        }
        if (betaField.value !== ""){
            config["beta field"] = betaField.value;
        }
        if (thresholds.value.length > 0){
            config["thresholds"] = thresholds.value
        }
        return JSON.stringify(config);
    });
    function updateThresholds(index, str){
        let numberValue = toNumber(str);
        thresholds.value[index] = numberValue;
        let inputField = document.getElementById(`threshold_${index}`);
        inputField.value = numberValue;
    }
    watch(configString, () =>{
        emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
    });
</script>