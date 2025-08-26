export interface MatrixElement {
  id: string;
  title: string;
  name?: string;
  description: string;
  category: 'Motive' | 'Means' | 'Preparation' | 'Infringement' | 'Anti-forensics';
  tactics: string[];
  preventions: MatrixPrevention[];
  detections: MatrixDetection[];
  contributors: string[];
  lastUpdated: string;
  version: string;
}

export interface MatrixPrevention {
  id: string;
  title: string;
  description: string;
  implementation: string;
  costLevel: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'difficult';
  effectiveness: number; // 1-10
  pillar: string;
  primaryPillar: string;
  secondaryPillars: string[];
}

export interface MatrixDetection {
  id: string;
  title: string;
  description: string;
  dataSource: string;
  queryExample?: string;
  falsePositiveRate: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'moderate' | 'difficult';
  requiredTools?: string[];
  alternativeTools?: string[];
  pillar: string;
  primaryPillar: string;
  alertSeverity?: 'low' | 'medium' | 'high';
  confidence?: number;
  tools?: string[];
}

export interface MatrixAttribution {
  source: string;
  url: string;
  repository: string;
  license: string;
  description: string;
}

export interface MatrixData {
  version: string;
  lastUpdated: string;
  contributors: string[];
  attribution?: MatrixAttribution;
  elements: MatrixElement[];
  metadata: {
    totalElements: number;
    categories: {
      motive: number; // motivations
      means: number; // capabilities
      preparation: number; // activities
      infringement: number; // techniques
      antiForensics: number; // techniques
    };
    lastSync: string;
    apiSource?: string;
  };
}

export interface MatrixApiResponse {
  articles: {
    title: string;
    description: string;
    id: string;
    theme: string;
    created: string;
    updated: string;
    sections?: any[];
    preventions?: any[];
    detections?: any[];
    contributors?: any[];
    platforms?: any[];
    references?: any[];
  }[];
}

export interface CachedMatrixData {
  data: MatrixData;
  cachedAt: string;
  expiresAt: string;
}