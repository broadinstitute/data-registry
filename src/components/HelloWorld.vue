<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex" target="_blank" rel="noopener">vuex</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
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
      <li v-for="post in posts">Here is a post: {{post}}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',

  mounted(){
    axios.get('//localhost/session/token')
      .then(response => {this.sessionToken = response.data;
      console.log(this.sessionToken);})
      .catch(error => console.log(error));
    axios.get('//localhost/jsonapi/node/article')
      .then(response => this.posts = response.data)
      .catch(error => console.log(error));
  },
  props: {
    msg: String
  },
  data: function(){
    return {
      sessionToken: "",
      posts: null,
      newTitle: "",
      newContent: "",
      newUser: "",
      newUserEmail: "",
      newUserPassword: ""
    }
  },
  methods: {
    postNew(){
      let formData = {
        "data": {
          type: "node--article",
          attributes: {
            title: this.newTitle,
            body: {
              value: this.newContent,
              format: 'plain_text'
            }
          }
        }
      };
      fetch('//localhost/jsonapi/node/article', {
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
      this.newTitle = "";
      this.newContent = "";
    },
    registerNewUser(){
      let userData = {
        "_links": {
          "type": {
            "href": "//localhost/rest/type/user/user"
          }
        },
        "name": [{
          "value": this.newUser
        }],
        "pass": [{
          "value": this.newUserPassword
        }],
        "mail": [{
          "value": this.newUserEmail
        }]
      };
      fetch("//localhost/user/register?_format=hal_json", {
        method: "post",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/hal+json",
          "Accept": "application/json",
          "X-CSRF-Token": this.sessionToken
        }
      }).then(response => {
        console.log(response);
        this.newUser = "";
        this.newUserEmail = "";
        this.newUserPassword = "";
      })
        .catch(error => console.log(error));
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
