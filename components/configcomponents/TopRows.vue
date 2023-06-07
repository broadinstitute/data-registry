<template>
    <h5>Top rows
        <sup class="optional">Tutorial</sup>
    </h5>
        <div class="row dr-builder-ui">
            <div class="col-md-3 col">
                <div class="label">Output</div>
                <pre class="output">{{ JSON.stringify(selectedFields) }}</pre>
            </div>
            <div class="col-md-3 col">
                <div class="label">
                    Select rows
                </div>
                <ul class="dr-byor-data-columns">
                    <li v-for="field in availableFields" class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" :value="field" 
                                id="flexCheckDefault" v-model="selectedFields"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6 col">
			<div class="label">
				Selected rows | Change order
			</div>
			<tbody class="dr-byor-data-columns">
				<tr v-for="field, index in selectedFields" class="arrow-button-list">
					{{ field }}
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUp(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedFields.length - 1" @click="moveDown(index)">
						&darr;
						</button>
					</td>
				</tr>
			</tbody>
		    </div>
        </div>
    
</template>
<style scoped>
    @import "public/css/mdkp.css";
    @import "public/css/configbuilder.css";
</style>
<script setup>
    import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const emit = defineEmits(["topRowsChanged"]);
    const availableFields = computed(()=> props.fields);
    const selectedFields = ref([]);
    const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1])
    watch (availableFields, (newFields, oldFields)=> {
        if (newFields.length < oldFields.length){
            oldFields.forEach((oldField)=>{
                if (!newFields.includes(oldField)){
                    selectedFields.value = 
                        selectedFields.value.filter(field => field != oldField);
                }
            });
        }
    });
    watch(fieldNameOld, () => {
        // Field names are already updated within the list of available fields.
        // We need to update it in the list of selected fields.
        if (selectedFields.value.includes(fieldNameOld.value)){
            let index = selectedFields.value.indexOf(fieldNameOld.value);
            selectedFields.value[index] = fieldNameNew.value;
        }
    });
    function moveUp(index){
		let beginning = selectedFields.value.slice(0, index-1);
		let risingItem = selectedFields.value[index];
		let fallingItem = selectedFields.value[index-1]
		let end = selectedFields.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedFields.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = selectedFields.value.slice(0, index);
		let risingItem = selectedFields.value[index+1];
		let fallingItem = selectedFields.value[index]
		let end = selectedFields.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedFields.value = beginning.concat(end);
	}
    watch(selectedFields, () => emit("topRowsChanged", selectedFields.value));
</script>