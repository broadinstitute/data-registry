<template>
	<div class="front-page-body">
		<!-- Body -->
		<div class="container-fluid mdkp-body">
			<div class="card mdkp-card dataset-page-header">
				<div class="row card-body">
					<div class="col-md-8">
						<h2>BYOR Configuration Builder</h2>
					</div>
					<div class="col-md-4 col filter-col-md">
						<div class="label">Edit configuration</div>
						<div class="row">
							<div class="col-md-7">
								<input
									type="text"
									class="
										form-control form-control-sm
										input-default
									"
									placeholder="Page ID"
								/>
							</div>
							<div class="col-md-5">
								<button
									class="btn btn-primary btn-sm"
									type="button"
								>
									Load configuration
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card mdkp-card">
				<div class="card-body dr-form">
					<div class="row dr-data-update-section">
						<div class="col-md-12 col filter-col-md">
							User ID | Created date: 00-00-0000 | Updated date:
							00-00-0000 | Any server side captured information
							here.
						</div>
					</div>
					<div class="row dr-status-section">
						<div class="col-md-8 col filter-col-md">
							<div class="label">Title<sup>*</sup></div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Title"
							/>
						</div>
						<div class="col-md-4 col filter-col-md">
							<div class="label">Page ID <sup>*</sup></div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Page ID"
							/>
							<sup class="optional block"
								>No special charaters. No white space. Has to be
								unique.
								<a href="javascript:;"
									>Learn how to make unique page ID here.</a
								></sup
							>
						</div>
					</div>

					<div class="row dr-data-section">
						<div class="col-md-12">
							<h4>
								Data point <sup class="optional">Tutorial </sup>
							</h4>
						</div>

						<div class="col-md-12">
							<div class="row">
								<div class="col-md-6 col filter-col-md">
									<div class="label">Data type</div>
									<select class="form-control">
										<option value="">No data</option>
										<option value="">CSV</option>
										<option value="">JSON</option>
										<option value="">BioIndex</option>
										<option value="">
											Direct input(csv)
										</option>
									</select>
								</div>
								<div class="col-md-6 col filter-col-md">
									<div class="label">
										Open remote storage to upload data files
									</div>
									<div class="label">
										<button
											class="btn btn-primary btn-sm"
											type="button"
										>
											Open
										</button>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 col filter-col-md">
									<div class="label">
										Data point(s)
										<sup class="optional"
											>Or actual data incase of direct
											input(csv) data type.
										</sup>
									</div>
									<textarea rows="6" class="form-control">
data_point1.csv,data_point2.csv,data_point3.csv,data_point4.csv</textarea
									>
								</div>
							</div>
							<!--
							</div>-->

							<div class="row">
								<div class="col-md-4 col filter-col-md">
									<div class="form-check">
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
											Is data point(s) dynamic
										</label>
									</div>
								</div>
								<div class="col-md-8 col filter-col-md">
									<div class="label">
										API parameters
										<sup class="optional"
											>If data point(s) dynamic
										</sup>
									</div>
									<textarea
										rows="3"
										class="form-control"
										v-html="''"
									></textarea>
									<!--										'{\"query\":{"type":"array","format":["ancestry","phenotype","region"],"index":"associations"},\r\n"parameters":[\r\n{"parameter":"ancestry","label":"Ancestry","type":"list","values":["EU","Mixed"]},{"parameter":"phenotype","label":"Phenotype","type":"list","values":["value_1","value_2"]},\r\n{"parameter":"region","label":"Region","type":"input"}\r\n]\r\n}'
-->
								</div>
							</div>
							<h4>
								Search UI labels<sup class="optional"
									>Optional
								</sup>
							</h4>
							<div class="row">
								<div class="col-md-12 col">
									<div>
										<div title="Data points">
											<pre />
											<sup class="optional block"
												>Please add labels for data
												points one item per line in
												data_point|Label format. Ex.
												data_point_1|Data label 1
											</sup>
											<textarea
												rows="3"
												class="form-control"
											>
											</textarea>
										</div>
										<div title="Api parameters">
											<pre />
											<sup class="optional block"
												>Please add labels for the API
												parameters with 'list' type
												options. One value|Label pair
												per line.
											</sup>
											<div class="label">ancestry</div>
											<textarea
												rows="3"
												class="form-control"
											>
											</textarea>
											<div class="label">phenotype</div>
											<textarea
												rows="3"
												class="form-control"
											>
											</textarea>
										</div>
									</div>
								</div>
							</div>

							<h4>
								Data table format
								<sup class="optional"
									>Progress under 'Manual build' tab
								</sup>
							</h4>
							<div class="row">
								<div class="col-md-12 col">
									<div>
										<div title="Builder">
											<pre />
											<div class="row">
												<div
													class="
														col-md-12 col
														filter-col-md
													"
												>
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
												<sup class="optional"
													>Tutorial
												</sup>
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
										<div title="Manual build">
											<pre />
											<textarea
												rows="6"
												class="form-control">'{\r\n\'top rows\':[]\r\n\'}'
											</textarea>
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

					<!-- filters -->
					<h5>
						Filters
						<sup class="optional">Tutorial </sup>
					</h5>
					<div class="row">
						<div class="col-md-12 col">
							<div>
								<div title="Builder">
									<pre />
									<div class="row">
										<div class="col-md-7">
											<div class="row dr-builder-ui">
												<div class="col-md-3 col">
													<div class="label">
														Select field
													</div>
													<select
														class="form-control"
													>
														<option>
															variant ID
														</option>
														<option>P-Value</option>
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
								<div title="Manual build">
									<textarea rows="6" class="form-control">
									</textarea>
								</div>
							</div>
						</div>
					</div>

					<div class="row dr-description-section">
						<div class="col-md-12">
							<h4>Visulizer</h4>
							<div class="row">
								<div class="col filter-col-md">
									<div class="label">
										Visualizer configuration
									</div>
									<textarea
										rows="6"
										class="form-control"
									></textarea>
								</div>
							</div>
						</div>
					</div>

					<div class="row dr-description-section">
						<div class="col-md-12">
							<h4>Legends</h4>
							<div class="row">
								<div class="col filter-col-md">
									<div class="label">Datatable legend</div>
									<textarea
										rows="3"
										class="form-control"
									></textarea>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 col filter-col-md">
									<div class="label">Visualizer legend</div>
									<textarea
										rows="3"
										class="form-control"
									></textarea>
								</div>
							</div>
						</div>
					</div>

					<div class="row dr-description-section">
						<div class="col-md-12">
							<h4>Page description</h4>
							<div class="row">
								<div class="col filter-col-md">
									<div class="label">
										Description<sup>*</sup>
									</div>
									<textarea
										rows="6"
										class="form-control"
									></textarea>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 col filter-col-md">
									<div class="label">Page style</div>
									<textarea
										rows="3"
										class="form-control"
									></textarea>
								</div>
							</div>
						</div>
					</div>
					<div class="row dr-meta-info">
						<div class="col-md-4 col filter-col-md">
							<div class="label">Page Mode<sup>*</sup></div>
							<select class="form-control">
								<option value="">Unpublished</option>
								<option value="">Review or development</option>
								<option value="">Public</option>
							</select>
						</div>
						<div class="col-md-4 col filter-col-md">
							<div class="label">
								Dev ID
								<sup class="optional"
									>If page mode in review or dev</sup
								>
							</div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Dev ID"
							/>
						</div>
						<div class="col-md-4 col filter-col-md">
							<div class="label">
								Dev password
								<sup class="optional"
									>If page mode in review or dev</sup
								>
							</div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Dev password"
							/>
						</div>
					</div>
					<div class="row dr-meta-info">
						<div class="col-md-6 col filter-col-md">
							<div class="label">
								Research method node ID
								<sup class="optional"
									><a href="javascript:;">Tutorial</a></sup
								>
							</div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Node ID"
							/>
						</div>
						<div class="col-md-6 col filter-col-md">
							<div class="label">
								Page header menu node ID
								<sup class="optional"
									><a href="javascript:;">Tutorial</a></sup
								>
							</div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="Node ID"
							/>
						</div>
					</div>
					<div class="row dr-meta-info">
						<div class="col-md-4 col filter-col-md">
							<div class="form-check">
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
									Show on BYOR front
								</label>
							</div>
						</div>
						<div class="col-md-8 col filter-col-md">
							<div class="label">
								URL to the page
								<sup class="optional"
									>ex.
									/research.html?pageid=kp_variant_sifter&phenotype=T2D&region=17:40719090-40725257</sup
								>
							</div>
							<input
								type="text"
								class="form-control input-default"
								placeholder="URL"
							/>
						</div>
						<div class="col-md-4 col filter-col-md">
							<div class="label">
								Image to show on BYOR front
								<sup class="optional block"
									>2MB limit. png, gif, jpg or jpeg olny</sup
								>
								<div class="col-md-12 col filter-col-md">
									<button
										class="btn btn-primary btn-sm"
										type="button"
									>
										Choose file
									</button>
								</div>
							</div>
						</div>
						<div class="col-md-8 col filter-col-md">
							<div class="label">Project summary</div>
							<textarea rows="4" class="form-control"></textarea>
						</div>

						<div class="col-md-12 col filter-col-md">
							<div class="form-check">
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
									Is project landing page <br />
									<sup class="optional block"
										>The summary of Page Description field
										will show on Projects page if checked.
										Please set only 1 page per project as a
										project landing page.</sup
									>
								</label>
							</div>
						</div>
					</div>
					<div class="row dr-meta-info">
						<div class="col-md-4 col filter-col-md">
							<div class="label">Show portal header and menu</div>
							<div class="form-check">
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
									Show
								</label>
							</div>
						</div>
					</div>
					<div class="row dr-meta-info">
						<div class="col-md-4 col filter-col-md">
							<div class="label">Revision</div>
							<div class="form-check">
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
									Create revision
								</label>
							</div>
						</div>
						<div class="col-md-8 col filter-col-md">
							<div class="label">Revision log message</div>
							<input
								type="text"
								class="form-control input-default"
							/>
						</div>
					</div>
				</div>

				<div class="card-body">
					<div class="row dr-submit-section">
						<div class="col-md-12 col filter-col-md">
							<button class="btn btn-primary" type="button">
								Save configuration
							</button>
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