<template>
    <DataConvert :raw-fields="rawFields"></DataConvert>
</template>
<script setup>
    import DataConvert from "@/components/configcomponents/DataConvert.vue"
    const rawFields = [
        "CHR",
        "POS",
        "REF",
        "ALT",
        "RSID",
        "PVAL"
    ];
</script>