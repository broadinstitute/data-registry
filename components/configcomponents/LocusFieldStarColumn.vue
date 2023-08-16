<template>
	<a href="https://hugeampkpncms.org/node/71" target="_blank" class="tutorial-link">
		Locus field tutorial
	</a> |
	<a href="https://hugeampkpncms.org/node/114" target="_blank" class="tutorial-link">
		Star column tutorial
	</a>
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
<script setup>
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const props = defineProps({fields: Array});
    const emit = defineEmits(["locusStarChanged"]);
	const availableFields = computed(()=> props.fields);
    const fieldNameOld = computed(() => store.getLatestFieldRename[0]);
    const fieldNameNew = computed(() => store.getLatestFieldRename[1]);
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