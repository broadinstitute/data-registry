<template>
    <div>
        <h5>Data convert
			<sup class="optional">Tutorial</sup>
		</h5>
        <div class="row dr-builder-ui">
            <div class="col-md-3 col">
                <div class="label">Type</div>
                <select class="form-control" v-model="dataConvertType" :disabled="editingFieldIndex >= 0">
                    <option v-for="dcOption in dataConvertOptions" :value="dcOption.selectValue">
                        {{ dcOption.displayName }}
                    </option>
                </select>
                <div class="label">
                    New field name
                </div>
                <input type="text" class="form-control input-default" v-model="newFieldName"/>
                <div class="label">Output</div>
                <pre class="output">{{ JSON.stringify(currentFieldConfig) }}</pre>
            </div>
            <div class="col-md-8 col">
                <RawRename v-if="dataConvertType=='raw'"></RawRename>
				<Calculate v-else-if="dataConvertType=='calculate'"></Calculate>
                <Join v-else-if="dataConvertType=='join'"></Join>
				<JoinMulti v-else-if="dataConvertType=='join multi'"></JoinMulti>
				<ArrayToString v-else-if="dataConvertType=='array to string'"></ArrayToString>
				<ReplaceCharacters v-else-if="dataConvertType=='replace characters'"></ReplaceCharacters>
				<ScoreColumns v-else-if="dataConvertType=='score columns'"></ScoreColumns>
			</div>
			<div class="col-md-1 col">
				<button class="btn btn-primary btn-sm" type="button">
                    Save
                </button>
                <button class="btn btn-warning btn-sm" type="button">
                    Cancel
                </button>
                <button class="btn btn-danger btn-sm" type="button">
                    Delete
                </button>
			</div>
		</div>
    </div>
    <div class="row">
		<div class="col-md-12 col text-center dr-bubbles-wrapper">
			<div class="dr-format-bubble" v-for="field, index in savedFieldConfigs">
				<span class="name">{{ field["field name"] }}</span>
                <span class="type">{{ field["type"] }}</span>
                <a @click="editField(index)"><span class="edit">Edit</span></a>
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
    import ArrayToString from "@/components/configcomponents/dataconverters/ArrayToString.vue";
    import Calculate from "@/components/configcomponents/dataconverters/Calculate.vue";
    import Join from "@/components/configcomponents/dataconverters/Join.vue";
    import JoinMulti from "@/components/configcomponents/dataconverters/JoinMulti.vue";
    import RawRename from "@/components/configcomponents/dataconverters/RawRename.vue";
    import ReplaceCharacters from "@/components/configcomponents/dataconverters/ReplaceCharacters.vue";
    import ScoreColumns from "@/components/configcomponents/dataconverters/ScoreColumns.vue";

    const dataConvertType = ref("array to string");
    const dataConvertOptions = [
        {
            displayName: "Array to string *",
            selectValue: "array to string" 
        },
        {
            displayName: "Calculate",
            selectValue: "calculate",
        },
        {
            displayName: "Join",
            selectValue: "join"
        },
        {
            displayName: "Join multi",
            selectValue: "join multi"
        },
        {
            displayName: "Raw (rename)",
            selectValue: "raw"
        },
        {
            displayName: "Replace characters",
            selectValue: "replace characters"
        },
        {
            displayName: "Score columns",
            selectValue: "score columns"
        }
    ];

    const newFieldName = ref("Enter new field name.");
    const currentFieldConfig = reactive({});
    // do we need to quote key names within the byor config? I think so
    const savedFieldConfigs = reactive([
        {
            "type": "join multi",
            "field name": "Coding sequence",
            "fields to join": ["Chr", "Start", "End"],
            "join by": [":","-"]
        },
        {
            "type":"calculate",
            "field name":"P-Value(-Log10)",
            "raw field":"pValue",
            "calculation type":"-log10"
        }
    ]);
    const editingFieldIndex = ref(-1);
    function editField(index){
        editingFieldIndex.value = index;
        // What if someone changes field type during editing? Gray out the selector and only un-gray upon saving?
        let savedField = savedFieldConfigs[index];
        currentFieldConfig.value = savedField;
        newFieldName.value = savedField["field name"];
        dataConvertType.value = savedField["type"];

    }
    function saveField(){
        console.log("Saving field.");
        if(editingFieldIndex == -1){
            let newField = currentFieldConfig.value;
            savedFieldConfigs.push(newField);
        }
    }
    function cancelFieldEdit(){
        console.log("Canceling field edit.");
    }
    function deleteField(){
        console.log("Deleting field.");
    }

</script>