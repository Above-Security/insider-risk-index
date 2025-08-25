// Shared constants and types that can be used in both client and server components

export interface PlaybookFrontmatter {
  title: string;
  description: string;
  pillar: string;
  difficulty: string;
  timeToImplement?: string;
  estimatedTime?: string;
  lastUpdated: string;
  version: string;
  author?: string;
  maturityLevel?: number;
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

export interface Playbook {
  slug: string;
  frontmatter: PlaybookFrontmatter;
  content: string;
}

export const PILLAR_NAMES = {
  visibility: 'Visibility',
  'prevention-coaching': 'Prevention & Coaching',
  'investigation-evidence': 'Investigation & Evidence', 
  'identity-saas': 'Identity & SaaS',
  'phishing-resilience': 'Phishing Resilience'
} as const;

export const PILLAR_COLORS = {
  visibility: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'prevention-coaching': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'investigation-evidence': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'identity-saas': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'phishing-resilience': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
} as const;