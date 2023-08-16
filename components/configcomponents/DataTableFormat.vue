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
								<div class="accordion" id="dataTableAccordion">
									<div class="accordion-item">
										<h5 class="accordion-header" id="dataConvertHeading">
											<button class="accordion-button" type="button" data-bs-toggle="collapse"
												data-bs-target="#dataconvertbody" aria-expanded="true"
												aria-controls="dataconvertbody">
													Data convert
											</button>
										</h5>
										<div id="dataconvertbody" class="accordion-collapse collapse show"
											aria-labelledby="dataConvertHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<DataConvert :raw-fields="rawFields" 
													@dc-changed="(configs, fields) => updateDataConvert(configs, fields)"
													@field-name-changed="(oldName, newName) => changeFieldName(oldName, newName)">
												</DataConvert>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h5 class="accordion-header" id="columnFormattingHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#columnformattingbody" aria-expanded="false"
												aria-controls="columnformattingbody">
													Column formatting
											</button>
										</h5>
										<div id="columnformattingbody" class="accordion-collapse collapse"
											aria-labelledby="columnFormattingHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<ColumnFormatting
													@col-format-changed="(config) => updateColumnFormatting(config)">
												</ColumnFormatting>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h2 class="accordion-header" id="topRowsHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#toprowsbody" aria-expanded="false"
												aria-controls="toprowsbody">
													Top rows
											</button>
										</h2>
										<div id="toprowsbody" class="accordion-collapse collapse"
											aria-labelledby="topRowsHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<TopRows
													@top-rows-changed="(fields) => updateTopRows(fields)">
												</TopRows>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h2 class="accordion-header" id="featuresHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#featuresbody" aria-expanded="false"
												aria-controls="featuresbody">
													Features
											</button>
										</h2>
										<div id="featuresbody" class="accordion-collapse collapse"
											aria-labelledby="featuresHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<Features
													@features-changed="(updatedFeatures) => updateFeatures(updatedFeatures)">
												</Features>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h2 class="accordion-header" id="toolTipsHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#tooltipsbody" aria-expanded="false"
												aria-controls="tooltipsbody">
													Tool tips
											</button>
										</h2>
										<div id="tooltipsbody" class="accordion-collapse collapse"
											aria-labelledby="toolTipsHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<ToolTips
													@tool-tips-changed="(updatedToolTips) => updateToolTips(updatedToolTips)">
												</ToolTips>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h2 class="accordion-header" id="locusStarHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#locusstarbody" aria-expanded="false"
												aria-controls="locusstarbody">
													Locus field / star column
											</button>
										</h2>
										<div id="locusstarbody" class="accordion-collapse collapse"
											aria-labelledby="locusStarHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<LocusFieldStarColumn
													@locus-star-changed="(updatedLocusStar) => updateLocusStar(updatedLocusStar)">
												</LocusFieldStarColumn>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card-body dr-form">
			<h4>Data table format output</h4>
			<div class="row dr-builder-ui">
				<div class="col-md-10">
					<pre class="output">{{ dataTableFormatString}}</pre>
				</div>
				<div class="col-md-2">
					<button class="btn btn-primary btn-sm" type="button" @click="copyConfig">
                    	Copy configuration
                	</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import 'bootstrap/dist/js/bootstrap.bundle.min.js';
	import DataConvert from "@/components/configcomponents/DataConvert.vue";
	import TopRows from "@/components/configcomponents/TopRows.vue";
	import ToolTips from "@/components/configcomponents/ToolTips.vue";
	import Features from "@/components/configcomponents/Features.vue";
	import ColumnFormatting from "@/components/configcomponents/ColumnFormatting.vue";
	import LocusFieldStarColumn from "./LocusFieldStarColumn.vue";
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const dataTableFormat = ref({});
	const dataTableFormatString = computed(() => JSON.stringify(dataTableFormat.value));
	const dataConvert = ref([]);
	const rawFields = ref([]);
	const topRows = ref([]);
	const toolTips = ref({});
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
		store.setConvertedFields(fields);
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
		store.renameField(oldName, newName);
	}
	function getRawFields (){
		let topLine = pastedData.value.split("\n")[0];
		rawFields.value = topLine.split(",");
	}
	watch(pastedData, ()=>{
		pastedData.value = pastedData.value.trim();
		getRawFields();
	});
	function copyConfig(){
		navigator.clipboard.writeText(dataTableFormatString.value);
	}
</script>