import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title: string;
  description: string;
  author?: string;
  publishedAt: string;
  category: string;
  tags?: string[];
  slug: string;
  readingTime?: number;
}

export interface ResearchArticle extends ContentMetadata {
  category: 'research';
  methodology?: string;
  dataSources?: string[];
  nextReport?: string;
}

export interface PlaybookGuide extends ContentMetadata {
  category: 'playbook';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites?: string[];
  tools?: string[];
}

export type ContentItem = ResearchArticle | PlaybookGuide;

const contentDirectory = path.join(process.cwd(), 'content');

export async function getContentBySlug(type: 'research' | 'playbooks', slug: string) {
  const filePath = path.join(contentDirectory, type, `${slug}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter and content
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);
    
    if (!match) {
      // If no frontmatter, create default metadata
      const title = fileContent.split('\n')[0].replace('# ', '');
      const metadata: Partial<ContentMetadata> = {
        title,
        description: fileContent.substring(0, 200) + '...',
        publishedAt: '2024-12-01',
        category: type === 'research' ? 'research' : 'playbook',
        slug,
        readingTime: Math.ceil(fileContent.length / 1000)
      };
      
      return { metadata, content: fileContent };
    }
    
    const frontmatter = match[1];
    const content = match[2];
    
    // Parse YAML frontmatter manually (simple implementation)
    const metadata: Partial<ContentMetadata> = { slug };
    const lines = frontmatter.split('\n');
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          metadata[key as keyof ContentMetadata] = value.slice(1, -1).split(',').map(t => t.trim().replace(/['"]/g, '')) as any;
        } else {
          metadata[key as keyof ContentMetadata] = value.replace(/['"]/g, '') as any;
        }
      }
    }
    
    // Set defaults
    metadata.category = metadata.category || (type === 'research' ? 'research' : 'playbook');
    metadata.readingTime = metadata.readingTime || Math.ceil(content.length / 1000);
    
    return { metadata: metadata as ContentMetadata, content };
  } catch (error) {
    console.error(`Error reading content file ${filePath}:`, error);
    return null;
  }
}

export function getAllContent(type: 'research' | 'playbooks'): ContentItem[] {
  const typeDirectory = path.join(contentDirectory, type);
  
  if (!fs.existsSync(typeDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(typeDirectory);
  const content: ContentItem[] = [];
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const slug = file.replace('.md', '');
    const filePath = path.join(typeDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract title and basic metadata
    const title = fileContent.split('\n')[0].replace('# ', '');
    const description = fileContent.substring(0, 200).replace(/#+\s*/g, '').replace(/\n/g, ' ').trim() + '...';
    
    const baseMetadata: ContentMetadata = {
      title,
      description,
      publishedAt: '2024-12-01',
      category: type === 'research' ? 'research' : 'playbook',
      slug,
      readingTime: Math.ceil(fileContent.length / 1000),
    };
    
    if (type === 'research') {
      content.push({
        ...baseMetadata,
        category: 'research',
        methodology: 'Survey and analysis',
        dataSources: ['Ponemon Institute', 'Verizon DBIR', 'Industry Surveys'],
        nextReport: 'Q4 2025'
      } as ResearchArticle);
    } else {
      content.push({
        ...baseMetadata,
        category: 'playbook',
        difficulty: 'intermediate',
        estimatedTime: '2-4 weeks',
        tools: ['SIEM', 'UEBA', 'DLP']
      } as PlaybookGuide);
    }
  }
  
  // Sort by published date (newest first)
  return content.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getRelatedContent(currentSlug: string, type: 'research' | 'playbooks', limit = 3): ContentItem[] {
  const allContent = getAllContent(type);
  return allContent.filter(item => item.slug !== currentSlug).slice(0, limit);
}

// Helper function to calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate JSON-LD for articles
export function generateArticleJsonLd(metadata: ContentMetadata, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": metadata.title,
    "description": metadata.description,
    "author": {
      "@type": "Organization",
      "name": "Insider Risk Index Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Insider Risk Index",
      "url": "https://insiderriskindex.com"
    },
    "datePublished": metadata.publishedAt,
    "dateModified": metadata.publishedAt,
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": metadata.tags?.join(', '),
    "articleSection": metadata.category,
    "wordCount": (metadata.readingTime || 1) * 200,
    "timeRequired": `PT${metadata.readingTime || 1}M`
  };
}