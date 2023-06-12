<template>
    <h5>Locus field / star column
		<sup class="optional">Tutorial</sup>
	</h5>
	<div class="row dr-builder-ui">
		<div class=" col-md-3 col text-center">
			<div class="label">
				Locus field
			</div>
			<select class="form-control" v-model="locus" @change="emitLocusStar()">
				<option value="">None</option>
				<option v-for="field in availableFields" :value="field">{{field}}</option>
			</select>
			</div>
			<div class="col-md-6 col text-center">
				<div class="label">
					Star column
				</div>
				<select class="form-control" v-model="star" @change="emitLocusStar()">
				<option value="">None</option>
				<option v-for="field in availableFields" :value="field">{{field}}</option>
			</select>
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
    const emit = defineEmits(["locusStarChanged"]);
	const availableFields = computed(()=> props.fields);
	const locus = ref("");
	const star = ref("");
	function emitLocusStar (){
		emit("locusStarChanged", [locus.value, star.value]);
	}
</script>