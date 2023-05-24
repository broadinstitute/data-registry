<template>
    <div class="row" id="calculateConfig">
		<div class="col-md-6 col">
			<div class="label">
				Calculate | Select field
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields" class="form-check form-check-inline">
					<input class="form-check-input" type="radio" name="calculate" :value="rawField" id="flexCheckDefault"/>
						<span class="form-check-label" for="flexCheckDefault">{{ rawField }}</span>
				</li>													
			</ul>
														</div>
														<div
															class="col-md-6 col"
														>
															<div class="label">
																Calculate
															</div>
															<select
																class="
																	form-control
																"
															>
																<option>
																	-Log10
																</option>
															</select>
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