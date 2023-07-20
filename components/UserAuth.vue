<template>
    <div class="hello">
      <h3>User Login</h3>
      <div v-if="csrf_token != ''">
        <h4>Welcome, {{ user }}!</h4>
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
          <label>Username:<input v-model="user"/></label>
          <label>Password: <input type="password" v-model="password"/></label>
          <button @click="login">Login</button>
      </div>
    </div>
</template>
  
<script setup>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  const emit = defineEmits(["csrf"]);
  const config = useRuntimeConfig();
  const user = ref("");
  const password = ref("");
  const csrf_token = ref("");
  const logout_token = ref("");
  async function login(){
      let userData = {
          "name": user.value,
          "pass": password.value
        };
        const response = await fetch(`${config.public.apiDrupalUrl}/user/login?_format=json`, 
          {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });
        const responseObject = await response.json();
        console.log(responseObject);
        if (!!responseObject.csrf_token && !!responseObject.logout_token){
          csrf_token.value = responseObject.csrf_token;
          logout_token.value = responseObject.logout_token;
          emit("csrf", csrf_token.value);
        } else {
          user.value = "";
          password.value = "";
        }
    }
  async function logout(){
    const response = await fetch(
      `${config.public.apiDrupalUrl}/user/logout?_format=json&token=${logout_token.value}`, 
          {
            method: "POST",
            body: "{}",
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "credentials": "include"
            }
          });
        const responseObject = await response.json();
        console.log(responseObject);
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  pre {
    text-align: left;
  }
  </style>
  