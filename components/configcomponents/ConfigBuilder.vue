<template>
	<div class="front-page-body">
		<!-- Body -->
		<div class="container-fluid mdkp-body">
			<div class="card mdkp-card dataset-page-header">
				<div class="row card-body">
					<div class="col-md-8">
						<h2>BYOR Configuration Builder</h2>
					</div>
					<!-- <div class="col-md-4 col filter-col-md">
						<div class="label">Edit configuration</div>
						<div class="row">
							<div class="col-md-7">
								<input type="text" placeholder="Page ID"
									class="form-control form-control-sm input-default"/>
							</div>
							<div class="col-md-5">
								<button class="btn btn-primary btn-sm" type="button">
									Load configuration
								</button>
							</div>
						</div>
					</div> -->
				</div>
			</div>
			<!-- <div class="card mdkp-card">
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
							<input type="text" placeholder="Title"
								class="form-control input-default"/>
						</div>
						<div class="col-md-4 col filter-col-md">
							<div class="label">Page ID <sup>*</sup></div>
							<input type="text" placeholder="Page ID" 
								class="form-control input-default"/>
							<sup class="optional block"
								>No special charaters. No white space. Has to be
								unique.
								<a href="javascript:;">Learn how to make unique page ID here.</a>
							</sup>
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
										<option value="no-data">No data</option>
										<option value="csv">CSV</option>
										<option value="json">JSON</option>
										<option value="bioindex">BioIndex</option>
										<option value="direct-csv">Direct input(csv)</option>
									</select>
								</div>
								<div class="col-md-6 col filter-col-md">
									<div class="label">
										Open remote storage to upload data files
									</div>
									<div class="label">
										<button class="btn btn-primary btn-sm" type="button">
											Open
										</button>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12 col filter-col-md">
									<div class="label">
										Data point(s)
										<sup class="optional">
											Or actual data in case of direct
											input(csv) data type.
										</sup>
									</div>
									<textarea rows="6" class="form-control"></textarea>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col filter-col-md">
									<div class="form-check">
										<input class="form-check-input" type="checkbox"
											value="" id="flexCheckDefault"/>
										<label class="form-check-label" for="flexCheckDefault">
											Is data point(s) dynamic
										</label>
									</div>
								</div>
								<div class="col-md-8 col filter-col-md">
									<div class="label">
										API parameters
										<sup class="optional">If data point(s) dynamic</sup>
									</div>
									<textarea rows="3" class="form-control" v-html="''"></textarea>
								</div>
							</div>
							<h4>
								Search UI labels
								<sup class="optional">Optional</sup>
							</h4>
							<div class="row">
								<div class="col-md-12 col">
									<div>
										<div title="Data points">
											<sup class="optional block">
												Please add labels for data
												points one item per line in
												data_point|Label format. Ex.
												data_point_1|Data label 1
											</sup>
											<textarea rows="3" class="form-control"></textarea>
										</div>
										<div title="API parameters">
											<sup class="optional block">
												Please add labels for the API
												parameters with 'list' type
												options. One value|Label pair
												per line.
											</sup>
											<div class="label">ancestry</div>
											<textarea rows="3" class="form-control"></textarea>
											<div class="label">phenotype</div>
											<textarea rows="3" class="form-control"></textarea>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> -->
			<DataTableFormat></DataTableFormat>
			<!-- <DataComparison></DataComparison>
  			<div class="card mdkp-card">
				<div class="card-body dr-form">
					<h4>
						Filters
						<sup class="optional">Tutorial </sup>
					</h4>
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
			</div> -->
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
	import DataTableFormat from "@/components/configcomponents/DataTableFormat.vue";
	import DataComparison from "@/components/configcomponents/DataComparison.vue";
</script>