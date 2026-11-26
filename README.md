# eCTD Sync Workbench

React + Vite eCTD workbench with a Vercel serverless endpoint at
`/api/gemini`.

## Run locally

```sh
npm ci
npm run dev
```

## Deploy to Vercel

Import the repository into Vercel with the project root set to the repository
root. The included `vercel.json` builds the Vite app into `dist`; Vercel also
deploys `api/gemini.js` as the `/api/gemini` serverless function.

Add `GEMINI_API_KEY` in the Vercel project's Environment Variables for the
Preview and Production environments, then redeploy. The key is read only by
the serverless function and is not included in the browser bundle. The app
itself still renders when the key is missing; only the AI advisor requires it.

## Build locally

```sh
npm ci
npm run build
```