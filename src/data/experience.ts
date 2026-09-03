export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  technologies: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: 'scry-ai',
    company: 'Scry AI',
    role: 'Software Engineer',
    location: 'Gurugram, India',
    start: 'Jul 2024',
    end: 'Present',
    bullets: [
      'Built Auriga-CAM from 0 to 1 — Angular UI, Node.js/Express APIs, PostgreSQL schemas and auth — and migrated the legacy MongoDB layer to PostgreSQL.',
      'Built queue-backed document processing with OCR and LLM extraction, live status updates, and Docker/Nginx deployments with cloud storage and monitoring.',
      'Contributed to a credit-risk news platform with watchlists, reporting, alerts, and role-based access, and improved testing, security, and the Angular upgrade.',
    ],
    technologies: [
      'TypeScript',
      'Angular',
      'Node.js',
      'Express',
      'PostgreSQL',
      'MongoDB',
      'TypeORM',
      'RabbitMQ',
      'Socket.io',
      'Docker',
      'Azure',
      'AWS S3',
      'Grafana',
    ],
  },
  {
    id: 'fundwave',
    company: 'Fundwave',
    role: 'MLOps Intern',
    location: 'Gurugram, India',
    start: 'May 2023',
    end: 'Jul 2023',
    bullets: [
      'Built Node.js microservices for automated bank reconciliation and incremental-learning ML pipelines.',
      'Documented REST APIs with OpenAPI/Swagger specifications.',
    ],
    technologies: ['Node.js', 'OpenAPI', 'Swagger', 'ML pipelines'],
  },
  {
    id: 'microbiome-lab',
    company: 'IIIT Delhi Microbiome Lab',
    role: 'Full Stack Developer',
    location: 'New Delhi, India',
    start: 'Mar 2023',
    end: 'May 2023',
    bullets: [
      'Shipped the lab website and an interactive research platform using React and Python/FastAPI for exploring microbial communities by functional signatures.',
    ],
    technologies: ['React', 'Python', 'FastAPI'],
  },
];
