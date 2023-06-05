<template>
    <div class="card mdkp-card">
				<div class="card-body dr-form">
					<div class="row dr-data-section">
						<div class="col-md-12">
							<h4>
								Data table format
							</h4>
							<div class="row">
								<div class="col-md-12 col">
									<div>
										<div title="Builder">
											<div class="row">
												<div class="col-md-12 col filter-col-md">
													<div class="label">
														Place first few rows of
														your data (including the
														header row) in csv
														format here
													</div>
													<textarea rows="3" class="form-control" v-model="pastedData"></textarea>
												</div>
											</div>
											<DataConvert :raw-fields="rawFields" 
												@dc-changed="(configs, fields) => updateDataConvert(configs, fields)"
												@field-name-changed="(oldName, newName) => changeFieldName(oldName, newName)">
											</DataConvert>
											<ColumnFormatting :fields="convertedFields"></ColumnFormatting>
											<TopRows :fields="convertedFields" :fieldNameUpdate="nameChange"></TopRows>
											<Features :fields="convertedFields" :fieldNameUpdate="nameChange"></Features>
											<ToolTips :fields="convertedFields" :fieldNameUpdate="nameChange"></ToolTips>
											<!-- Locus field / star column -->
											<h5>
												Locus field / star column
												<sup class="optional">Tutorial</sup>
											</h5>
											<div class="row dr-builder-ui">
												<div
													class="
														col-md-6 col
														text-center
													"
												>
													<div class="label">
														Locus field
													</div>
													<select
														class="form-control"
													>
														<option>None</option>
														<option>
															Variant ID
														</option>
														<option>P-Value</option>
													</select>
												</div>
												<div
													class="
														col-md-6 col
														text-center
													"
												>
													<div class="label">
														Star column
													</div>
													<select
														class="form-control"
													>
														<option>None</option>
														<option>
															Variant ID
														</option>
														<option>P-Value</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<h4>
						Data comparison
						<sup class="optional"
							>Optional for only daynamic data points | Tutorial
						</sup>
					</h4>
					<div class="row">
						<div class="col-md-12 col">
							<div>
								<div title="Builder">
									<pre />
									<div class="row dr-builder-ui">
										<div class="col-md-4 col">
											<div class="label">Key field</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="radio"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													Variant ID
												</label>
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="radio"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													P-Value
												</label>
											</div>
										</div>
										<div class="col-md-4 col">
											<div class="label">
												Fields group data key
												<sup class="optional"
													>Query parameters
												</sup>
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="checkbox"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													ancestry
												</label>
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="checkbox"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													phenotype
												</label>
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="checkbox"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													region
												</label>
											</div>
										</div>
										<div class="col-md-4 col">
											<div class="label">
												Fields to compare
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="checkbox"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													Variant ID
												</label>
											</div>
											<div
												class="
													form-check form-check-inline
												"
											>
												<input
													class="form-check-input"
													type="checkbox"
													value=""
													id="flexCheckDefault"
												/>
												<label
													class="form-check-label"
													for="flexCheckDefault"
												>
													P-Value
												</label>
											</div>
										</div>
									</div></div
								>
								<div title="Manual build">
									<pre />
									<textarea
										rows="6"
										class="form-control"
										>'{\r\n\'key field\':,\r\n\'fields group data key\':[],\r\n\'fields to compare\':[]\r\n}'
									</textarea>
								</div>
							</div>
						</div>
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
	import DataConvert from "@/components/configcomponents/DataConvert.vue";
	import TopRows from "@/components/configcomponents/TopRows.vue";
	import ToolTips from "@/components/configcomponents/ToolTips.vue";
	import Features from "@/components/configcomponents/Features.vue";
	import ColumnFormatting from "@/components/configcomponents/ColumnFormatting.vue";

/* 	computed property outputObject generates output
	another computed property outputString stringifies and displays it
	outputObject makes sense of all the little config items stored in various formats
	so that the string does not have to be the source of truth during editing */

	const rawFields = ref([]);
	const convertedFields = ref([]);
	const nameChange = ref([null, null]);
	const config = ref({});
	const pastedData = ref("");
	function updateDataConvert(configs, fields){
		config.value["data convert"] = configs;
		convertedFields.value = fields;
	}
	function changeFieldName(oldName, newName){
		nameChange.value = [oldName, newName];
	}
	function getRawFields (){
		let topLine = pastedData.value.split("\n")[0];
		rawFields.value = topLine.split(",");
	}
	watch(pastedData, ()=>{
		pastedData.value = pastedData.value.trim();
		getRawFields();
	});
</script>