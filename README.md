# Cloakly

A static React learning hub about manipulated media, responsible sharing, and the limits of adversarial perturbations. The homepage retains the supplied simulation portrait and preview images; it does not process uploaded images or run an AI service.

## Run locally

```sh
npm install
npm run dev
```

Production and quality checks:

```sh
npm run build
npm run lint
npm test
npm run preview
```

## Routes and content

- `/` — existing landing page and supplied demo; `#top`, `#simulation`, and `#how-it-works` remain available.
- `/learn` — three topic lessons, each with five flashcards and five quiz questions.
- `/learn/:topicSlug` — lesson; `/learn/:topicSlug/quiz` — quiz and completion results.
- `/blog` — curated articles; `/blog/:articleSlug` — article detail and references.

Educational content is trusted, structured local data. Source records are shared by lessons, quiz explanations, and articles. Article review dates record source checks, not ongoing monitoring. When editing content, verify the claims against the primary sources, update the review date, and run the content validation tests.

Quiz answers and results exist only in memory. Reloading, retrying, or leaving and returning starts a fresh attempt. Completion permits a downloadable SVG participation acknowledgement at any score; it is not a credential or assurance of protection. The site has no learner accounts, progress persistence, backend, or analytics.

## Static hosting

The root `vercel.json` supplies the SPA rewrite to `/index.html` required for direct links and refreshes on Vercel. Existing static files are served normally. Other static hosts need an equivalent fallback to `index.html` for app routes. Build output is `dist`.

Client-side titles and descriptions update during navigation; this release does not prerender route-specific metadata for crawlers. Deployment is separate from local validation.
