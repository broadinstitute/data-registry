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
`NUXT_PUBLIC_API_BASE_URL='http://dev.kpndataregistry.org'`  

In either case, use `http://local.kpndataregistry.org:3000` to access your local server.


## Deployment
Deployment is via Jenkins. The Jenkins jobs are located here:
- [Dev](http://107.22.69.235:8080/view/Data%20Registry/job/DR%20-%20Frontend%20-%20Dev)
- [Prod](http://107.22.69.235:8080/view/Data%20Registry/job/DR%20-%20Frontend%20-%20Prod)

## Sample .env

A sample .env file is provided, `.env-sample`. It should be copied to the root directory and renamed to .env. The following environment variables are required:

```
NUXT_PUBLIC_API_SECRET=??1
NUXT_PUBLIC_API_BASE_URL=??
NUXT_PUBLIC_PHENOTYPES_URL=??
```

