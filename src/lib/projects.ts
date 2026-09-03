import type { ManualProject } from '../data/manual-projects';
import type { RepositoryConfig } from '../data/repository-config';

export type GithubRepoSnapshot = {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazersCount: number;
  forksCount: number;
  fork: boolean;
  archived: boolean;
  pushedAt: string | null;
  updatedAt: string | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
  order: number;
  stars: number;
  language?: string;
  source: 'github' | 'manual' | 'merged';
  internal?: boolean;
  pushedAt?: string | null;
};

const FALLBACK_DESCRIPTION = 'Public repository on GitHub.';

function normalizeRepoKey(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.includes('/')) {
    return trimmed.split('/').pop() ?? trimmed;
  }
  return trimmed;
}

function repoNameFromGithubUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) return undefined;
    const parts = parsed.pathname.split('/').filter(Boolean);
    return parts[1] ? normalizeRepoKey(parts[1]) : undefined;
  } catch {
    return undefined;
  }
}

function manualRepoKey(project: ManualProject): string | undefined {
  if (project.repository) return normalizeRepoKey(project.repository);
  if (project.githubUrl) return repoNameFromGithubUrl(project.githubUrl);
  return undefined;
}

function technologiesFromRepo(repo: GithubRepoSnapshot): string[] {
  const tags = [...repo.topics];
  if (repo.language && !tags.some((t) => t.toLowerCase() === repo.language!.toLowerCase())) {
    tags.unshift(repo.language);
  }
  return tags.slice(0, 8);
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    const aTime = a.pushedAt ? Date.parse(a.pushedAt) : 0;
    const bTime = b.pushedAt ? Date.parse(b.pushedAt) : 0;
    return bTime - aTime;
  });
}

export function mergeProjects(
  repos: GithubRepoSnapshot[],
  manual: ManualProject[],
  config: RepositoryConfig,
): Project[] {
  const hidden = new Set(config.hidden.map(normalizeRepoKey));
  const include = new Set(config.include.map(normalizeRepoKey));
  const featuredMap = new Map(
    config.featured.map((item) => [normalizeRepoKey(item.name), item.order]),
  );

  const manualByRepo = new Map<string, ManualProject>();
  const pureManual: ManualProject[] = [];

  for (const project of manual) {
    if (project.visible === false) continue;
    const key = manualRepoKey(project);
    if (key) {
      manualByRepo.set(key, project);
    } else {
      pureManual.push(project);
    }
  }

  const usedRepoKeys = new Set<string>();
  const projects: Project[] = [];

  for (const repo of repos) {
    const key = normalizeRepoKey(repo.name);
    const override = config.overrides[repo.name] ?? config.overrides[key];
    const manualMatch = manualByRepo.get(key);

    if (override?.visible === false) continue;
    if (hidden.has(key) && !manualMatch) continue;

    const forceInclude = include.has(key);
    if ((repo.fork || repo.archived) && !forceInclude && !manualMatch) continue;

    usedRepoKeys.add(key);

    const featuredFromConfig = featuredMap.has(key);
    const featuredOrder = featuredMap.get(key);

    const title =
      manualMatch?.title ??
      override?.title ??
      repo.name;

    const description =
      manualMatch?.description ??
      override?.description ??
      repo.description ??
      FALLBACK_DESCRIPTION;

    const technologies =
      manualMatch?.technologies ??
      override?.technologies ??
      technologiesFromRepo(repo);

    const githubUrl = manualMatch?.githubUrl ?? repo.htmlUrl;

    let demoUrl: string | undefined;
    if (manualMatch?.demoUrl) {
      demoUrl = manualMatch.demoUrl;
    } else if (override?.demoUrl === null) {
      demoUrl = undefined;
    } else if (override?.demoUrl) {
      demoUrl = override.demoUrl;
    } else if (repo.homepage) {
      demoUrl = repo.homepage;
    }

    const image = manualMatch?.image ?? override?.image;
    const featured =
      manualMatch?.featured ??
      override?.featured ??
      featuredFromConfig ??
      false;

    const order =
      manualMatch?.order ??
      override?.order ??
      featuredOrder ??
      1000;

    projects.push({
      id: manualMatch?.id ?? `github-${repo.name}`,
      title,
      description,
      technologies,
      githubUrl,
      demoUrl,
      image,
      featured: Boolean(featured),
      order,
      stars: repo.stargazersCount,
      language: repo.language ?? undefined,
      source: manualMatch ? 'merged' : 'github',
      internal: Boolean(manualMatch?.internal) && !githubUrl,
      pushedAt: repo.pushedAt,
    });
  }

  for (const [key, project] of manualByRepo) {
    if (usedRepoKeys.has(key)) continue;
    if (project.visible === false) continue;

    projects.push({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      image: project.image,
      featured: Boolean(project.featured),
      order: project.order ?? 1000,
      stars: 0,
      source: 'manual',
      internal: Boolean(project.internal) && !project.githubUrl,
      pushedAt: null,
    });
  }

  for (const project of pureManual) {
    projects.push({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      image: project.image,
      featured: Boolean(project.featured),
      order: project.order ?? 1000,
      stars: 0,
      source: 'manual',
      internal: Boolean(project.internal) && !project.githubUrl,
      pushedAt: null,
    });
  }

  return sortProjects(projects);
}

export function splitFeatured(projects: Project[]): {
  featured: Project[];
  remaining: Project[];
} {
  return {
    featured: projects.filter((p) => p.featured),
    remaining: projects.filter((p) => !p.featured),
  };
}
