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
	</div>
	<div class="col-md-4 col">
		<div class="label">
			Selected fields
		</div>
		<ul class="dr-byor-data-columns">
			<li v-for="field in selectedFields">{{ field }}</li>
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
</script>