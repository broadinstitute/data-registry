<template>
  <div @blur="hasFocus = false" tabindex="0" style="border: gray thin groove" ref="">
    <input type="text" class="form-control" placeholder="Search for a phenotype" v-model="search" @focus="hasFocus = true"/>
    <div class="byor-single-search-results-wrapper" v-if="hasFocus">
      <div id="byor_single_search_results" class="byor-single-search-results"
           v-if="filteredItems.length > 0">
        <div v-for="item in filteredItems" :key="item.name" @click="selectItem(item)">
          <span>
            {{ item.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";

const search = ref("");
const hasFocus = ref(false);
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  filterFunction: {
    type: Function,
    required: true
  },
  selectItem: {
    type: Object,
    required: true
  }
})

function setFocus() {
  hasFocus.value = true;
}

const filteredItems = computed(() => props.filterFunction(search.value));
function selectItem(item) {
  search.value = item.description;
  props.selectItem.value = item;
  hasFocus.value = false;
  console.log(`Selected item: ${JSON.stringify(item)}`);
}

</script>

<style scoped>

</style>
