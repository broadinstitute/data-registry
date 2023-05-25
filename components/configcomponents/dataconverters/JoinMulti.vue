<template>
    <div class="row" id="joinMultiConfig">
		<div class="col-md-4 col">
			<div class="label">
				Join multi | Select field(s)
		</div>
		<ul class="dr-byor-data-columns">
			<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="checkbox" :value="rawField" 
                        id="flexCheckDefault" v-model="selectedFields"/>
					<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
			</li>
		</ul>
		<button @click="()=>selectedFields=[]" class="btn btn-primary">Clear selection</button>
	</div>
	<div class="col-md-4 col">
		<div class="label">
			Selected fields
		</div>
		<ul class="dr-byor-data-columns">
			<li v-for="field, index in selectedFields" class="arrow-button-list">
				{{ field }}
				<div class="arrow-button-holder">
					<button class="btn btn-primary arrow-button"
					:disabled="index == selectedFields.length - 1" @click="moveDown(index)">
					&darr;
					</button>
				</div>
				<div class="arrow-button-holder">
					<button class="btn btn-primary arrow-button" :disabled="index == 0"
						@click="moveUp(index)">
						&uarr;
					</button>
				</div>
				
			</li>
		</ul>
	</div>
	<div class="col-md-4 col">
		<div class="label">
			Join by
		</div>
		<ul class="dr-byor-data-columns">
																<li>
																	CHR<label
																		><input
																			type="text"
																			class="
																				form-control
																				input-default
																			"
																		/>
																	</label>
																</li>
																<li>
																	POS<label>
																		<input
																			type="text"
																			class="
																				form-control
																				input-default
																			"
																	/></label>
																</li>
																<li>
																	REF<label>
																		<input
																			type="text"
																			class="
																				form-control
																				input-default
																			"
																	/></label>
																</li>
																<li>ALT</li>
															</ul>
														</div>
													</div>
</template>
<style scoped>
    @import "public/css/mdkp.css";
    @import "public/css/configbuilder.css";
</style>
<script setup>
	const props = defineProps({rawFields: Array});
	const selectedFields = ref([]);
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
	

</script>