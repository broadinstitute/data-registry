<template>
	<div class="front-page-body">
		<!-- Body -->
		<div class="container-fluid mdkp-body">
			<div class="card mdkp-card dataset-page-header">
				<div class="row card-body">
					<div class="col-md-8">
						<h2>BYOR Configuration Builder <sup>Beta 1.0</sup></h2>
					</div>
					<!--ConfigLoadBox goes here-->
				</div>
			</div>
			<!--DataLoader goes here-->
			<DataTableFormat 
				@fieldsUpdated="(updatedFields) => processFields(updatedFields)"
				@fieldRenamed="(latestRename) => processFieldRename(latestRename)">
			</DataTableFormat>
			<!--DataComparison goes here-->
  			<div class="card mdkp-card">
				<div class="card-body dr-form">
					<Filters :fields="fieldsList" :fieldNameUpdate="fieldRename"></Filters>
				</div>
				<Visualizer></Visualizer>
				<div class="card-body">
					<div class="row dr-submit-section">
						<div class="col-md-12 col filter-col-md">
							<div style="font-size: smaller;">Coming soon</div>
							<button class="btn btn-primary disabled" type="button" 
								style="background-color: darkgray; border: none;">
								Save configuration
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
	@import "public/css/mdkp.css";
	@import "public/css/configbuilder.css";
</style>
<script setup>
	import DataTableFormat from "@/components/configcomponents/DataTableFormat.vue";
	import Filters from "@/components/configcomponents/Filters.vue";
	import Visualizer from "@/components/configcomponents/Visualizer.vue";
	const fieldsList = ref([]);
	const fieldRename = ref([null, null]);
	function processFields(updatedFields){
		fieldsList.value = updatedFields;
	}
	function processFieldRename(latestRename){
		fieldRename.value = latestRename;
	}
</script>