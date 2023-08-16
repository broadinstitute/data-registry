<template>
    <a href="https://hugeampkpncms.org/node/44" target="_blank" class="tutorial-link">
        Tool tips tutorial
    </a>
    <div class="row dr-builder-ui">
        <div class="col-md-12 col">
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
<script setup>
    import { useConfigBuilderStore } from '@/stores/ConfigBuilderStore';

    const store = useConfigBuilderStore();
    const props = defineProps({fields: Array});
    const emit = defineEmits(["toolTipsChanged"]);
    const availableFields = computed(()=> props.fields);
    const fieldNameOld = computed(() => store.getLatestFieldRename[0]);
    const fieldNameNew = computed(() => store.getLatestFieldRename[1]);
    const toolTipConfig = ref({});
    function updateToolTips(field, text){
        if (text == ""){
            delete toolTipConfig.value[field];
        } else {
            toolTipConfig.value[field] = text;
        }
        emitToolTips();
    }
    watch (availableFields, (newFields, oldFields)=> {
        if (newFields.length < oldFields.length){
            oldFields.forEach((oldField)=>{
                if (!newFields.includes(oldField)){
                    delete toolTipConfig.value[oldField];
                }
            });
            emitToolTips();
        }
    });
    watch(fieldNameOld, () => {
        // Field names are already updated within the list of available fields.
        // We need to update it in the list of selected fields.
        if (!!toolTipConfig.value[fieldNameOld.value]){
            let toolTip = toolTipConfig.value[fieldNameOld.value];
            delete toolTipConfig.value[fieldNameOld.value];
            toolTipConfig.value[fieldNameNew.value] = toolTip;
            emitToolTips();
        }
    });
    function emitToolTips(){
        emit("toolTipsChanged", toolTipConfig.value);
    }
</script>