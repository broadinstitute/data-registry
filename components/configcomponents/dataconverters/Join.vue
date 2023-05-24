<template>
    <div class="row" id="joinConfig">
		<div class="col-md-6 col">
			<div class="label">
				Join | Select field(s)
				<sup class="optional">
					Set weight to select
				</sup>
			</div>
			<ul class="dr-byor-data-columns">
				<li v-for="rawField in rawFields">{{ rawField }}
					<label>
						<select class="form-control">
							<option>None</option>
							<option>0</option>
							<option>1</option>
						</select>
					</label>
				</li>
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