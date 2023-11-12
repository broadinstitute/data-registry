# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
We use pinia in some places for state management, see [pinia docs](https://pinia.vuejs.org/) and within this project see [DatasetStore.js](./stores/DatasetStore.js).

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server
We use a cookie for authentication so you need to use the same domain for the front end and the API.
The easiest way to do this is to add an entry in your `/etc/hosts` file like this:
`127.0.0.1   local.kpndataregistry.org`
If you're running the API server locally and want to access it from your local front end dev
server, in your `.env` file set `NUXT_PUBLIC_API_BASE_URL=http://local.kpndatregistry.org:5000`

If you're only making front end changes and want to use the qa deployed api server, set 
`NUXT_PUBLIC_API_BASE_URL='http://api.kpndataregistry.org'`  

In either case, use `http://local.kpndataregistry.org:3000` to access your local server.


## Deployment
Deploy to QA occurs automatically upon push to the `main` branch via [github actions](.github/workflows/continuous-integration.yml). 
You can deploy to Production by pushing a semantic version tag to the repo. 
The tag should be of the form `v#.#.#`.  
Ideally the tag should point to a commit on the `main` branch.  
You can read more about creating and publishing tags [here](https://git-scm.com/book/en/v2/Git-Basics-Tagging).


## Sample .env

A sample .env file is provided, `.env-sample`. It should be copied to the root directory and renamed to .env. The following environment variables are required:

```
NUXT_PUBLIC_API_SECRET=??
NUXT_PUBLIC_API_BASE_URL=??
NUXT_PUBLIC_PHENOTYPES_URL=??
```

