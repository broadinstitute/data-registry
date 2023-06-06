<template>
    <div class="card mdkp-card">
		<div class="card-body dr-form">
			<div class="row">
				<div class="col-md-12">
					<h4>Data table format</h4>
					<div class="row">
						<div class="col-md-12 col">
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
								<ColumnFormatting :fields="convertedFields" :fieldNameUpdate="nameChange"
									@col-format-changed="(config) => updateColumnFormatting(config)">
								</ColumnFormatting>
								<TopRows :fields="convertedFields" :fieldNameUpdate="nameChange"></TopRows>
								<Features :fields="convertedFields" :fieldNameUpdate="nameChange"></Features>
								<ToolTips :fields="convertedFields" :fieldNameUpdate="nameChange"></ToolTips>
								<LocusFieldStarColumn></LocusFieldStarColumn>		
							</div>
						</div>
					</div>
				</div>
			</div>
			<DataComparison></DataComparison>
		</div>
		<div class="card-body dr-form">
			<h4>Data table format output</h4>
			<div class="row dr-builder-ui">
				<div class="col-md-12">
					<pre class="output">{{ dataTableFormatString}}</pre>
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
	import LocusFieldStarColumn from "./LocusFieldStarColumn.vue";
	import DataComparison from "@/components/configcomponents/DataComparison.vue";

/* 	computed property outputObject generates output
	another computed property outputString stringifies and displays it
	outputObject makes sense of all the little config items stored in various formats
	so that the string does not have to be the source of truth during editing */
	const dataTableFormat = ref({});
	const dataTableFormatString = computed(() => JSON.stringify(dataTableFormat.value));
	const rawFields = ref([]);
	const convertedFields = ref([]);
	const nameChange = ref([null, null]);
	const pastedData = ref("");
	function updateDataConvert(configs, fields){
		dataTableFormat.value["data convert"] = configs;
		convertedFields.value = fields;
	}
	function updateColumnFormatting(config){
		dataTableFormat.value["column formatting"] = config;
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