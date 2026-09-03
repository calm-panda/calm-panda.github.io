import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ManualProject } from '../data/manual-projects';
import type { RepositoryConfig } from '../data/repository-config';
import {
  mergeProjects,
  splitFeatured,
  type GithubRepoSnapshot,
} from './projects';

function repo(partial: Partial<GithubRepoSnapshot> & { name: string }): GithubRepoSnapshot {
  return {
    fullName: `calm-panda/${partial.name}`,
    description: null,
    htmlUrl: `https://github.com/calm-panda/${partial.name}`,
    homepage: null,
    language: 'Go',
    topics: [],
    stargazersCount: 0,
    forksCount: 0,
    fork: false,
    archived: false,
    pushedAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...partial,
  };
}

const emptyConfig: RepositoryConfig = {
  hidden: [],
  include: [],
  featured: [],
  overrides: {},
};

describe('mergeProjects', () => {
  it('excludes forks and archived repositories by default', () => {
    const projects = mergeProjects(
      [
        repo({ name: 'keep' }),
        repo({ name: 'forked', fork: true }),
        repo({ name: 'old', archived: true }),
      ],
      [],
      emptyConfig,
    );
    assert.deepEqual(
      projects.map((p) => p.title),
      ['keep'],
    );
  });

  it('hides repositories listed in config', () => {
    const projects = mergeProjects(
      [repo({ name: 'calm-panda' }), repo({ name: 'AES' })],
      [],
      { ...emptyConfig, hidden: ['calm-panda'] },
    );
    assert.deepEqual(
      projects.map((p) => p.id),
      ['github-AES'],
    );
  });

  it('allows force-including a fork', () => {
    const projects = mergeProjects(
      [repo({ name: 'useful-fork', fork: true })],
      [],
      { ...emptyConfig, include: ['useful-fork'] },
    );
    assert.equal(projects.length, 1);
    assert.equal(projects[0]?.title, 'useful-fork');
  });

  it('applies manual overrides and collapses duplicates', () => {
    const manual: ManualProject[] = [
      {
        id: 'container',
        title: 'Container Runtime',
        description: 'Custom description',
        technologies: ['Go', 'Linux'],
        repository: 'go_runtime',
        featured: true,
        order: 1,
      },
    ];
    const projects = mergeProjects(
      [
        repo({
          name: 'go_runtime',
          description: 'API description',
          pushedAt: '2025-01-01T00:00:00Z',
        }),
      ],
      manual,
      emptyConfig,
    );
    assert.equal(projects.length, 1);
    assert.equal(projects[0]?.title, 'Container Runtime');
    assert.equal(projects[0]?.description, 'Custom description');
    assert.equal(projects[0]?.source, 'merged');
    assert.equal(projects[0]?.githubUrl, 'https://github.com/calm-panda/go_runtime');
    assert.equal(projects[0]?.featured, true);
  });

  it('keeps pure manual projects without a GitHub repository', () => {
    const projects = mergeProjects(
      [],
      [
        {
          id: 'lanflix',
          title: 'LanFlix',
          description: 'Offline streaming',
          technologies: ['Flutter'],
          featured: true,
          order: 5,
        },
      ],
      emptyConfig,
    );
    assert.equal(projects.length, 1);
    assert.equal(projects[0]?.source, 'manual');
    assert.equal(projects[0]?.githubUrl, undefined);
  });

  it('orders featured projects before remaining ones', () => {
    const projects = mergeProjects(
      [
        repo({ name: 'later', pushedAt: '2026-01-01T00:00:00Z' }),
        repo({ name: 'early', pushedAt: '2020-01-01T00:00:00Z' }),
      ],
      [],
      {
        ...emptyConfig,
        featured: [{ name: 'early', order: 1 }],
      },
    );
    const { featured, remaining } = splitFeatured(projects);
    assert.equal(featured[0]?.title, 'early');
    assert.equal(remaining[0]?.title, 'later');
  });

  it('falls back when description is missing', () => {
    const projects = mergeProjects([repo({ name: 'bare' })], [], emptyConfig);
    assert.equal(projects[0]?.description, 'Public repository on GitHub.');
    assert.deepEqual(projects[0]?.technologies, ['Go']);
  });
});
