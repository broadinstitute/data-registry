<template>
  <div class="dr-modal">
    <div class="dr-container">
      <div class="dr-modal-body">
        <p>{{props.statusMessage}}</p>
        <div class="progress" v-if="showProgress">
          <div class="progress-bar" role="progressbar" :aria-valuenow="props.progress" aria-valuemin="0" aria-valuemax="100" :style="progressWidth"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({statusMessage: String, progress: Number, showProgress: Boolean})

const progressWidth = computed(() => {
  return {
    width: `${props.progress}%`
  }
})
</script>

<style>
.dr-modal {
  background-color: rgba(0,0,0,0.4); /* Transparent dimmed overlay */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  z-index: 2000;
}

.dr-modal .dr-container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  width: 200px;
}

.dr-modal .dr-modal-body {
  display: inline-block;
  background-color: white;
  border: 1px solid black;
  border-radius: 20px;
  padding: 10px;
  width: auto;
}

</style>
