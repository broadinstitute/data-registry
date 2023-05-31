<!--modified from  https://github.com/frikinside/vue3-simple-typeahead -->
<template>
  <div :id="wrapperId" class="simple-typeahead">
    <input
        ref="inputRef"
        :id="id"
        class="form-control"
        type="text"
        required
        :placeholder="placeholder"
        v-model="input"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.enter.prevent="selectCurrentSelection"
        @keydown.esc.prevent="onEscape"
        autocomplete="off"
        :disabled="disabled"
    />
    <div v-if="isListVisible" class="simple-typeahead-list">
      <div class="simple-typeahead-list-header"></div>
      <div
          class="simple-typeahead-list-item"
          :class="{ 'bg-primary text-white': currentSelectionIndex === index }"
          v-for="(item, index) in filteredItems"
          :key="index"
          @mousedown.prevent
          @click="selectItem(item)"
          @mouseenter="currentSelectionIndex = index">
        {{props.itemDisplay(item)}}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  initialInput: {
    type: String,
    default: '',
  },
  filterFunction: {
    type: Function,
    required: true
  },
  placeholder: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  itemDisplay: {
    type: Function,
    required: true
  },
  minInputLength: {
    type: Number,
    default: 2,
    validator: (prop) => {
      return prop >= 0;
    },
  },
  minItemLength: {
    type: Number,
    default: 0,
    validator: (prop) => {
      return prop >= 0;
    },
  },
  selectOnTab: {
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['blur'])
const input = ref('');
const inputVal = ref(null);
const inputRef = ref(null);
const initialInput = toRef(props, 'initialInput');

const filteredItems = computed(() => props.filterFunction(input.value));
const wrapperId = computed(() => `${props.id}-wrapper`);
const isInputFocused = ref(false);
const currentSelectionIndex = ref(0);
const currentSelection = computed(() => isListVisible.value && currentSelectionIndex.value < filteredItems.value.length ? filteredItems.value[currentSelectionIndex.value] : undefined);
const isListVisible = computed(() => isInputFocused.value && input.value.length >= props.minInputLength && filteredItems.value.length > props.minItemLength);
function onFocus() {
  isInputFocused.value = true;
}

watch(initialInput, (val) => {
  input.value = val;
}, {immediate: true});


function onBlur() {
  isInputFocused.value = false;
  emit('blur', {value: inputVal.value ?? input.value, id: props.id});
}

function onArrowDown() {
  if (isListVisible.value && currentSelectionIndex.value < filteredItems.value.length - 1) {
    currentSelectionIndex.value++;
  }
  scrollSelectionIntoView();
}

function onArrowUp() {
  if (isListVisible.value && currentSelectionIndex.value > 0) {
    currentSelectionIndex.value--;
  }
  scrollSelectionIntoView();
}

function selectCurrentSelection() {
  if (currentSelection.value) {
    selectItem(currentSelection.value);
  }
}

function scrollSelectionIntoView() {
  setTimeout(() => {
    const list_node = document.querySelector(`#${wrapperId.value} .simple-typeahead-list`);
    const active_node = document.querySelector(`#${wrapperId.value} .simple-typeahead-list-item.bg-primary.text-white`);
    if (!(active_node.offsetTop >= list_node.scrollTop && active_node.offsetTop + active_node.offsetHeight < list_node.scrollTop + list_node.offsetHeight)) {
      let scroll_to = 0;
      if (active_node.offsetTop > list_node.scrollTop) {
        scroll_to = active_node.offsetTop + active_node.offsetHeight - list_node.offsetHeight;
      } else if (active_node.offsetTop < list_node.scrollTop) {
        scroll_to = active_node.offsetTop;
      }
      list_node.scrollTo(0, scroll_to);
    }
  });
}

function selectItem(item) {
  input.value = props.itemDisplay(item);
  inputVal.value = item;
  inputRef.value.blur();
}

function onInput() {
  currentSelectionIndex.value = 0;
  inputVal.value = null;
}

function onEscape() {
  inputRef.value.blur();
}


</script>

<style scoped>
.simple-typeahead {
  position: relative;
  width: 100%;
}
.simple-typeahead > input {
  margin-bottom: 0;
}
.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 0.1rem solid #d1d1d1;
  z-index: 9;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-header {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-footer {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item {
  cursor: pointer;
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item:last-child {
  border-bottom: none;
}

</style>
