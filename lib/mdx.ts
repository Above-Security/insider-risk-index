import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PlaybookFrontmatter {
  title: string;
  description: string;
  pillar: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeToImplement: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  version: string;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
  prerequisites?: string[];
  outcomes?: string[];
}

export interface ResearchFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  publishDate?: string;
  lastUpdated?: string;
  author: string;
  category: "trends" | "research" | "analysis" | "report";
  tags: string[];
  readingTime?: string;
  methodology?: string;
  dataSources?: string[];
  nextReport?: string;
  sources?: {
    title: string;
    url: string;
    organization: string;
  }[];
}

export interface MatrixFrontmatter {
  title: string;
  description: string;
  technique: string;
  category: "motive" | "coercion" | "manipulation";
  severity: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
  matrixVersion: string;
  pillars: string[];
}

export interface ContentItem<T = any> {
  slug: string;
  frontmatter: T;
  content: string;
  filePath: string;
}

const contentDirectory = path.join(process.cwd(), "content");

export function getContentBySlug<T = any>(
  contentType: "playbooks" | "research" | "matrix",
  slug: string
): ContentItem<T> | null {
  try {
    // Try both .md and .mdx extensions
    const possiblePaths = [
      path.join(contentDirectory, contentType, `${slug}.mdx`),
      path.join(contentDirectory, contentType, `${slug}.md`)
    ];
    
    let fullPath = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        fullPath = possiblePath;
        break;
      }
    }
    
    if (!fullPath) {
      console.error(`Content not found: ${contentType}/${slug} (tried .mdx and .md)`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as T,
      content,
      filePath: fullPath,
    };
  } catch (error) {
    console.error(`Error loading ${contentType}/${slug}:`, error);
    return null;
  }
}

export function getAllContent<T = any>(
  contentType: "playbooks" | "research" | "matrix"
): ContentItem<T>[] {
  try {
    const contentTypePath = path.join(contentDirectory, contentType);
    
    if (!fs.existsSync(contentTypePath)) {
      return [];
    }

    const files = fs.readdirSync(contentTypePath);
    
    return files
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map((file) => {
        const slug = file.replace(/\.(md|mdx)$/, "");
        return getContentBySlug<T>(contentType, slug);
      })
      .filter((item): item is ContentItem<T> => item !== null)
      .sort((a, b) => {
        // Sort by lastUpdated, publishedAt, or publishDate, newest first
        const aDate = (a.frontmatter as any).lastUpdated || (a.frontmatter as any).publishedAt || (a.frontmatter as any).publishDate;
        const bDate = (b.frontmatter as any).lastUpdated || (b.frontmatter as any).publishedAt || (b.frontmatter as any).publishDate;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  } catch (error) {
    console.error(`Error loading ${contentType} content:`, error);
    return [];
  }
}

export function getContentTypes() {
  try {
    const contentTypes = fs.readdirSync(contentDirectory);
    return contentTypes.filter((type) => 
      fs.statSync(path.join(contentDirectory, type)).isDirectory()
    );
  } catch (error) {
    console.error("Error loading content types:", error);
    return [];
  }
}

export function generateContentSitemap(): { url: string; lastModified: Date }[] {
  const sitemap: { url: string; lastModified: Date }[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://insiderisk.io";
  
  try {
    // Get all playbooks
    const playbooks = getAllContent<PlaybookFrontmatter>("playbooks");
    playbooks.forEach((playbook) => {
      sitemap.push({
        url: `${baseUrl}/playbooks/${playbook.slug}`,
        lastModified: new Date(playbook.frontmatter.lastUpdated),
      });
    });

    // Get all research content
    const research = getAllContent<ResearchFrontmatter>("research");
    research.forEach((article) => {
      sitemap.push({
        url: `${baseUrl}/research/${article.slug}`,
        lastModified: new Date(article.frontmatter.lastUpdated || new Date()),
      });
    });

    // Get all matrix content if it exists
    const matrix = getAllContent<MatrixFrontmatter>("matrix");
    matrix.forEach((technique) => {
      sitemap.push({
        url: `${baseUrl}/matrix/${technique.slug}`,
        lastModified: new Date(technique.frontmatter.lastUpdated),
      });
    });

    return sitemap;
  } catch (error) {
    console.error("Error generating content sitemap:", error);
    return [];
  }
}

export function getRelatedContent<T = any>(
  currentSlug: string,
  contentType: "playbooks" | "research" | "matrix",
  limit: number = 3
): ContentItem<T>[] {
  const allContent = getAllContent<T>(contentType);
  
  // Simple related content algorithm - exclude current item and take most recent
  return allContent
    .filter((item) => item.slug !== currentSlug)
    .slice(0, limit);
}

// Utility to calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}