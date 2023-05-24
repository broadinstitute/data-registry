<template>
    <div class="row" id="joinMultiConfig">
		<div class="col-md-6 col">
			<div class="label">
				Join multi | Select field(s)
			<sup class="optional">
				Set weight to select
			</sup>
		</div>
		<ul class="dr-byor-data-columns">
			<li v-for="rawField in rawFields">
				{{ rawField }}
				<label>
					<select class="form-control">
						<option>None</option>
						<option v-for="rawField, index in rawFields">{{ index }}</option>
					</select>
				</label>
			</li>
		</ul>
	</div>
	<div class="col-md-6 col">
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
</script>