<template>
    <div class="front-page-body">
		<div class="container-fluid mdkp-body">

        <h3>BYOR Config Builder: Data Table Format</h3>
            <DataTableFormat></DataTableFormat>
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
    import DataTableFormat from "@/components/configcomponents/DataTableFormat.vue"
</script>