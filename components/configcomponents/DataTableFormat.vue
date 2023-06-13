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
								<TopRows :fields="convertedFields" :fieldNameUpdate="nameChange"
									@top-rows-changed="(fields) => updateTopRows(fields)">
								</TopRows>
								<Features :fields="convertedFields" :fieldNameUpdate="nameChange"
									@features-changed="(updatedFeatures) => updateFeatures(updatedFeatures)">
								</Features>
								<ToolTips :fields="convertedFields" :fieldNameUpdate="nameChange"
									@tool-tips-changed="(updatedToolTips) => updateToolTips(updatedToolTips)"></ToolTips>
								<LocusFieldStarColumn :fields="convertedFields" :fieldNameUpdate="nameChange"
									@locus-star-changed="(updatedLocusStar) => updateLocusStar(updatedLocusStar)">
								</LocusFieldStarColumn>		
							</div>
						</div>
					</div>
				</div>
			</div>
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
	const dataConvert = ref([]);
	const rawFields = ref([]);
	const convertedFields = ref([]);
	const topRows = ref([]);
	const toolTips = ref({});
	const nameChange = ref([null, null]);
	const pastedData = ref("");
	const featureConfig = ref({ "features": [] });
	const locus = ref("");
	const star = ref("");
	const columnFormatting = ref({});
	function outputDataTableFormat(){
		let format = {};
		if (dataConvert.value.length > 0){
			format["data convert"] = dataConvert.value;
		}
		if (Object.keys(columnFormatting.value).length > 0){
			format["column formatting"] = columnFormatting.value;
		}
		if (topRows.value.length > 0){
			format["top rows"] = topRows.value;
		}
		if (featureConfig.value["features"].length > 0){
			let featureKeys = Object.keys(featureConfig.value);
			featureKeys.forEach(featureKey => 
				format[featureKey] = featureConfig.value[featureKey]);
		}
		let toolTipCount = Object.keys(toolTips.value).length;
		if (toolTipCount > 0){
			format["tool tips"] = toolTips.value;
		}
		if (locus.value != ""){
			format["locus field"] = locus.value;
		}
		if (star.value != ""){
			format["star column"] = star.value;
		}
		dataTableFormat.value = format;
	}
	function updateDataConvert(configs, fields){
		dataConvert.value = configs;
		convertedFields.value = fields;
		outputDataTableFormat();
	}
	function updateTopRows(fields){
		topRows.value = fields;
		outputDataTableFormat();
	}
	function updateFeatures(updatedFeatures){
		featureConfig.value = updatedFeatures;
		outputDataTableFormat();
	}
	function updateColumnFormatting(config){
		columnFormatting.value = config;
		outputDataTableFormat();
	}
	function updateToolTips(updatedToolTips){
		toolTips.value = updatedToolTips;
		outputDataTableFormat();
	}
	function updateLocusStar(updatedLocusStar){
		locus.value = updatedLocusStar[0];
		star.value = updatedLocusStar[1];
		outputDataTableFormat();
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