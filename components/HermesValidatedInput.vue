<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <InputText
        :id="id"
        :modelValue="modelValue"
        @update:modelValue="(value) => $emit('update:modelValue', value)"
        :type="type"
        v-tooltip="tooltip"
        :aria-labelledby="`${id}-help`"
        :class="{'p-invalid': errorMessage}"
    />
    <small :id="`${id}-help`" class="p-error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  tooltip: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number'].includes(value)
  }
});

const emit = defineEmits(['update:modelValue']);

const { errorMessage, value } = useField(() => props.id);
</script>
