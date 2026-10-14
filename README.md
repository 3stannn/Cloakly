# Cloakly

Cloakly is a web-based project that brings together deepfake awareness, digital privacy education, and an experimental image-protection concept. Developed for NeCCSus HackFest '26 by **404 - DEV NOT FOUND**, it aims to help people understand how their images can be misused and make more informed decisions before sharing content online.

The project description, intended audience, and planned solution below are based on the team's *Cloakly NeCCSus HackFest '26 Proposal* (`Cloakly_NeCCSus_HackFest_26_Proposal (2).pdf`, sections I-V).

## Why Cloakly exists

The proposal addresses the misuse of AI-generated and manipulated media for impersonation, misinformation, and unauthorized image reuse. People who share personal photos or creative work may not understand how that content could be collected, altered, or used without their consent. Cloakly aims to make these risks and practical privacy measures easier to understand, including for users without specialized technical knowledge.

## Who it is for

- **Everyday internet and social media users** who share personal photos and want to learn about impersonation, privacy, and responsible sharing.
- **Artists, photographers, and designers** who want to understand unauthorized AI manipulation and explore protection options for their published work.
- **Content creators and online personalities** whose public images could be reused for impersonation.
- **Students and other learners** seeking accessible explanations of deepfakes, adversarial perturbations, and digital safety.

## The proposed solution and user benefits

Cloakly combines education with a planned preventive image-processing tool:

- **Image-protection workflow:** The proposal envisions uploading a supported image, validating it, applying adversarial perturbations, previewing the output, and downloading the processed image. These are carefully calculated image changes intended to interfere with selected AI models while preserving acceptable visual quality. If validated, this would give users an additional preventive step before publishing images.
- **Flashcards and quizzes:** Accessible lessons and knowledge checks help users understand deepfake risks, protective techniques, and their limitations. Scores and explanations help learners check their understanding.
- **Privacy guidance and research articles:** Educational content helps users make informed sharing decisions, verify suspicious media, and learn how to respond to possible misuse.
- **Participation acknowledgement:** Quiz completion recognizes participation in deepfake awareness and encourages learning about safer digital communities.

The intended benefits are stronger digital literacy, more informed privacy decisions, and an additional image-protection option once implemented and evaluated. The proposal describes protection as experimental: effectiveness depends on the target model and can be weakened by compression, resizing, cropping, or other transformations. Protection for faces and protection for artwork require separate validation; universal deepfake prevention is not promised.

## Current prototype

This repository currently contains a static React learning hub and an interactive concept demo:

- A landing page with a supplied portrait, effect preview, and example comparison images.
- Three learning topics, each with five flashcards and five quiz questions.
- Quiz feedback and a downloadable PDF participation acknowledgement at any completion score.
- Curated blog articles with source references.

The demo displays supplied images; it does not accept user image uploads, calculate adversarial perturbations, or run an AI service. The upload, processing, and protected-image download workflow described in the proposal remains planned work.

Quiz answers and results exist only in memory. Reloading, retrying, or leaving and returning starts a fresh attempt. Participation acknowledgements recognize completion rather than professional certification or assurance of protection. The site has no learner accounts, progress persistence, backend, or analytics.

## AI assistance during development

We used **Codex Sol, GitHub Copilot, and Gemini Flash** to assist with:

- **Checking minor issues:** Helping identify small errors and inconsistencies in the code.
- **Debugging:** Investigating errors, identifying possible causes, and suggesting fixes.
- **Code review:** Checking code for potential issues, readability, and consistency, and suggesting improvements.

These tools supported the development process. The team remains responsible for evaluating suggestions, reviewing changes, and validating the implementation. This development assistance is separate from the proposed adversarial image-protection feature.

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

- `/`: Landing page and supplied demo, with `#top`, `#simulation`, and `#how-it-works` anchors.
- `/learn`: Three topic lessons, each with five flashcards and five quiz questions.
- `/learn/:topicSlug`: Lesson; `/learn/:topicSlug/quiz`: Quiz and completion results.
- `/blog`: Curated articles; `/blog/:articleSlug`: Article detail and references.

Educational content is trusted, structured local data. Source records are shared by lessons, quiz explanations, and articles. Article review dates record source checks, not ongoing monitoring. When editing content, verify the claims against the primary sources, update the review date, and run the content validation tests.

## Static hosting

The root `vercel.json` supplies the SPA rewrite to `/index.html` required for direct links and refreshes on Vercel. Existing static files are served normally. Other static hosts need an equivalent fallback to `index.html` for app routes. Build output is `dist`.

Client-side titles and descriptions update during navigation; this release does not prerender route-specific metadata for crawlers. Deployment is separate from local validation.
