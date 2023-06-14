<template>
    <h4>
		Filters
	</h4>
	<a href="https://hugeampkpncms.org/node/53" target="_blank" class="tutorial-link">
        Data Convert tutorial
    </a>
		<div class="row">
			<div class="col-md-12 col">
				<div>
					<div title="Builder">
						<div class="row">
							<div class="col-md-7">
								<div class="row dr-builder-ui">
									<div class="col-md-3 col">
										<div class="label">
											Select field
										</div>
										<select class="form-control" v-model="selectedField">
											<option v-for="field in availableFields">
												{{field}}
											</option>
										</select>
									</div>
									<div class="col-md-3 col">
										<div class="label">
											Filter type
										</div>
										<select class="form-control" v-model="selectedFilterType">
											<option v-for="item in filterTypeOptions">{{ item }}</option>
										</select>
									</div>
									<div class="col-md-3 col">
										<div class="label">
											Label
										</div>
										<input type="text" class="form-control input-default" v-model="filterLabel"/>
										<input class="form-check-input" type="checkbox" 
                                			id="flexCheckDefault" v-model="labelInBubble"/>
                            			<span class="form-check-label" for="flexCheckDefault"> Label in bubble</span>
									</div>
									<div class="col-md-3 col">
										<button class="btn btn-primary btn-sm" type="button" @click="saveFilter()">
											Save
										</button>
										<button class="btn btn-warning btn-sm" type="button" @click="cancelFilterEdit()">
											Cancel
										</button>
										<button class="btn btn-danger btn-sm" type="button" @click="deleteFilter()">
											Delete
										</button>
										<div class="failed-save">{{ message }}</div>
									</div>
								</div>
							</div>
							<div class="col-md-5">
								<div class="row dr-builder-ui">
									<div class="col-md-6 col">
										<div class="label">
											Filter order
										</div>
										<tbody class="dr-byor-data-columns">
											<tr v-for="filter, index in allFilters" class="arrow-button-list">
												{{ filter.label }}
												<td class="arrow-button-holder">
													<button class="btn btn-primary arrow-button arrow-button-up" 
														:disabled="index == 0" @click="moveUp(index)">
															&uarr;
													</button>
												</td>
												<td class="arrow-button-holder">
													<button class="btn btn-primary arrow-button"
													:disabled="index == allFilters.length - 1" @click="moveDown(index)">
														&darr;
													</button>
												</td>
											</tr>
										</tbody>
										<!--ul class="dr-byor-data-columns">
											<li>Variant ID (<a>Edit</a>)
												<label>
													<select class="form-control">
														<option>0</option>
														<option>1</option>
													</select>
												</label>
											</li>
											<li>P-Value (<a>Edit</a>)
												<label>
													<select class="form-control">
														<option>0</option>
														<option>1</option>
													</select>
												</label>
											</li>
										</ul-->
									</div>
									<div class="col-md-6 col">
										<div class="label">
											Filter width
										</div>
										<select class="form-control" v-model="filterWidth">
											<option value="small">Small</option>
											<option value="medium">Medium (default)</option>
											<option value="large">Large</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="label">Output</div>
					<pre>{{ JSON.stringify(singleFilterConfig)}}</pre>
					<pre>{{ JSON.stringify(allFilters) }}</pre>
				</div>
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
import { all } from "axios";
    const props = defineProps({fields: Array, fieldNameUpdate: Array});
    const availableFields = computed(() => props.fields);
    const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1]);
	const message = ref("");
	const editingFilterIndex = ref(-1);
	const selectedField = ref(null);
	const selectedFilterType = ref(null);
	const labelInBubble = ref(false);
	const filterLabel = ref("");
	const filterWidth = ref("medium");
	const singleFilterConfig = ref({
		"field": null,
		"label": "",
		"type": null,
		"label in bubble": "false"
	});
	const filterTypeOptions = [
		"Search",
		"Search greater than",
		"Search lower than",
		"Search or",
		"Search and",
		"Dropdown"
	];
	const allFilters = ref([]);
    watch(availableFields, () => console.log(JSON.stringify(availableFields.value)));
    watch(fieldNameOld, () => {
		if (selectedField.value == fieldNameOld.value){
			selectedField.value = fieldNameNew.value;
		}
		allFilters.value.forEach(item => {
			if(item.field == fieldNameOld.value){
				item.field = fieldNameNew.value;
			}
		});
	});
	watch(selectedField, () => singleFilterConfig.value["field"] = selectedField.value);
	watch(filterLabel, () => singleFilterConfig.value["label"] = filterLabel.value.trim());
	watch(selectedFilterType, () => singleFilterConfig.value["type"] = 
		selectedFilterType.value == null ? "" : selectedFilterType.value.toLowerCase());
	watch(labelInBubble, () => singleFilterConfig.value["label in bubble"] = `${labelInBubble.value}`);
	function saveFilter(){
		if (singleFilterConfig.value["field"] == null){
			message.value = "Select a field to filter.";
			return;
		}
		if (singleFilterConfig.value["label"] == ""){
			message.value = "Enter a filter label.";
			return;
		}
		if (singleFilterConfig.value["type"] == null || 
				singleFilterConfig.value["type"] == ""){
			message.value = "Select a filter type.";
			return;
		}
		allFilters.value.push(JSON.parse(JSON.stringify(singleFilterConfig.value)));
		clearAll();
	}
	function clearAll(){
		message.value = "";
		selectedField.value = null;
		selectedFilterType.value = null;
		labelInBubble.value = false;
		filterLabel.value = "";
	}
	function cancelFilterEdit(){
		if (editingFilterIndex.value == -1){
			clearAll();
			return;
		}
	}
	function deleteFilter(){
		if (editingFilterIndex.value == -1){
			clearAll();
			return;
		}
	}
	function moveUp(index){
		let beginning = allFilters.value.slice(0, index-1);
		let risingItem = allFilters.value[index];
		let fallingItem = allFilters.value[index-1]
		let end = allFilters.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		allFilters.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = allFilters.value.slice(0, index);
		let risingItem = allFilters.value[index+1];
		let fallingItem = allFilters.value[index]
		let end = allFilters.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		allFilters.value = beginning.concat(end);
	}
</script>