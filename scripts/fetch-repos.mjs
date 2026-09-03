#!/usr/bin/env node
/**
 * Fetch public repositories for calm-panda and write a local JSON snapshot.
 * Uses GITHUB_TOKEN when available (never written into the snapshot).
 * On API failure, keeps an existing snapshot so deploys are resilient.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const USERNAME = 'calm-panda';
const PER_PAGE = 100;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'src', 'data', 'github-repos.json');

function mapRepo(repo) {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? null,
    htmlUrl: repo.html_url,
    homepage: repo.homepage || null,
    language: repo.language ?? null,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    stargazersCount: repo.stargazers_count ?? 0,
    forksCount: repo.forks_count ?? 0,
    fork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    pushedAt: repo.pushed_at ?? null,
    updatedAt: repo.updated_at ?? null,
  };
}

async function fetchPage(page, token) {
  const url = new URL(`https://api.github.com/users/${USERNAME}/repos`);
  url.searchParams.set('type', 'owner');
  url.searchParams.set('sort', 'updated');
  url.searchParams.set('per_page', String(PER_PAGE));
  url.searchParams.set('page', String(page));

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'calm-panda-portfolio-fetch',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

async function fetchAllRepos(token) {
  const all = [];
  let page = 1;
  while (true) {
    const batch = await fetchPage(page, token);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch.map(mapRepo));
    if (batch.length < PER_PAGE) break;
    page += 1;
  }
  return all;
}

async function snapshotExists() {
  try {
    await readFile(OUT_PATH, 'utf8');
    return true;
  } catch {
    return false;
  }
}

async function writeSnapshot(repos) {
  await mkdir(dirname(OUT_PATH), { recursive: true });
  const payload = {
    fetchedAt: new Date().toISOString(),
    username: USERNAME,
    count: repos.length,
    repos,
  };
  const tmp = `${OUT_PATH}.tmp`;
  await writeFile(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await rename(tmp, OUT_PATH);
}

async function main() {
  if (process.env.SKIP_FETCH_REPOS === '1') {
    console.log('SKIP_FETCH_REPOS=1 — leaving existing snapshot unchanged.');
    return;
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  try {
    const repos = await fetchAllRepos(token);
    await writeSnapshot(repos);
    console.log(`Wrote ${repos.length} repositories to ${OUT_PATH}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (await snapshotExists()) {
      console.warn(`GitHub fetch failed (${message}). Keeping existing snapshot.`);
      process.exit(0);
    }
    console.error(`GitHub fetch failed and no snapshot exists: ${message}`);
    process.exit(1);
  }
}

main();
