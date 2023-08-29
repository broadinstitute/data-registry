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
										<h5 class="accordion-header" id="selectColumnsHeading">
											<button class="accordion-button" type="button" data-bs-toggle="collapse"
												data-bs-target="#selectcolumnsbody" aria-expanded="true"
												aria-controls="selectcolumnsbody">
													Select columns
											</button>
										</h5>
										<div id="selectcolumnsbody" class="accordion-collapse collapse show"
											aria-labelledby="selectColumnsHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<SelectColumns></SelectColumns>
											</div>
										</div>
									</div>
									<div class="accordion-item">
										<h5 class="accordion-header" id="dataConvertHeading">
											<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
												data-bs-target="#dataconvertbody" aria-expanded="false"
												aria-controls="dataconvertbody">
													Data convert
											</button>
										</h5>
										<div id="dataconvertbody" class="accordion-collapse collapse"
											aria-labelledby="dataConvertHeading" data-bs-parent="#dataTableAccordion">
											<div class="accordion-body">
												<DataConvert></DataConvert>
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
													@colFormatChanged="(config) => updateFormat('column formatting', config)">
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
													@topRowsChanged="(fields) => updateFormat('top rows', fields)">
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
													@featuresChanged="(features) => updateFormat('features', features)">
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
													@toolTipsChanged="(toolTips) => updateFormat('tool tips', toolTips)">
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
													@locusChanged="(locus) => updateFormat('locus', locus)"
													@starChanged="(star) => updateFormat('star', star)">
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
	import SelectColumns from "@/components/configcomponents/SelectColumns.vue";
	import DataConvert from "@/components/configcomponents/DataConvert.vue";
	import TopRows from "@/components/configcomponents/TopRows.vue";
	import ToolTips from "@/components/configcomponents/ToolTips.vue";
	import Features from "@/components/configcomponents/Features.vue";
	import ColumnFormatting from "@/components/configcomponents/ColumnFormatting.vue";
	import LocusFieldStarColumn from "./LocusFieldStarColumn.vue";
	import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

	const store = useConfigBuilderStore();
	const dataTableFormatString = computed(() => JSON.stringify(config.value));
	const dataConvert = computed(() => store.allFieldsConfig);
	const pastedData = ref("");
	const config = ref({});
	function updateFormat(target, content){
		if (target == "features"){
			let oldFeatures = !!config.value["features"] ? config.value["features"] : [];
			oldFeatures.forEach(feature => delete config.value[feature]);
			Object.keys(content).forEach(featureKey => 
				config.value[featureKey] = content[featureKey]); 
		} else {
			config.value[target] = content;
		}
	}
	watch(pastedData, ()=>{
		pastedData.value = pastedData.value.trim();
		let topLine = pastedData.value.split("\n")[0];
		let rawFields = topLine.split(",");
		if (pastedData.value == "") {
			rawFields = [];
		}
		store.setRawFields(rawFields);
	});
	watch(dataConvert, () => config.value["data convert"] = dataConvert.value);
	function copyConfig(){
		navigator.clipboard.writeText(dataTableFormatString.value);
	}
</script>
