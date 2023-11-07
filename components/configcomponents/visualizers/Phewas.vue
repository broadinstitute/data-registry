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
            <input type="number" v-model="yDecimal"
                        class="form-control input-default form-control-sm"/>
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
				<tr v-for="(,index) in thresholds">
					<td>
						<input class="form-control form-control-sm input-default"
							:value="thresholds[index]"
                            @change="thresholds[index] = toNumber($event.target.value)"/>
					</td>
					<td>
						<button class="btn btn-secondary replace-chars-button delete-button"
							v-if="thresholds.length > 1" 
                            @click="thresholds.splice(index, 1);">&times;
						</button>
					</td>
				</tr>
			</table>
			<button class="btn btn-primary" @click="thresholds.push(0)">Add</button>
		</div>
        </div>
    <div class="row">
        <div class="col-md-3">
            Hover content
        </div>
        <div class="col-md-9">
            <div v-for="field in availableFields" class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" :value="field" id="flexCheckDefault" v-model="hoverContent"/>
                <label class="form-check-label" for="flexCheckDefault">{{ field }}</label>
            </div>
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
</template>
<script setup>
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["updateVisualizer"]);
    const availableFields = computed(() => props.fields);
    const yAxisField = ref("");
    const convertLog = ref(false);
    const yDecimal = ref(2);
    const yLabel = ref("");
    const groupBy = ref("");
    const renderBy = ref("");
    const hoverContent = ref([]);
    const betaField = ref("");
    const height = ref(null);
    const thresholds = ref([0]);
    const VALIDATORS = [];
    const configString = computed(() => {
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
            }
        // Phenotype map can only be added administratively.
        if (betaField.value != ""){
            config["beta field"] = betaField.value;
        }
        return JSON.stringify(config);
    });
    watch(configString, () =>{
        emit('updateVisualizer', configString.value, readyToSave(VALIDATORS));
    });
</script>