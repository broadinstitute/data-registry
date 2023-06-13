<template>
    <h5>Locus field / star column
		<sup class="optional">
            <a href="https://hugeampkpncms.org/node/71" target="_blank">
                Tutorial
            </a>
        </sup>
	</h5>
	<div class="row dr-builder-ui">
		<div class=" col-md-6 col text-center">
			<div class="label">
				Locus field
			</div>
			<select class="form-control" v-model="locus">
				<option value="">None</option>
				<option v-for="field in availableFields" :value="field">{{field}}</option>
			</select>
			</div>
			<div class="col-md-6 col text-center">
				<div class="label">
					Star column
				</div>
				<select class="form-control" v-model="star">
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
	const fieldNameOld = computed(() => props.fieldNameUpdate[0]);
    const fieldNameNew = computed(() => props.fieldNameUpdate[1]);
	const locus = ref("");
	const star = ref("");
	watch (availableFields, () => {
        if (!availableFields.value.includes(locus.value)){
			locus.value = "";
		}
		if (!availableFields.value.includes(star.value)){
			star.value = "";
		}
    });
	watch(fieldNameOld, () => {
        if (locus.value == fieldNameOld.value){
			locus.value = fieldNameNew.value;
		}
		if (star.value == fieldNameOld.value){
			star.value = fieldNameNew.value;
		}
    });
	watch([locus, star], () => { emitLocusStar() });
	function emitLocusStar (){
		emit("locusStarChanged", [locus.value, star.value]);
	}
</script>