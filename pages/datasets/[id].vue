<template>
  <div>
    <DRDatasetAccordion :dsId="dsId" />
  </div>
</template>

<script setup>
const route = useRoute()
const dsId = useState("dsId", () => route.params.id)


</script>
