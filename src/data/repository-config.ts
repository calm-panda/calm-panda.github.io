/**
 * Controls how public GitHub repositories appear on the site.
 *
 * - hidden: never show
 * - include: force-show even if the repo is a fork or archived
 * - featured: pin into the featured list (order optional)
 * - overrides: replace title, description, technologies, demo URL, image, etc.
 */
export type RepositoryOverride = {
  title?: string;
  description?: string;
  technologies?: string[];
  demoUrl?: string | null;
  image?: string;
  featured?: boolean;
  order?: number;
  visible?: boolean;
};

export type RepositoryConfig = {
  hidden: string[];
  include: string[];
  featured: Array<{ name: string; order?: number }>;
  overrides: Record<string, RepositoryOverride>;
};

export const repositoryConfig: RepositoryConfig = {
  hidden: ['calm-panda', 'calm-panda.github.io'],
  include: [],
  featured: [
    { name: 'go_runtime', order: 50 },
    { name: 'LM-Trader', order: 60 },
    { name: 'Go-Compiler', order: 70 },
    { name: 'AES', order: 80 },
  ],
  overrides: {
    go_runtime: {
      title: 'Container Runtime',
      description:
        'Minimal Go container runtime exploring Linux namespaces (PID, MNT, NET) and cgroups to run programs in isolated filesystems and process trees.',
      technologies: ['Go', 'Linux', 'namespaces', 'cgroups'],
    },
    'Go-Compiler': {
      title: 'Mini Language Interpreter',
      description:
        'Small language frontend in Go: lexer, recursive-descent parser, AST, and a tree-walking interpreter with assignments, arithmetic, and print.',
      technologies: ['Go', 'compilers', 'parsers', 'AST'],
    },
    AES: {
      title: 'Rijndael AES',
      description:
        'Educational Python implementation of AES based on FIPS-197, covering key expansion and round transformations. Not intended for production use.',
      technologies: ['Python', 'cryptography', 'FIPS-197'],
    },
    'LM-Trader': {
      title: 'LM-Trader',
      description:
        'AI-assisted NSE/BSE trading app for Raspberry Pi — Upstox API, DeepSeek signals, HTMX + Jinja2 UI, with paper trading and explicit confirmation before live orders.',
      technologies: [
        'Python',
        'FastAPI',
        'HTMX',
        'SQLite',
        'Upstox',
      ],
    },
    EventHUB: {
      title: 'EventHUB',
      description:
        'Android event-management app for campus cultural fests — browse events, track favourites, and surface notifications.',
      order: 200,
    },
    '16-bit-assembler-simulator': {
      title: '16-bit Assembler & Simulator',
      description:
        'Assembler and simulator for a 16-bit instruction set, including register dumps, flags, and memory-access analysis.',
      order: 210,
    },
    'collaborative-filtering-model': {
      title: 'Multi-Criteria Collaborative Filtering',
      description:
        'Deep multi-criteria collaborative filtering model implemented from a research paper.',
      order: 220,
    },
    hyprland_dotfiles: {
      order: 300,
    },
    sway_dotfiles: {
      order: 310,
    },
  },
};
