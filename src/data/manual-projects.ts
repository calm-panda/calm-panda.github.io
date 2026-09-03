/**
 * Manually maintained projects.
 *
 * Add an object to the array to showcase work that is private, commercial,
 * academic, or otherwise missing from public GitHub. A GitHub repository is
 * optional — set `githubUrl` / `repository` only when you want a link or want
 * to override an auto-discovered repo.
 *
 * Schema:
 * - id: stable unique key
 * - title: display name
 * - description: short card copy
 * - longDescription: optional longer text (unused by default cards)
 * - technologies: tag list
 * - githubUrl: optional public repository URL
 * - repository: optional "owner/name" or just "name" to merge with GitHub data
 * - demoUrl: optional live demo
 * - image: optional path under /public (e.g. "/images/project.png")
 * - featured: pin to the featured list
 * - order: lower numbers appear first within featured / remaining groups
 * - category: optional label for future filtering
 * - internal: show an Internal flag. Omitted when the project has a GitHub link.
 * - visible: set false to hide without deleting the entry
 */
export type ManualProject = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  repository?: string;
  demoUrl?: string;
  image?: string;
  featured?: boolean;
  order?: number;
  category?: string;
  internal?: boolean;
  visible?: boolean;
};

export const manualProjects: ManualProject[] = [
  {
    id: 'auriga-cam',
    title: 'Auriga-CAM',
    description:
      'Commercial real-estate CAM analysis platform built from 0 to 1 — product APIs, PostgreSQL schemas and migrations, authentication, and a MongoDB-to-PostgreSQL data-layer migration.',
    technologies: [
      'TypeScript',
      'Angular',
      'Node.js',
      'Express',
      'PostgreSQL',
      'TypeORM',
    ],
    featured: true,
    order: 10,
    category: 'commercial',
    internal: true,
    visible: true,
  },
  {
    id: 'document-pipeline',
    title: 'Document Processing Pipeline',
    description:
      'Asynchronous lease and building document workflows: queue-backed processing, OCR and LLM-based extraction, and real-time status updates from queued through completed or failed.',
    technologies: [
      'Node.js',
      'RabbitMQ',
      'Socket.io',
      'OCR',
      'LLMs',
    ],
    featured: true,
    order: 20,
    category: 'commercial',
    internal: true,
    visible: true,
  },
  {
    id: 'credit-risk',
    title: 'Credit Risk Analysis Platform',
    description:
      'News clustering and credit-risk reporting workflows with portfolio watchlists, dashboards, automated alert emails, and role-based access for admin, approver, and analyst roles.',
    technologies: [
      'Angular',
      'Node.js',
      'MongoDB',
      'RBAC',
    ],
    featured: true,
    order: 30,
    category: 'commercial',
    internal: true,
    visible: true,
  },
  {
    id: 'lanflix',
    title: 'LanFlix',
    description:
      'Flutter app for offline peer-to-peer video streaming over Wi-Fi Direct, including reliable TCP-based file transfer with no internet dependency.',
    technologies: ['Flutter', 'Wi-Fi Direct', 'TCP'],
    featured: true,
    order: 40,
    category: 'mobile',
    visible: true,
  },
];
