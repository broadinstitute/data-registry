# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Local Dev With Docker
```bash
docker build -t data-registry-ui .
docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3000:3000 -p 24600:24600 data-registry-ui
```
Then you should be able to access the app at http://localhost:3000 and local dev changes to vue files should be be picked up seamlessly by the docker image 
and hot reload in the browser.
## Production

Build the application for production:

```bash
npx nuxi generate --dotenv <path-to-env>
aws s3 cp --recursive .output/public s3://data-registry-vue/
```

## Sample .env
```
NUXT_PUBLIC_API_SECRET=??
NUXT_PUBLIC_API_BASE_URL=??
NUXT_PUBLIC_PHENOTYPES_URL=??
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
