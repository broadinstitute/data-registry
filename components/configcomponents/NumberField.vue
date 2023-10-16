<template>
    <input type="number" class="form-control input-default form-control-sm"
        v-model="numberValue" @keydown="event => numericInput(event)">
</template>
<script setup>
    const emit = defineEmits(["inputReceived"]);
    const props = defineProps({startingValue: Number, integerOnly: Boolean, positiveOnly: Boolean});
    const numberValue = ref(props.startingValue === undefined ? "" : props.startingValue);
    const NUMBER_KEYS = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "e", ".", "-"
    ];
    function numericInput(event){
        if (characterNotLicit(event.key)){
            event.preventDefault();
        }
    }
    function characterNotLicit(key){
        return !NUMBER_KEYS.includes(key);
    }
   // What to do about bad input like starting with an e?
    watch(numberValue, () => {
        let floatValue = parseFloat(numberValue.value);
        floatValue = typeof floatValue === "number" ? floatValue : null;
        emit("inputReceived", floatValue);
    });
</script>