<template>
    <div class="hello">
      <h1>User Login</h1>
      <div>
          <label>Username:<input v-model="user"/></label>
          <label>Password: <input type="password" v-model="password"/></label>
          <button @click="login">Login</button>
      </div>
    </div>
</template>
  
<script setup>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  const config = useRuntimeConfig();
  const user = ref("");
  const password = ref("");
  let csrf_token = "";
  let logout_token = "";
  async  function login(){
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
  