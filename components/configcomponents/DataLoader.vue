<template>
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
			</div>
</template>
<script setup>
    import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
</script>