<template>
    <div class="hello">
      <h4>Post new content:</h4>
      <div>
          <label>Username:<input v-model="user"/></label>
          <label>Password: <input type="password" v-model="pass"/></label>
      </div>
      <div>
          <label>Title:<input v-model="newTitle"/></label>
          <label>Body:<input type="textarea" v-model="newContent"/></label>
          <button @click="postNew">Post</button>
      </div>
    </div>
</template>
  
<script setup>
  const host = "http://ec2-52-23-213-123.compute-1.amazonaws.com";
  const props = defineProps({msg: String});
  const sessionToken = ref("");
  let user = "";
  let pass = "";
  let newTitle = "";
  let newContent = "";
  function postNew(){
        let newArticleData = {
          "type": [{
            "target_id": "article"
          }],
          "title": [{
            "value": newTitle
          }],
          "body": [{
            "value": newContent
          }]
        };
        fetch(`${host}/node?_format=json`, {
          method: "POST",
          body: JSON.stringify(newArticleData),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": formatBasicAuth(user, pass)
          }
        }).then(response => {
          console.log(response);
        })
          .catch(error => console.log(error));
          newUser = "";
          newUserEmail = "";
          newUserPassword = "";
  }
  function formatBasicAuth(userName, password) {
    let basicAuthCredential = userName + ":" + password;
    let bace64 =  btoa(basicAuthCredential);
    return 'Basic ' + bace64;
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
  