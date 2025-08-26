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
  visibility: 'bg-above-blue-100 text-above-blue-800 dark:bg-above-blue-900 dark:text-above-blue-200',
  'prevention-coaching': 'bg-above-blue-100 text-above-blue-800 dark:bg-above-blue-900 dark:text-above-blue-200',
  'investigation-evidence': 'bg-above-lavender-100 text-above-lavender-800 dark:bg-above-lavender-900 dark:text-above-lavender-200',
  'identity-saas': 'bg-above-peach-100 text-above-peach-800 dark:bg-above-peach-900 dark:text-above-peach-200',
  'phishing-resilience': 'bg-above-rose-100 text-above-rose-800 dark:bg-above-rose-900 dark:text-above-rose-200'
} as const;