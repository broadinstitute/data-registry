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
										<option v-for="item in Object.keys(filterTypeOptions)">
											{{ filterTypeOptions[item] }}
										</option>
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
									<button class="btn btn-warning btn-sm" type="button" @click="clearAll()">
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
								<div class="col-md-12 col">
									<div class="label">
										Filter order
									</div>
									<tbody class="dr-byor-data-columns">
										<tr v-for="filter, index in allFilters" class="arrow-button-list filter-row">
											<td>
												{{ filter.label }}
											</td>			
											<td class="arrow-button-holder">
												<button class="btn btn-primary arrow-button arrow-button-up" 
													:disabled="index == 0" @click="moveUpDown(index)">
														&uarr;
												</button>
											</td>
											<td class="arrow-button-holder">
												<button class="btn btn-primary arrow-button"
												:disabled="index == allFilters.length - 1" @click="moveUpDown(index, true)">
													&darr;
												</button>
											</td>
											<td>
												<span class="editing-large" v-if="editingFilterIndex == index">Editing</span>
                   								<a v-else @click="editFilter(index)"><span class="edit-large">Edit</span></a>
											</td>
										</tr>
									</tbody>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="card-body dr-form">
			<h5>Filter format output</h5>
			<div class="row dr-builder-ui">
				<div class="col-md-10">
					<pre class="output">{{ JSON.stringify(allFilters) }}</pre>
				</div>
				<div class="col-md-2">
					<button class="btn btn-primary btn-sm" type="button" @click="copyFilterConfig">
                    	Copy configuration
                	</button>
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
	const filterTypeOptions = {
		"search": "Search",
		"search greater than": "Search greater than",
		"search lower than": "Search less than",
		"search or": "Search or",
		"search and": "Search and",
		"dropdown": "Dropdown"
	};
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
		let thisFilter = JSON.parse(JSON.stringify(singleFilterConfig.value));
		if (editingFilterIndex.value != -1){
			allFilters.value[editingFilterIndex.value] = thisFilter;
		} else {
			allFilters.value.push(thisFilter);
		}
		clearAll();
	}
	function clearAll(){
		console.log("Clearing all");
		editingFilterIndex.value = -1;
		message.value = "";
		selectedField.value = null;
		selectedFilterType.value = null;
		labelInBubble.value = false;
		filterLabel.value = "";
	}
	function editFilter(index){
		editingFilterIndex.value = index;
		let filterContent = JSON.parse(JSON.stringify(allFilters.value[index]));
		selectedField.value = filterContent.field;
		filterLabel.value = filterContent.label;
		selectedFilterType.value = filterTypeOptions[filterContent.type];
		labelInBubble.value = filterContent["label in bubble"] == "true";
	}

	function deleteFilter(){
		if (editingFilterIndex.value != -1){
			allFilters.value.splice(editingFilterIndex.value, 1);
		}
		clearAll();
	}
	function moveUpDown(index, down=false){
		if (down){ index++; }
		let risingItem = allFilters.value[index];
		allFilters.value.splice(index, 1);
		allFilters.value.splice(index-1, 0, risingItem);
	}

	function copyFilterConfig(){
		navigator.clipboard.writeText(JSON.stringify(allFilters.value));
	}
</script>