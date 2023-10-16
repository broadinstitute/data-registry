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
        let inputKey = event.key;
        if (inputKey === "Backspace"){
            return;
        }
        let notionalNumber = parseFloat(`${numberValue.value.toString()}${inputKey}`);
        console.log(notionalNumber);
        if (Number.isNaN(notionalNumber)){
            event.preventDefault();
        }
    }
    function characterNotLicit(key){
        return !NUMBER_KEYS.includes(key);
    }
    function disallowedNumberType(key){
        return (!!props.integerOnly && (key === "e" || key === "."));
    }
    function disallowedSign(key){
        return (!!props.positiveOnly && key === "-");
    }
    function duplicateE(key){
        console.log(numberValue.value);
        return (key === "e" && numberValue.value.toString().includes("e"));
    }
    function duplicateMinus(key){
        return key === "-" && numberValue.value.toString().includes("-");
    }
    watch(numberValue, () => {
        let floatValue = parseFloat(numberValue.value);
        floatValue = typeof floatValue === "number" ? floatValue : null;
        emit("inputReceived", floatValue);
    });
</script>