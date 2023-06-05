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
		<div class="col-md-3 col">
			<div class="label">
				Set formatting order
			</div>
			<ul class="dr-byor-data-columns">
				<li>Link<label>
					<select class="
																		form-control
																	"
																>
																	<option>
																		None
																	</option>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																	<option>
																		2
																	</option>
																	<option>
																		3
																	</option>
																</select></label
															>
														</li>
														<li>
															Rander background
															%<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		None
																	</option>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																	<option>
																		2
																	</option>
																	<option>
																		3
																	</option>
																</select></label
															>
														</li>
														<li>
															Rander background %
															(negative)<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		None
																	</option>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																	<option>
																		2
																	</option>
																	<option>
																		3
																	</option>
																</select></label
															>
														</li>
														<li>
															Scientific
															notation<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		None
																	</option>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																	<option>
																		2
																	</option>
																	<option>
																		3
																	</option>
																</select></label
															>
														</li>
														<li>
															Fixed after decimal
															point<label>
																<select
																	class="
																		form-control
																	"
																>
																	<option>
																		None
																	</option>
																	<option>
																		0
																	</option>
																	<option>
																		1
																	</option>
																	<option>
																		2
																	</option>
																	<option>
																		3
																	</option>
																</select></label
															>
														</li>
													</ul>
		</div>
		<div class="col-md-3 col">
													<div class="label">
														Link
													</div>
													<div id="linkFormat">
														<div
															class="form-inline"
														>
															<span
																>Link to:
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
													<pre />
													<div class="label">
														Render background %
													</div>
													<div class="form-inline">
														<span
															>Percent if no
															value:
														</span>

														<input
															type="text"
															class="
																form-control
																form-control-sm
																input-default
															"
															style="
																width: 50%;
																margin-left: 5px;
															"
														/>
													</div>
													<pre />
													<div class="label">
														Fixed after decimal
														point
													</div>
													<div class="form-inline">
														<span>Place </span>

														<select
															class="
																form-control
																form-control-sm
															"
															style="
																width: 50%;
																margin-left: 5px;
															"
														>
															<option>1</option>
															<option>2</option>
															<option>3</option>
															<option>4</option>
															<option>5</option>
															<option>6</option>
															<option>7</option>
															<option>8</option>
															<option>9</option>
														</select>
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
												<div
													class="
														col-md-12 col
														text-center
														dr-bubbles-wrapper
													"
												>
													<div
														class="dr-format-bubble"
													>
														<span class="name"
															>Variant ID</span
														><span class="type"
															>link</span
														><span class="edit"
															>Edit</span
														>
													</div>
													<div
														class="dr-format-bubble"
													>
														<span class="name"
															>P-Value </span
														><span class="type"
															>Sceintific
															notation, render
															background %</span
														><span class="edit"
															>Edit</span
														>
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
</script>