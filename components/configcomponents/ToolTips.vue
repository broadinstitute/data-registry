<template>
    <h5>
        Tool tips
        <sup class="optional">Tutorial</sup>
    </h5>
    <div class="row dr-builder-ui">
        <div class="col-md-3 col">
                <div class="label">Output</div>
                <pre class="output">{{ JSON.stringify(toolTipConfig) }}</pre>
            </div>
        <div class="col-md-9 col">
            <div class="label">
                Tool tips
            </div>
            <ul class="dr-byor-data-columns">
                <li v-for="field in availableFields">
                    <span class="form-check-label" for="flexCheckDefault">{{ field }}</span>
                    <input type="text" class="form-control input-default"
						placeholder="tool tip" 
                        @change="(event) => updateToolTips(field, event.target.value)"/>
                </li>
            </ul>
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
    const props = defineProps({fields: Array});
    const availableFields = computed(()=> props.fields);
    const toolTipConfig = ref({});
    function updateToolTips(field, text){
        if (text == ""){
            delete toolTipConfig.value[field];
        } else {
            toolTipConfig.value[field] = text;
        }
    }
</script>