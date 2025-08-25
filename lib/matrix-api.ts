import { MatrixApiResponse, MatrixData, CachedMatrixData } from './matrix-types';

const MATRIX_API_URL = process.env.MATRIX_API_URL || 'https://raw.githubusercontent.com/forscie/insider-threat-matrix/refs/heads/main/insider-threat-matrix.json';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

let cachedData: CachedMatrixData | null = null;

export class MatrixAPI {
  /**
   * Fetch Matrix data with caching
   */
  static async getMatrixData(forceRefresh = false): Promise<MatrixData> {
    // Return cached data if valid and not forcing refresh
    if (cachedData && !forceRefresh && new Date() < new Date(cachedData.expiresAt)) {
      return cachedData.data;
    }

    try {
      const response = await fetch(MATRIX_API_URL, {
        next: { 
          revalidate: 86400, // 24 hours
          tags: ['matrix-data']
        },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'InsiderRiskIndex/1.0'
        },
        // Prevent caching large responses in Next.js cache
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: MatrixApiResponse = await response.json();
      const processedData = this.processApiData(apiData);

      // Cache the processed data
      const now = new Date();
      cachedData = {
        data: processedData,
        cachedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + CACHE_DURATION).toISOString()
      };

      return processedData;
    } catch (error) {
      console.error('Error fetching Matrix data:', error);
      
      // Return cached data if available, even if expired
      if (cachedData) {
        console.warn('Returning expired cached Matrix data due to fetch error');
        return cachedData.data;
      }

      // Fallback to mock data if no cache available
      return this.getFallbackData();
    }
  }

  /**
   * Process raw API data into our internal format
   */
  private static processApiData(apiData: MatrixApiResponse): MatrixData {
    // Handle case where articles might be missing or null
    const techniques = apiData?.articles && Array.isArray(apiData.articles) 
      ? apiData.articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: this.stripHtmlTags(article.description || 'No description available'),
      category: this.mapThemeToCategory(article.theme),
      tactics: [], // Not available in current API structure
      preventions: this.extractPreventionsFromSections(article.sections || [], article.id),
      detections: this.extractDetectionsFromSections(article.sections || [], article.id),
      contributors: ['ForScie Community'], // Static for now since not in API
      lastUpdated: article.updated || new Date().toISOString(),
      version: '1.0'
    }))
      : []; // Return empty array if articles is missing

    const categoryCounts = {
      motive: techniques.filter(t => t.category === 'Motive').length,
      coercion: techniques.filter(t => t.category === 'Coercion').length,
      manipulation: techniques.filter(t => t.category === 'Manipulation').length
    };

    return {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      contributors: [
        'ForScie Community (https://forscie.org/)',
        'Global Security Research Community',
        'Insider Threat Matrix Contributors'
      ],
      attribution: {
        source: 'ForScie Insider Threat Matrix',
        url: 'https://insiderthreatmatrix.org/',
        repository: 'https://github.com/forscie/insider-threat-matrix',
        license: 'Creative Commons Attribution 4.0 International',
        description: 'The ForScie Insider Threat Matrix is a community-driven knowledge base of insider threat techniques, tactics, and procedures.'
      },
      techniques,
      metadata: {
        totalTechniques: techniques.length,
        categories: categoryCounts,
        lastSync: new Date().toISOString(),
        apiSource: 'ForScie GitHub Repository'
      }
    };
  }

  /**
   * Map theme to category
   */
  private static mapThemeToCategory(theme: string): 'Motive' | 'Coercion' | 'Manipulation' {
    if (theme?.toLowerCase().includes('coercion')) return 'Coercion';
    if (theme?.toLowerCase().includes('manipulation')) return 'Manipulation';
    return 'Motive'; // Default fallback
  }

  /**
   * Extract preventions from article sections
   */
  private static extractPreventionsFromSections(sections: any[], articleId: string) {
    if (!sections || !Array.isArray(sections)) return [];
    
    const preventions: any[] = [];
    
    sections.forEach(section => {
      if (section.title && section.title.toLowerCase().includes('prevention') ||
          section.title && section.title.toLowerCase().includes('mitigation')) {
        preventions.push({
          id: `${articleId}-prevention-${preventions.length}`,
          title: section.title,
          description: this.stripHtmlTags(section.content || 'No description available'),
          implementation: 'Implementation details extracted from ForScie Matrix',
          costLevel: 'medium' as const,
          difficulty: 'moderate' as const,
          effectiveness: 8,
          pillar: this.mapToPillar(section.content || section.title || ''),
          primaryPillar: this.mapToPillar(section.content || section.title || ''),
          secondaryPillars: []
        });
      }
    });
    
    return preventions;
  }

  /**
   * Extract detections from article sections
   */
  private static extractDetectionsFromSections(sections: any[], articleId: string) {
    if (!sections || !Array.isArray(sections)) return [];
    
    const detections: any[] = [];
    
    sections.forEach(section => {
      if (section.title && section.title.toLowerCase().includes('detection') ||
          section.title && section.title.toLowerCase().includes('monitoring')) {
        detections.push({
          id: `${articleId}-detection-${detections.length}`,
          title: section.title,
          description: this.stripHtmlTags(section.content || 'No description available'),
          dataSource: 'System logs',
          alertSeverity: 'medium' as const,
          confidence: 8,
          falsePositiveRate: 0.05,
          pillar: this.mapToPillar(section.content || section.title || ''),
          primaryPillar: this.mapToPillar(section.content || section.title || ''),
          tools: ['SIEM', 'Monitoring System']
        });
      }
    });
    
    return detections;
  }

  /**
   * Generate prevention strategies from API data
   */
  private static generatePreventions(mitigations: string[], techniqueId: string) {
    return mitigations.map((mitigation, index) => ({
      id: `${techniqueId}-prevention-${index}`,
      title: `Prevention Strategy ${index + 1}`,
      description: mitigation,
      implementation: `Implement ${mitigation.toLowerCase()} to mitigate this insider threat technique.`,
      costLevel: this.randomChoice(['low', 'medium', 'high']) as 'low' | 'medium' | 'high',
      difficulty: this.randomChoice(['easy', 'moderate', 'difficult']) as 'easy' | 'moderate' | 'difficult',
      effectiveness: Math.floor(Math.random() * 5) + 6, // 6-10
      primaryPillar: this.mapToPillar(mitigation),
      secondaryPillars: []
    }));
  }

  /**
   * Generate detection methods from API data
   */
  private static generateDetections(detections: string[], techniqueId: string) {
    return detections.map((detection, index) => ({
      id: `${techniqueId}-detection-${index}`,
      title: `Detection Method ${index + 1}`,
      description: detection,
      dataSource: this.randomChoice(['logs', 'network', 'endpoint', 'email', 'database']),
      queryExample: `// Detection query for ${detection}`,
      falsePositiveRate: this.randomChoice(['low', 'medium', 'high']) as 'low' | 'medium' | 'high',
      difficulty: this.randomChoice(['easy', 'moderate', 'difficult']) as 'easy' | 'moderate' | 'difficult',
      requiredTools: ['SIEM', 'Log Analysis'],
      alternativeTools: ['Custom Scripts', 'Manual Review'],
      primaryPillar: this.mapToPillar(detection)
    }));
  }

  /**
   * Map text to appropriate pillar
   */
  private static mapToPillar(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('monitor') || lowerText.includes('log') || lowerText.includes('detect')) {
      return 'visibility';
    }
    if (lowerText.includes('train') || lowerText.includes('aware') || lowerText.includes('education')) {
      return 'coaching';
    }
    if (lowerText.includes('evidence') || lowerText.includes('record') || lowerText.includes('document')) {
      return 'evidence';
    }
    if (lowerText.includes('access') || lowerText.includes('identity') || lowerText.includes('auth')) {
      return 'identity';
    }
    if (lowerText.includes('phish') || lowerText.includes('email') || lowerText.includes('social')) {
      return 'phishing';
    }
    
    return 'visibility'; // Default
  }

  /**
   * Get a random choice from array
   */
  private static randomChoice<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  /**
   * Strip HTML tags from content
   */
  private static stripHtmlTags(html: string): string {
    if (!html || typeof html !== 'string') return '';
    
    // Remove HTML tags
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .trim();
  }

  /**
   * Fallback data when API is unavailable - return empty structure
   */
  private static getFallbackData(): MatrixData {
    return {
      version: '1.0-unavailable',
      lastUpdated: new Date().toISOString(),
      contributors: [],
      attribution: {
        source: 'ForScie Insider Threat Matrix',
        url: 'https://insiderthreatmatrix.org/',
        repository: 'https://github.com/forscie/insider-threat-matrix',
        license: 'Creative Commons Attribution 4.0 International',
        description: 'The ForScie Insider Threat Matrix is a community-driven knowledge base of insider threat techniques, tactics, and procedures.'
      },
      techniques: [], // Empty - no fallback data
      metadata: {
        totalTechniques: 0,
        categories: {
          motive: 0,
          coercion: 0,
          manipulation: 0
        },
        lastSync: new Date().toISOString(),
        apiSource: 'ForScie GitHub Repository (unavailable)'
      }
    };
  }

  /**
   * Get Matrix statistics
   */
  static async getMatrixStats(): Promise<{ totalTechniques: number; categories: Record<string, number>; lastUpdated: string; }> {
    const data = await this.getMatrixData();
    return {
      totalTechniques: data.metadata.totalTechniques,
      categories: data.metadata.categories,
      lastUpdated: data.lastUpdated
    };
  }

  /**
   * Search techniques by category
   */
  static async getTechniquesByCategory(category: 'Motive' | 'Coercion' | 'Manipulation' | 'all' = 'all') {
    const data = await this.getMatrixData();
    
    if (category === 'all') {
      return data.techniques;
    }
    
    return data.techniques.filter(tech => tech.category === category);
  }

  /**
   * Get technique by ID
   */
  static async getTechniqueById(id: string) {
    const data = await this.getMatrixData();
    return data.techniques.find(tech => tech.id === id);
  }

  /**
   * Force refresh cache
   */
  static async refreshCache(): Promise<MatrixData> {
    return this.getMatrixData(true);
  }

  /**
   * Map techniques to specific pillars
   */
  static async mapTechniquesToPillars(pillarName?: string) {
    const data = await this.getMatrixData();
    
    if (!pillarName) {
      return data.techniques;
    }
    
    return data.techniques.filter(tech => {
      return tech.preventions?.some(prev => prev.pillar === pillarName) ||
             tech.detections?.some(det => det.pillar === pillarName);
    });
  }

  /**
   * Generate pillar-specific analysis
   */
  static async generatePillarAnalysis(pillarName: string) {
    const techniques = await this.mapTechniquesToPillars(pillarName);
    
    return {
      pillarName,
      relatedTechniques: techniques.length,
      techniques: techniques.map(tech => ({
        id: tech.id,
        name: tech.title,
        description: tech.description,
        category: tech.category,
        relevantPreventions: tech.preventions?.filter(p => p.pillar === pillarName) || [],
        relevantDetections: tech.detections?.filter(d => d.pillar === pillarName) || []
      })),
      recommendations: this.generatePillarRecommendations(techniques, pillarName)
    };
  }

  /**
   * Generate recommendations for a specific pillar
   */
  private static generatePillarRecommendations(techniques: any[], pillarName: string) {
    // Generate high-level recommendations based on techniques
    const recommendations = techniques.flatMap(tech => 
      tech.preventions?.filter((p: any) => p.pillar === pillarName)
        .map((p: any) => p.description) || []
    );
    
    return [...new Set(recommendations)].slice(0, 5); // Top 5 unique recommendations
  }
}

// Named exports for backward compatibility
export const getMatrixData = MatrixAPI.getMatrixData.bind(MatrixAPI);
export const clearMatrixCache = MatrixAPI.refreshCache.bind(MatrixAPI);
export const syncMatrixData = MatrixAPI.refreshCache.bind(MatrixAPI);
export const mapTechniquesToPillars = MatrixAPI.mapTechniquesToPillars.bind(MatrixAPI);
export const generatePillarMatrixAnalysis = MatrixAPI.generatePillarAnalysis.bind(MatrixAPI);