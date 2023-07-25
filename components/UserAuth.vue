<template>
    <div class="hello">
      <h3>User Login</h3>
      <div v-if="csrf_token != ''">
        <h4>Welcome, {{ user }}!</h4>
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
  import VueCookies from 'vue-cookies';
  const config = useRuntimeConfig();
  const user = ref($cookies.isKey("_byor_user") ? $cookies.get("_byor_user") : "");
  const password = ref("");
  // Here we check for an existing token
  const csrf_token = ref($cookies.isKey("_byor_csrf_token") 
    ? $cookies.get("_byor_csrf_token") : "");
  const logout_token = ref($cookies.isKey("_byor_logout_token") 
    ? $cookies.get("_byor_logout_token") : "");
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
        if (!!responseObject.current_user){
          csrf_token.value = responseObject.csrf_token;
          logout_token.value = responseObject.logout_token;
          verifyToken();
        } else {
          user.value = "";
        }
        password.value = "";
    }
  async function verifyToken(){
    const response = await fetch(`${config.public.apiDrupalUrl}/user/login`, 
      {
        method: "GET",
        headers: {
          "X-CSRF-Token": csrf_token.value
        }
      });
      console.log(response);
      if (response.status == 200){
        console.log("Success!");
        if (!$cookies.isKey("_byor_csrf_token")){
          $cookies.set("_byor_csrf_token", csrf_token.value);
          $cookies.set("_byor_logout_token", logout_token.value);
          $cookies.set("_byor_user", user.value)
        } else {
          console.log("Still logged in.");
        }
      }
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
  