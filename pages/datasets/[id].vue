<template>
  <div>
    <DRDatasetAccordion :dsId="dsId" :edit-mode="route.query.edit === 'true'"/>
  </div>
</template>

<script setup>
const route = useRoute()
const dsId = useState("dsId", () => route.params.id)


</script>
