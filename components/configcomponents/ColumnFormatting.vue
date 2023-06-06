<template>
	<h5>
		Column formatting
		<sup class="optional">Tutorial</sup>
	</h5>
	<div class="row dr-builder-ui">
		<div class="col-md-3 col">
            <div class="label">Output</div>
            <pre class="output">{{ singleColumnConfigString }}</pre>
            <pre class="output">{{ allColumnsConfigString }}</pre>
        </div>
		<div class="col-md-2 col">
                <div class="label">
                    Select column
                </div>
                <ul class="dr-byor-data-columns">
                    <li v-for="field in availableFields" class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="column" :value="field" 
                                id="flexCheckDefault" v-model="selectedColumn"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                    </li>
                </ul>
            </div>
		<div class="col-md-2 col">
			<div class="label">
				Select formatting options
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="formatOption in Object.keys(formatOptions)" class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" :value="formatOption" 
                                id="flexCheckDefault" v-model="selectedOptions"/>
                            <span class="form-check-label" for="flexCheckDefault">{{ formatOptions[formatOption] }}</span>
                    </li>
			</ul>
		</div>
		<div class="col-md-2 col">
			<div class="label">
				Selected options | Change formatting order
			</div>
			<tbody class="dr-byor-data-columns">
				<tr v-for="option, index in selectedOptions" class="arrow-button-list">
					{{ formatOptions[option] }}
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button arrow-button-up" 
							:disabled="index == 0" @click="moveUp(index)">
							&uarr;
						</button>
					</td>
					<td class="arrow-button-holder">
						<button class="btn btn-primary arrow-button"
						:disabled="index == selectedOptions.length - 1" @click="moveDown(index)">
						&darr;
						</button>
					</td>
				</tr>
			</tbody>
		</div>
		<div class="col-md-2 col">	
			<div v-if="selectedOptions.includes('link')" id="linkFormat">
				<div class="label">
					Link
				</div>
				<div class="form-inline">
					<span>Link to:</span>
					<input type="text" class="form-control form-control-sm input-default" 
						style="width: 80%; margin-left: 5px;"/>
				</div>
														<div
															class="form-inline"
														>
															<div
																class="
																	form-check
																"
																style="
																	margin-right: 10px;
																"
															>
																<input
																	class="
																		form-check-input
																	"
																	type="checkbox"
																	value=""
																/>
																<label
																	class="
																		form-check-label
																	"
																	for=""
																>
																	New tab
																</label>
															</div>
															<div
																class="
																	form-check
																"
															>
																<input
																	class="
																		form-check-input
																	"
																	type="checkbox"
																	value=""
																/>
																<label
																	class="
																		form-check-label
																	"
																	for=""
																>
																	As button
																</label>
															</div>
														</div>
														<div
															class="form-inline"
														>
															<span
																>Button label:
															</span>

															<input
																type="text"
																class="
																	form-control
																	form-control-sm
																	input-default
																"
																style="
																	width: 80%;
																	margin-left: 5px;
																"
															/>
														</div>
			</div>
			<div v-if="selectedOptions.includes('render background percent')">
				<div class="label">
					Render background %
				</div>
				<div class="form-inline">
					<span>Percent if no value:</span>
					<input type="text" class="form-control form-control-sm input-default"
						style="width: 50%; margin-left: 5px;"/>
				</div>
			</div>
			<div v-if="selectedOptions.includes('fixed')">
				<div class="label">
				Fixed after decimal point
			</div>
				<div class="form-inline">
					<span>Place </span>
					<select class="form-control form-control-sm" v-model="fixedPlaces"
							style=" width: 50%; margin-left: 5px;">
						<option v-for="i in 9">{{ i + 1 }}</option>
					</select>
				</div>
			</div>
		</div>
		<div class="col-md-1 col">
													<button
														class="
															btn
															btn-primary
															btn-sm
														"
														type="button"
													>
														Save
													</button>
													<button
														class="
															btn
															btn-warning
															btn-sm
														"
														type="button"
													>
														Cancel
													</button>
													<button
														class="
															btn
															btn-danger
															btn-sm
														"
														type="button"
													>
														Delete
													</button>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12 col text-center dr-bubbles-wrapper">
			<div class="dr-format-bubble">
				<span class="name">Variant ID</span>
				<span class="type">link</span>
				<span class="edit">Edit</span>
			</div>
			<div class="dr-format-bubble">
				<span class="name">P-Value </span>
				<span class="type">Sceintific notation, render background %</span>
				<span class="edit">Edit</span>
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
    const availableFields = computed(()=> props.fields);
    const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1]);
	const formatOptions = {
		"link": "Link",
		"js math": "JavaScript math",
		"scientific notation": "Scientific notation",
		"fixed": "Fixed decimal",
		"direction triangle": "Direction triangle",
		"render background percent": "Render background %",
		"render background percent negative": "Render background % (negative)"
	}
	const selectedColumn = ref(null);
	const selectedOptions = ref([]);
	const fixedPlaces = ref(2);
	const selectedOptionsMod = computed(()=> selectedOptions.value.map(
			item => item == "fixed" ? `fixed ${fixedPlaces.value}` : item
		));
	const singleColumnConfig = ref({
		"type": []
	});
	const singleColumnConfigString = computed(()=> `"${selectedColumn.value}": ${JSON.stringify(singleColumnConfig.value)}`);
	const allColumnsConfig = ref({});
	const allColumnsConfigString = computed(() => JSON.stringify(allColumnsConfig.value));
	// make sure clicking a bubble is the same as clicking edit
	watch([selectedOptions, fixedPlaces], ()=>{
		singleColumnConfig.value["type"] = selectedOptionsMod.value;
	});
	function moveUp(index){
		let beginning = selectedOptions.value.slice(0, index-1);
		let risingItem = selectedOptions.value[index];
		let fallingItem = selectedOptions.value[index-1]
		let end = selectedOptions.value.slice(index + 1);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedOptions.value = beginning.concat(end);
	}
	function moveDown(index){
		let beginning = selectedOptions.value.slice(0, index);
		let risingItem = selectedOptions.value[index+1];
		let fallingItem = selectedOptions.value[index]
		let end = selectedOptions.value.slice(index + 2);
		beginning.push(risingItem);
		beginning.push(fallingItem);
		selectedOptions.value = beginning.concat(end);
	}
</script>