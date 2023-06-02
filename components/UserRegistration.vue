<template>
    <div class="hello">
      <h1>User Registration</h1>
      <h4>Create new user:</h4>
      <div>
          <label>Username:<input v-model="newUser"/></label>
          <label>Email:<input type="email" v-model="newUserEmail"/></label>
          <label>Password: <input type="password" v-model="newUserPassword"/></label>
          <button @click="registerNewUser">Register</button>
      </div>
    </div>
</template>
  
<script setup>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  const config = useRuntimeConfig();
  const newUser = ref("");
  const newUserEmail = ref("");
  const newUserPassword = ref("");
    function registerNewUser(){
      let userData = {
          "name": [{
            "value": newUser.value
          }],
          "pass": [{
            "value": newUserPassword.value
          }],
          "mail": [{
            "value": newUserEmail.value
          }]
        };
        fetch(`${config.public.apiDrupalUrl}/user/register?_format=json`, {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }).then(response => {
          console.log(response);
        })
          .catch(error => console.log(error));
          newUser.value = "";
          newUserEmail.value = "";
          newUserPassword.value = "";
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
  