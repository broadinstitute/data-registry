<template>
  <div class="hello">
    <UserAuth @csrf="token => storeToken(token)"></UserAuth>
    <PostNewContent></PostNewContent>
  </div>
</template>
<script setup>
  const csrf_token = ref("");
  function storeToken(newCsrfToken){
    csrf_token.value = newCsrfToken;
    console.log(`Index page has received token:${csrf_token.value}`);
  }
</script>