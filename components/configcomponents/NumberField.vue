<template>
    <input type="number" class="form-control input-default form-control-sm"
        v-model="numberValue" @keydown="event => numericInput(event)">
</template>
<script setup>
    const emit = defineEmits(["inputReceived"]);
    const props = defineProps({startingValue: Number});
    const numberValue = ref(!!props.startingValue ? props.startingValue : "");
    const NUMBER_KEYS = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "e", ".", "-"
    ];
    function numericInput(event){
        if (!NUMBER_KEYS.includes(event.key)){
            event.preventDefault();
        }
    }
    watch(numberValue, () => {
        let floatValue = parseFloat(numberValue.value);
        floatValue = typeof floatValue === "number" ? floatValue : null;
        emit("inputReceived", floatValue);
    });
</script>