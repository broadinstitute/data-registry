<script setup>
// eslint-disable-next-line no-undef
  const person = reactive({
    firstName: '',
    lastName: ''
  });

  function assignName() {
    person['firstName'] = 'John';
    person['lastName'] = 'Doe';
  }

  watch(person, (newVal) => {
    console.log(`Person is now ${JSON.stringify(newVal)}`);
  });

  const fullName = computed(() => {
    return `${person['firstName']} ${person['lastName']}`;
  });
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
      <p>First: {{ person['firstName'] }} Last: {{ person['lastName'] }}</p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <button class="btn btn-primary" @click="assignName">Assign Name</button>
    </div>
  </div>
  <p>{{fullName}}</p>
</div>
</template>

<style scoped>

</style>
