<script setup>
  const person = ref({
    firstName: '',
    lastName: ''
  });

  function assignName() {
    person.value['firstName'] = 'John';
    person.value['lastName'] = 'Doe';
  }
</script>

<template>
<div class="container">
  <div class="row">
    <div class="col">
      <input type="text" class="form-control" placeholder="First Name" v-model="person['firstName']"/>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <input type="text" class="form-control" placeholder="Last Name" v-model="person['lastName']"/>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>{{ person['firstName'] }} {{ person['lastName'] }}</p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <button class="btn btn-primary" @click="assignName">Assign Name</button>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
