<template>
	<div class="card mdkp-card">
		<div class="row card-body">
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
<script setup>
	import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
</script>