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

													<select
														class="form-control"
													>
														<option>Search</option>
														<option>
															Search greater than
														</option>
														<option>
															Search lower than
														</option>
														<option>
															Search or
														</option>
														<option>
															Search and
														</option>
														<option>
															Dropdown
														</option>
													</select>
												</div>
												<div class="col-md-3 col">
													<div class="label">
														Label
													</div>

													<input
														type="text"
														class="
															form-control
															input-default
														"
													/>
												</div>
												<div class="col-md-3 col">
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
										</div>
										<div class="col-md-5">
											<div class="row dr-builder-ui">
												<div class="col-md-6 col">
													<div class="label">
														Filter order
													</div>

													<ul
														class="
															dr-byor-data-columns
														"
													>
														<li>
															Variant ID (<a
																href="javascript:;"
																>Edit</a
															>)<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																</select></label
															>
														</li>
														<li>
															P-Value (<a
																href="javascript:;"
																>Edit</a
															>)<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																</select></label
															>
														</li>
													</ul>
												</div>
												<div class="col-md-6 col">
													<div class="label">
														Filter width
													</div>

													<select
														class="form-control"
													>
														<option>
															Midium (default)
														</option>
														<option>Small</option>
														<option>Large</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="label">Output</div>
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
	const selectedField = ref(null);
    watch(availableFields, () => console.log(JSON.stringify(availableFields.value)));
    watch(fieldNameOld, () => {
		if (selectedField.value == fieldNameOld.value){
			selectedField.value = fieldNameNew.value;
		}
	});
</script>