<template>
  <div>
    <input type="text" class="form-control" placeholder="Search for a phenotype" v-model="search"
           @focus="listVisible = true"
           @blur="listVisible = false"
           @input="listVisible = true"/>
    <div class="byor-single-search-results-wrapper" v-if="listVisible">
      <ul id="byor_single_search_results" class="byor-single-search-results"
           v-if="filteredItems.length > 0" style="border: gray thin groove">
          <li v-for="item in filteredItems" :key="item.name" @click="selectItem(item)"  @mousedown.prevent>
          <span>
            {{ item.description }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";

const search = ref("");
const listVisible = ref(false);
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

const filteredItems = computed(() => props.filterFunction(search.value));
function selectItem(item) {
  search.value = item.description;
  props.selectItem.value = item;
  listVisible.value = false;
  console.log(`Selected item: ${JSON.stringify(item)}`);
}

</script>

<style scoped>

</style>
