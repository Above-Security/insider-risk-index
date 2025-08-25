import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

const playbooksDirectory = path.join(process.cwd(), 'content/playbooks');

// Re-export types and constants from the shared constants file
export type { PlaybookFrontmatter, Playbook } from './playbook-constants';
export { PILLAR_NAMES, PILLAR_COLORS } from './playbook-constants';

// Import the types for local use
import type { PlaybookFrontmatter, Playbook } from './playbook-constants';

export function getAllPlaybooks(): Playbook[] {
  try {
    if (!fs.existsSync(playbooksDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(playbooksDirectory);
    const playbooks = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const fullPath = path.join(playbooksDirectory, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug: name.replace(/\.mdx$/, ''),
          frontmatter: data as PlaybookFrontmatter,
          content,
        };
      })
      .sort((a, b) => {
        // Sort by pillar first, then by difficulty
        if (a.frontmatter.pillar !== b.frontmatter.pillar) {
          return a.frontmatter.pillar.localeCompare(b.frontmatter.pillar);
        }
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.frontmatter.difficulty] - difficultyOrder[b.frontmatter.difficulty];
      });

    return playbooks;
  } catch (error) {
    console.error('Error reading playbooks:', error);
    return [];
  }
}

export function getPlaybookBySlug(slug: string): Playbook | null {
  try {
    const fullPath = path.join(playbooksDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as PlaybookFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error reading playbook ${slug}:`, error);
    return null;
  }
}

export function getPlaybooksByPillar(pillar: string): Playbook[] {
  const allPlaybooks = getAllPlaybooks();
  return allPlaybooks.filter((playbook) => playbook.frontmatter.pillar === pillar);
}

export function getPlaybooksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Playbook[] {
  const allPlaybooks = getAllPlaybooks();
  return allPlaybooks.filter((playbook) => playbook.frontmatter.difficulty === difficulty);
}

export function getPlaybooksByTag(tag: string): Playbook[] {
  const allPlaybooks = getAllPlaybooks();
  return allPlaybooks.filter((playbook) => 
    playbook.frontmatter.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

