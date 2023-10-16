<template>
    <input type="number" class="form-control input-default form-control-sm"
        v-model="numberValue" @keydown="event => numericInput(event)">
</template>
<script setup>
    const emit = defineEmits(["inputReceived"]);
    const props = defineProps({startingValue: Number, integerOnly: Boolean, positiveOnly: Boolean});
    const numberValue = ref(props.startingValue === undefined ? "" : props.startingValue);
    const LICIT_KEYS = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
        "e", "E", ".", "-", "Backspace", "Delete", "Insert", "ArrowLeft", "ArrowRight"
    ];
    function numericInput(event){
        if (!LICIT_KEYS.includes(event.key)){
            event.preventDefault();
        }
    }
   // What to do about bad input like starting with an e?
    watch(numberValue, () => {
        let floatValue = parseFloat(numberValue.value);
        floatValue = Number.isNaN(floatValue) ? null : floatValue;
        emit("inputReceived", floatValue);
    });
</script>