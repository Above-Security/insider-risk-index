import { MatrixApiResponse, MatrixData, MatrixElement, CachedMatrixData, MatrixPrevention, MatrixDetection } from './matrix-types';

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
      // Using cached Matrix data
      return cachedData.data;
    }

    try {
      // Fetching fresh Matrix data from API
      const response = await fetch(MATRIX_API_URL, {
        next: { 
          revalidate: 86400, // 24 hours
          tags: ['matrix-data']
        },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'InsiderRiskIndex/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: MatrixApiResponse = await response.json();
      const processedData = this.processApiData(apiData);

      // Successfully processed Matrix API data

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

      // Fallback to empty data if no cache available
      return this.getFallbackData();
    }
  }

  /**
   * Process raw API data into our internal format
   */
  private static processApiData(apiData: MatrixApiResponse): MatrixData {
    const elements: MatrixElement[] = [];
    
    // Process each article and its sections
    if (apiData?.articles && Array.isArray(apiData.articles)) {
      apiData.articles.forEach(article => {
        // Each article represents a theme/category
        const category = this.mapThemeToCategory(article.theme);
        
        // Skip adding the article itself - it's a theme/category, not a technique
        
        // Process each section as a separate technique
        if (article.sections && Array.isArray(article.sections)) {
          article.sections.forEach(section => {
            if (section.id && section.title) {
              // Extract preventions from the section
              const preventions = this.extractPreventions(section);
              const detections = this.extractDetections(section);
              
              elements.push({
                id: section.id,
                title: section.title,
                description: this.stripHtmlTags(section.description || ''),
                category: category,
                tactics: [],
                preventions: preventions,
                detections: detections,
                contributors: this.extractContributors(section),
                lastUpdated: section.updated || section.created || article.updated || new Date().toISOString(),
                version: '1.0'
              });
              
              // Process subsections as additional techniques if they exist
              if (section.subsections && Array.isArray(section.subsections)) {
                section.subsections.forEach((subsection: any) => {
                  if (subsection.id && subsection.title) {
                    elements.push({
                      id: subsection.id,
                      title: subsection.title,
                      description: this.stripHtmlTags(subsection.description || ''),
                      category: category,
                      tactics: [],
                      preventions: this.extractPreventions(subsection),
                      detections: this.extractDetections(subsection),
                      contributors: this.extractContributors(subsection),
                      lastUpdated: subsection.updated || subsection.created || section.updated || new Date().toISOString(),
                      version: '1.0'
                    });
                  }
                });
              }
            }
          });
        }
      });
    }

    // Calculate category counts for all 5 themes
    const categoryCounts = {
      motive: elements.filter(t => t.category === 'Motive').length,
      means: elements.filter(t => t.category === 'Means').length,
      preparation: elements.filter(t => t.category === 'Preparation').length,
      infringement: elements.filter(t => t.category === 'Infringement').length,
      antiForensics: elements.filter(t => t.category === 'Anti-forensics').length
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
      elements,
      metadata: {
        totalElements: elements.length,
        categories: categoryCounts,
        lastSync: new Date().toISOString(),
        apiSource: 'ForScie GitHub Repository'
      }
    };
  }

  /**
   * Extract preventions from a section
   */
  private static extractPreventions(section: any): any[] {
    const preventions: any[] = [];
    
    if (section.preventions && Array.isArray(section.preventions)) {
      section.preventions.forEach((prevention: any) => {
        preventions.push({
          id: prevention.id || `${section.id}-prevention-${preventions.length}`,
          title: prevention.title || 'Prevention Strategy',
          description: this.stripHtmlTags(prevention.description || ''),
          implementation: this.extractImplementation(prevention.description),
          costLevel: this.estimateCostLevel(prevention),
          difficulty: this.estimateDifficulty(prevention),
          effectiveness: this.estimateEffectiveness(prevention),
          pillar: this.mapToPillar(prevention.title + ' ' + (prevention.description || '')),
          primaryPillar: this.mapToPillar(prevention.title + ' ' + (prevention.description || '')),
          secondaryPillars: []
        });
      });
    }
    
    return preventions;
  }

  /**
   * Extract detections from a section
   */
  private static extractDetections(section: any): any[] {
    const detections: any[] = [];
    
    if (section.detections && Array.isArray(section.detections)) {
      section.detections.forEach((detection: any) => {
        detections.push({
          id: detection.id || `${section.id}-detection-${detections.length}`,
          title: detection.title || 'Detection Method',
          description: this.stripHtmlTags(detection.description || ''),
          dataSource: this.extractDataSource(detection),
          alertSeverity: this.estimateSeverity(detection),
          confidence: this.estimateConfidence(detection),
          falsePositiveRate: 0.1, // Default estimate
          pillar: this.mapToPillar(detection.title + ' ' + (detection.description || '')),
          primaryPillar: this.mapToPillar(detection.title + ' ' + (detection.description || '')),
          tools: this.extractTools(detection)
        });
      });
    }
    
    return detections;
  }

  /**
   * Extract contributors from a section
   */
  private static extractContributors(section: any): string[] {
    const contributors: string[] = ['ForScie Community'];
    
    if (section.contributors && Array.isArray(section.contributors)) {
      section.contributors.forEach((contributor: any) => {
        if (contributor.name) {
          contributors.push(contributor.name);
        }
      });
    }
    
    if (section.preventions && Array.isArray(section.preventions)) {
      section.preventions.forEach((prevention: any) => {
        if (prevention.contributors && Array.isArray(prevention.contributors)) {
          prevention.contributors.forEach((contributor: any) => {
            if (contributor.name && !contributors.includes(contributor.name)) {
              contributors.push(contributor.name);
            }
          });
        }
      });
    }
    
    return [...new Set(contributors)]; // Remove duplicates
  }

  /**
   * Extract implementation details from description
   */
  private static extractImplementation(description: string): string {
    const cleaned = this.stripHtmlTags(description || '');
    // Extract implementation approaches if present
    if (cleaned.includes('Implementation Approaches')) {
      const parts = cleaned.split('Implementation Approaches');
      if (parts[1]) {
        return parts[1].split('Operational Principles')[0].trim();
      }
    }
    return cleaned.substring(0, 200) + '...';
  }

  /**
   * Extract data source from detection
   */
  private static extractDataSource(detection: any): string {
    const description = this.stripHtmlTags(detection.description || '');
    if (description.includes('log')) return 'System logs';
    if (description.includes('network')) return 'Network traffic';
    if (description.includes('endpoint')) return 'Endpoint data';
    if (description.includes('email')) return 'Email systems';
    if (description.includes('database')) return 'Database logs';
    return 'Multiple sources';
  }

  /**
   * Extract tools from detection
   */
  private static extractTools(detection: any): string[] {
    const tools: string[] = ['SIEM'];
    const description = this.stripHtmlTags(detection.description || '').toLowerCase();
    
    if (description.includes('splunk')) tools.push('Splunk');
    if (description.includes('elastic')) tools.push('Elasticsearch');
    if (description.includes('sentinel')) tools.push('Microsoft Sentinel');
    if (description.includes('chronicle')) tools.push('Google Chronicle');
    if (description.includes('crowdstrike')) tools.push('CrowdStrike');
    
    return [...new Set(tools)];
  }

  /**
   * Estimate cost level based on content
   */
  private static estimateCostLevel(prevention: any): 'low' | 'medium' | 'high' {
    const text = (prevention.title + ' ' + prevention.description).toLowerCase();
    if (text.includes('enterprise') || text.includes('comprehensive') || text.includes('advanced')) return 'high';
    if (text.includes('basic') || text.includes('simple') || text.includes('minimal')) return 'low';
    return 'medium';
  }

  /**
   * Estimate difficulty based on content
   */
  private static estimateDifficulty(prevention: any): 'easy' | 'moderate' | 'difficult' {
    const text = (prevention.title + ' ' + prevention.description).toLowerCase();
    if (text.includes('complex') || text.includes('advanced') || text.includes('sophisticated')) return 'difficult';
    if (text.includes('basic') || text.includes('simple') || text.includes('straightforward')) return 'easy';
    return 'moderate';
  }

  /**
   * Estimate effectiveness (1-10 scale)
   */
  private static estimateEffectiveness(prevention: any): number {
    const text = (prevention.title + ' ' + prevention.description).toLowerCase();
    if (text.includes('highly effective') || text.includes('critical')) return 9;
    if (text.includes('effective') || text.includes('strong')) return 8;
    if (text.includes('moderate')) return 6;
    return 7; // Default
  }

  /**
   * Estimate severity for detections
   */
  private static estimateSeverity(detection: any): 'low' | 'medium' | 'high' | 'critical' {
    const text = (detection.title + ' ' + detection.description).toLowerCase();
    if (text.includes('critical') || text.includes('severe')) return 'critical';
    if (text.includes('high') || text.includes('major')) return 'high';
    if (text.includes('low') || text.includes('minor')) return 'low';
    return 'medium';
  }

  /**
   * Estimate confidence level (1-10)
   */
  private static estimateConfidence(detection: any): number {
    const text = (detection.title + ' ' + detection.description).toLowerCase();
    if (text.includes('definitive') || text.includes('certain')) return 10;
    if (text.includes('high confidence') || text.includes('reliable')) return 9;
    if (text.includes('moderate')) return 7;
    return 8; // Default
  }

  /**
   * Map theme to category - preserving the original Matrix taxonomy
   * 
   * The Insider Threat Matrix has 5 main themes:
   * 1. Motive - Why insiders act (financial, ideological, revenge, etc.)
   * 2. Means - Methods and access used (credentials, privileges, etc.)
   * 3. Preparation - Planning and reconnaissance activities
   * 4. Infringement - Actual malicious actions (data theft, sabotage, etc.)
   * 5. Anti-forensics - Covering tracks and avoiding detection
   */
  private static mapThemeToCategory(theme: string): 'Motive' | 'Means' | 'Preparation' | 'Infringement' | 'Anti-forensics' {
    const lowerTheme = (theme || '').toLowerCase();
    
    // Direct mapping preserving the original ForScie Matrix themes
    switch (lowerTheme) {
      case 'motive':
        return 'Motive';
      case 'means':
        return 'Means';
      case 'preparation':
        return 'Preparation';
      case 'infringement':
        return 'Infringement';
      case 'anti-forensics':
        return 'Anti-forensics';
      default:
        // Log unknown theme for debugging
        console.warn(`Unknown Matrix theme: ${theme}, defaulting to Motive`);
        return 'Motive';
    }
  }

  /**
   * Map text to appropriate pillar
   */
  private static mapToPillar(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('monitor') || lowerText.includes('detect') || lowerText.includes('visibility') || lowerText.includes('log')) {
      return 'visibility';
    }
    if (lowerText.includes('train') || lowerText.includes('aware') || lowerText.includes('education') || lowerText.includes('coach')) {
      return 'prevention-coaching';
    }
    if (lowerText.includes('evidence') || lowerText.includes('investiga') || lowerText.includes('forensic') || lowerText.includes('audit')) {
      return 'investigation-evidence';
    }
    if (lowerText.includes('access') || lowerText.includes('identity') || lowerText.includes('auth') || lowerText.includes('privilege')) {
      return 'identity-saas';
    }
    if (lowerText.includes('phish') || lowerText.includes('email') || lowerText.includes('social') || lowerText.includes('engineer')) {
      return 'phishing-resilience';
    }
    
    return 'visibility'; // Default
  }

  /**
   * Strip HTML tags from content
   */
  private static stripHtmlTags(html: string): string {
    if (!html || typeof html !== 'string') return '';
    
    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Fallback data when API is unavailable
   */
  private static getFallbackData(): MatrixData {
    return {
      version: '1.0-fallback',
      lastUpdated: new Date().toISOString(),
      contributors: ['ForScie Community (https://forscie.org/)'],
      attribution: {
        source: 'ForScie Insider Threat Matrix',
        url: 'https://insiderthreatmatrix.org/',
        repository: 'https://github.com/forscie/insider-threat-matrix',
        license: 'Creative Commons Attribution 4.0 International',
        description: 'The ForScie Insider Threat Matrix is a community-driven knowledge base of insider threat techniques, tactics, and procedures.'
      },
      elements: [],
      metadata: {
        totalElements: 0,
        categories: {
          motive: 0,
          means: 0,
          preparation: 0,
          infringement: 0,
          antiForensics: 0
        },
        lastSync: new Date().toISOString(),
        apiSource: 'ForScie GitHub Repository (unavailable)'
      }
    };
  }

  /**
   * Get Matrix statistics
   */
  static async getMatrixStats(): Promise<{ totalElements: number; categories: Record<string, number>; lastUpdated: string; }> {
    const data = await this.getMatrixData();
    return {
      totalElements: data.metadata.totalElements,
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
      return data.elements;
    }
    
    return data.elements.filter((tech: MatrixElement) => tech.category === category);
  }

  /**
   * Get technique by ID
   */
  static async getTechniqueById(id: string) {
    const data = await this.getMatrixData();
    return data.elements.find((tech: MatrixElement) => tech.id === id);
  }

  /**
   * Search techniques by keyword
   */
  static async searchTechniques(keyword: string) {
    const data = await this.getMatrixData();
    const lowerKeyword = keyword.toLowerCase();
    
    return data.elements.filter((tech: MatrixElement) => 
      tech.title.toLowerCase().includes(lowerKeyword) ||
      tech.description.toLowerCase().includes(lowerKeyword) ||
      tech.id.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Force refresh cache
   */
  static async refreshCache(): Promise<MatrixData> {
    // Force refreshing Matrix cache
    cachedData = null; // Clear existing cache
    return this.getMatrixData(true);
  }

  /**
   * Map techniques to specific pillars
   */
  static async mapTechniquesToPillars(pillarName?: string) {
    const data = await this.getMatrixData();
    
    if (!pillarName) {
      return data.elements;
    }
    
    return data.elements.filter((tech: MatrixElement) => {
      return tech.preventions?.some(prev => prev.pillar === pillarName || prev.primaryPillar === pillarName) ||
             tech.detections?.some(det => det.pillar === pillarName || det.primaryPillar === pillarName);
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
      elements: techniques.map((element: MatrixElement) => ({
        id: element.id,
        name: element.title,
        description: element.description,
        category: element.category,
        relevantPreventions: element.preventions?.filter((p: MatrixPrevention) => p.pillar === pillarName || p.primaryPillar === pillarName) || [],
        relevantDetections: element.detections?.filter((d: MatrixDetection) => d.pillar === pillarName || d.primaryPillar === pillarName) || []
      })),
      recommendations: this.generatePillarRecommendations(techniques, pillarName)
    };
  }

  /**
   * Generate recommendations for a specific pillar
   */
  private static generatePillarRecommendations(elements: MatrixElement[], pillarName: string): string[] {
    const recommendations: string[] = [];
    
    // Extract unique prevention strategies
    elements.forEach((tech: MatrixElement) => {
      tech.preventions?.forEach(prevention => {
        if ((prevention.pillar === pillarName || prevention.primaryPillar === pillarName) && prevention.title) {
          recommendations.push(prevention.title);
        }
      });
    });
    
    // Return top 5 unique recommendations
    return [...new Set(recommendations)].slice(0, 5);
  }

  /**
   * Get technique count by category
   */
  static async getCategoryCounts() {
    const data = await this.getMatrixData();
    return data.metadata.categories;
  }
}

// Named exports for backward compatibility
export const getMatrixData = MatrixAPI.getMatrixData.bind(MatrixAPI);
export const clearMatrixCache = MatrixAPI.refreshCache.bind(MatrixAPI);
export const syncMatrixData = MatrixAPI.refreshCache.bind(MatrixAPI);
export const mapTechniquesToPillars = MatrixAPI.mapTechniquesToPillars.bind(MatrixAPI);
export const generatePillarMatrixAnalysis = MatrixAPI.generatePillarAnalysis.bind(MatrixAPI);