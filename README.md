# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
We use pinia in some places for state management, see [pinia docs](https://pinia.vuejs.org/) and within this project see [DatasetStore.js](./stores/DatasetStore.js).

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server
If you're running the API server locally and want to access it from your local front end dev
server, you should run `npm run dev` and in your `.env` file set `NUXT_PUBLIC_API_BASE_URL=http://localhost:5000` 
then you'll access this website via `http://localhost:3000`.

If you're only making front end changes and want to use the deployed api server, you should add this entry: 
`127.0.0.1   local.kpndataregistry.org` in `/etc/hosts` you should run `npm run dev` and in your `.env` 
file set `NUXT_PUBLIC_API_BASE_URL=http://kpndataregistry.org/dev-api` then 
use `http://local.kpndataregistry.org:3000` to access your local server.


## Deployment
Deployment is via Jenkins. The Jenkins jobs are located here:
- [Dev](http://107.22.69.235:8080/view/Data%20Registry/job/DR%20-%20Frontend%20-%20Dev)
- [Prod](http://107.22.69.235:8080/view/Data%20Registry/job/DR%20-%20Frontend%20-%20Prod)

## Sample .env

A sample .env file is provided, `.env-sample`. It should be copied to the root directory and renamed to .env. The following environment variables are required:

```
NUXT_PUBLIC_API_SECRET=??
NUXT_PUBLIC_API_BASE_URL=??
NUXT_PUBLIC_PHENOTYPES_URL=??
```

