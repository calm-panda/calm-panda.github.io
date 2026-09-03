# Ankit Chaurasia — Portfolio

Personal developer portfolio for [calm-panda.github.io](https://calm-panda.github.io).

Built with **Astro**, **TypeScript**, and plain CSS. Public GitHub repositories are snapshotted at build time so the deployed site stays fully static.

## Commands

Requires Node.js 22+.

```bash
npm install
npm run fetch-repos   # refresh src/data/github-repos.json
npm run dev           # local development
npm run build         # production build (also refreshes repos unless SKIP_FETCH_REPOS=1)
npm run preview       # preview the production build
npm test              # project merge unit tests
```

## Project structure

| Path | Purpose |
|------|---------|
| `src/data/site.ts` | Name, intro, about, social links, SEO copy |
| `src/data/experience.ts` | Work history |
| `src/data/manual-projects.ts` | Hand-written project cards (commercial / private / custom) |
| `src/data/repository-config.ts` | Hide, feature, include, and override GitHub repos |
| `src/data/github-repos.json` | Generated repository snapshot (committed as offline fallback) |
| `src/content/writing/` | Optional blog posts (Markdown) |
| `scripts/fetch-repos.mjs` | GitHub API fetch used locally and in CI |
| `public/resume.pdf` | Résumé download (optional) |
| `.github/workflows/deploy.yml` | Build + GitHub Pages deploy |

## Customize content

### Update the introduction

Edit `src/data/site.ts` (`headline`, `intro`, `about`, social URLs).

### Add or reorder experience

Edit the array in `src/data/experience.ts`.

### Feature, hide, or override a GitHub repository

In `src/data/repository-config.ts`:

```ts
hidden: ['calm-panda', 'calm-panda.github.io'],
featured: [{ name: 'go_runtime', order: 50 }],
overrides: {
  go_runtime: {
    title: 'Container Runtime',
    description: 'Custom description…',
    technologies: ['Go', 'Linux'],
  },
},
```

Use `include: ['some-fork']` to show a fork or archived repository.

### Add a manual project

Append an object to `src/data/manual-projects.ts`:

```ts
{
  id: 'my-project',
  title: 'My Project',
  description: 'What it does.',
  technologies: ['TypeScript', 'PostgreSQL'],
  githubUrl: 'https://github.com/calm-panda/example', // optional
  demoUrl: 'https://example.com',                     // optional
  image: '/images/my-project.png',                    // optional, under public/
  featured: true,
  order: 15,
  visible: true,
}
```

If `repository` or `githubUrl` points at a public repo that the fetch already discovered, the site emits **one** card and manual fields win.

### Add a résumé PDF

Place the file at:

```text
public/resume.pdf
```

The download link appears automatically when that file exists. If it is missing, the link is omitted (no broken button).

### Add a writing post

Create `src/content/writing/my-post.md`:

```md
---
title: Useful notes on Postgres indexes
description: A short practical write-up.
pubDate: 2026-10-01
draft: false
---

Your content here.
```

The Writing section and its navigation item appear only when at least one non-draft post exists.

### Change colors or fonts

Edit CSS custom properties in `src/styles/global.css`.

## GitHub data freshness

- Locally / in CI, `npm run fetch-repos` calls the GitHub REST API (with pagination) and writes `src/data/github-repos.json`.
- No token is required for public repos; `GITHUB_TOKEN` is used when present (CI provides one).
- Tokens are **never** written into the snapshot or client bundle.
- If the API fails and a snapshot already exists, the script keeps the old file and exits successfully so deploys stay resilient.
- The workflow refreshes the snapshot on every push to `main`, weekly, and via **Run workflow**.
- The committed JSON is an offline fallback for local builds; CI does not auto-commit refreshed data (avoids push loops).

## Deploy to GitHub Pages

This repository is a user site (`calm-panda.github.io`), so Astro is configured with `site: https://calm-panda.github.io` and `base: '/'`.

1. Push to `main` (or run the **Deploy portfolio** workflow manually).
2. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Confirm the workflow succeeds; the site will be at https://calm-panda.github.io.

Workflow permissions are limited to `contents: read`, `pages: write`, and `id-token: write`.
