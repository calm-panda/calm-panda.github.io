export const site = {
  name: 'Ankit Chaurasia',
  role: 'Software Engineer',
  location: 'India',
  email: 'ankitc1422@gmail.com',
  github: 'https://github.com/calm-panda',
  githubUsername: 'calm-panda',
  linkedin: 'https://linkedin.com/in/calm-panda',
  url: 'https://calm-panda.github.io',
  title: 'Ankit Chaurasia — Software Engineer',
  description:
    'Software engineer building reliable products across backend systems, data, infrastructure, and the features people use.',
  headline: 'I build services, data, and the infrastructure products run on.',
  intro:
    'Software engineer in India. I work across backend services, data layers, and the infrastructure that keeps products reliable.',
  about: [
    'I build practical software for real products — APIs, data models, background workflows, and the interfaces that sit on top of them. I care about clear ownership, predictable behavior, and systems that stay understandable as they grow.',
    'I like understanding how things work under the hood: databases, queues, deployment paths, and the trade-offs between speed, correctness, and maintainability. That perspective shapes how I design features and how I debug them.',
    'My interests span backend and product engineering, distributed systems, Linux, networking, infrastructure automation, mobile applications, and AI-powered software. I learn by building projects that explore those fundamentals.',
  ],
  education:
    'B.Tech in Computer Science and Engineering, IIIT Delhi, graduated May 2024.',
  contactInvite:
    'Open to conversations about engineering roles, technical problems, and interesting systems work. Reach out by email or LinkedIn.',
  footerNote: 'Built by Ankit Chaurasia.',
} as const;

export type NavItem = {
  id: string;
  label: string;
};

export const baseNav: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];
