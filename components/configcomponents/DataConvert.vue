<template>
    <div>
        <h5>Data convert
			<sup class="optional">Tutorial</sup>
		</h5>
        <div class="row dr-builder-ui">
            <div class="col-md-3 col">
                <div class="label">Type</div>
                <select class="form-control" v-model="dataConvertType">
                    <option v-for="dcOption in dataConvertOptions" :value="dcOption.selectValue">
                        {{ dcOption.displayName }}
                    </option>
                </select>
                <pre></pre> <!-- what went here? was this the output? compare to portal page-->
                <div class="label">
                    New field name
                </div>
                <input type="text" class="form-control input-default" v-model="newFieldName"/>
            </div>
            <div class="col-md-8 col">
                <RawRename></RawRename>
				<Calculate></Calculate>
                <Join></Join>
				<JoinMulti></JoinMulti>
				<ArrayToString></ArrayToString>
				<ReplaceCharacters></ReplaceCharacters>
				<ScoreColumns></ScoreColumns>
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
			<div class="dr-format-bubble">
				<span class="name">Variant ID</span>
                <span class="type">join multi</span>
                <span class="edit">Edit</span>
		    </div>
			<div class="dr-format-bubble">
				<span class="name">P-Value(-Log10)</span>
                <span class="type">calculate</span><span class="edit">Edit</span>
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

    let dataConvertType = "array2string";
    const dataConvertOptions = [
        {
            displayName: "Array to string *",
            selectValue: "array2string" 
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
            selectValue: "joinmulti"
        },
        {
            displayName: "Raw (rename)",
            selectValue: "raw"
        },
        {
            displayName: "Replace characters",
            selectValue: "replace"
        },
        {
            displayName: "Score columns",
            selectValue: "scorecolumns"
        }
    ];

    let newFieldName = "Enter new field name.";

</script>