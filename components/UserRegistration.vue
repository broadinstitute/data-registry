<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
  
      <h4>Post new content:</h4>
      <div>
          <label>Title: <input v-model="newTitle"/></label>
          <label>Content: <textarea v-model="newContent"></textarea></label>
          <button @click="postNew">Post</button>
      </div>
      <h4>Create new user:</h4>
      <div>
          <label>Username:<input v-model="newUser"/></label>
          <label>Email:<input type="email" v-model="newUserEmail"/></label>
          <label>Password: <input type="password" v-model="newUserPassword"/></label>
          <button @click="registerNewUser">Register</button>
      </div>
      <h4>Here is the content of all posts:</h4>
      <ul>
        <li v-for="post in posts.value">Here is a post: {{post}}</li>
      </ul>
    </div>
</template>
  
<script setup>
  import axios from 'axios';
  const host = "http://ec2-52-23-213-123.compute-1.amazonaws.com";
  const props = defineProps({msg: String});
  const sessionToken = ref("");
  const newTitle = ref("");
  const newContent = ref("");
  const newUser = ref("");
  const newUserEmail = ref("");
  const newUserPassword = ref("");
  const posts = ref([]);
  onMounted(() => {
        axios.get(`${host}/session/token`)
        .then(response => {
          sessionToken.value = response.data;
          console.log(sessionToken.value);
          })
          .catch(error => console.log(error));
        axios.get(`${host}/jsonapi/node/article`)
          .then(response => {
            posts.value = response.data;
            console.log(response.data);
            console.log(typeof(response.data));
          })
          .catch(error => console.log(error));
    });
    function postNew(){
        let formData = {
          "data": {
            type: "node--article",
            attributes: {
              title: newTitle,
              body: {
                value: newContent,
                format: 'plain_text'
              }
            }
          }
        };
        fetch(`${host}/jsonapi/node/article`, {
          method: 'post',
          body: JSON.stringify(formData),
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic ' + btoa('api:api'),
          }
        })
          .then(response => console.log(response))
          .catch(error => console.log(error));
        newTitle = "";
        newContent = "";
    }
    function registerNewUser(){
        let userData = {
          "_links": {
            "type": {
              "href": `${host}/rest/type/user/user`
            }
          },
          "name": [{
            "value": newUser
          }],
          "pass": [{
            "value": newUserPassword
          }],
          "mail": [{
            "value": newUserEmail
          }]
        };
        fetch(`${host}/user/register?_format=hal_json`, {
          method: "post",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/hal+json",
            "Accept": "application/json",
            "X-CSRF-Token": sessionToken.value
          }
        }).then(response => {
          console.log(response);
          newUser = "";
          newUserEmail = "";
          newUserPassword = "";
        })
          .catch(error => console.log(error));
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
  