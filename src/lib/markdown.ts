import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const postsDirectory = path.join(process.cwd(), 'content');

export interface PostFrontmatter {
  title?: string;
  date?: string;
  description?: string;
  layout?: string;
  tags?: string[];
  /** When false, disables collapsible headings (chevrons). Default: true */
  chevrons?: boolean;
  [key: string]: unknown;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  headings: { level: number; text: string; id: string }[];
  sections?: { title: string; content: string; filename: string }[];
}

/** Parse tags from frontmatter - supports comma-separated string or array */
export function parseTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))];
  }
  if (typeof tags === 'string') {
    return [...new Set(tags.split(',').map((t) => t.trim()).filter(Boolean))];
  }
  return [];
}

/** Strip markdown formatting from heading text to match rehype-slug's plain-text input */
function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/_/g, '')
    .replace(/\s*:\s*$/, '')
    .trim();
}

export function extractHeadings(content: string) {
  const slugger = new GithubSlugger();
  const headingLines = content.split('\n').filter((line) => line.match(/^#{1,6}\s/));

  return headingLines.map((line) => {
    const level = line.split(' ')[0].length;
    const rawText = line.replace(/^#{1,6}\s/, '').trim();
    const text = stripMarkdownFormatting(rawText);
    const id = slugger.slug(text);
    return { level, text, id };
  });
}

/** Check if a slug exists as either a single file or folder post */
export function isPost(slug: string): boolean {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const folderPath = path.join(postsDirectory, slug);
  const indexPath = path.join(folderPath, 'index.md');
  return (
    fs.existsSync(filePath) ||
    (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory() && fs.existsSync(indexPath))
  );
}

/** Check if a path is a folder with index.md (a "collection" post) */
function isFolderPost(slug: string): boolean {
  const folderPath = path.join(postsDirectory, slug);
  const indexPath = path.join(folderPath, 'index.md');
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory() && fs.existsSync(indexPath);
}

/** Get a single-file post from content/{slug}.md */
function getSingleFilePost(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const headings = extractHeadings(content);
  const tags = parseTags(data.tags);
  return { slug, frontmatter: { ...data, tags }, content, headings };
}

/** Get a folder-based post from content/{slug}/ with index.md + other .md files */
function getFolderPost(slug: string): Post {
  const folderPath = path.join(postsDirectory, slug);
  const indexPath = path.join(folderPath, 'index.md');
  const indexContents = fs.readFileSync(indexPath, 'utf8');
  const { data: frontmatter } = matter(indexContents);

  // Get all other .md files (excluding index.md), sorted alphabetically
  const files = fs.readdirSync(folderPath)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort();

  const contentParts: string[] = [];
  const sections: { title: string; content: string; filename: string }[] = [];
  const allTags = new Set<string>(parseTags(frontmatter.tags));

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: fileFrontmatter, content } = matter(fileContents);
    parseTags(fileFrontmatter?.tags).forEach((t) => allTags.add(t));
    const filename = file.replace(/\.md$/, '');
    const sectionTitle = fileFrontmatter?.title || filename.replace(/-/g, ' ');
    const sectionHeading = `# ${sectionTitle}\n\n---\n\n`;
    const sectionContent = sectionHeading + content;
    contentParts.push(sectionContent);
    sections.push({ title: sectionTitle, content: sectionContent, filename });
  }

  const content = contentParts.join('\n\n---\n\n');
  const headings = extractHeadings(content);
  const tags = Array.from(allTags).sort();
  return { slug, frontmatter: { ...frontmatter, tags }, content, headings, sections };
}

// Update your getPostBySlug to include headings
export function getPostBySlug(slug: string): Post {
  try {
    if (isFolderPost(slug)) {
      return getFolderPost(slug);
    }
    return getSingleFilePost(slug);
  } catch (e) {
    // Return a default or trigger a 404
    return { slug, frontmatter: { title: "Not Found", date: "", tags: [] }, content: "Post not found.", headings: [] };
  }
}

export function getAllPosts(): Post[] {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const posts: Post[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.md$/, '');
      posts.push(getPostBySlug(slug));
    } else if (entry.isDirectory() && fs.existsSync(path.join(postsDirectory, entry.name, 'index.md'))) {
      posts.push(getPostBySlug(entry.name));
    }
  }

  return posts;
}

/** Allowed CSS filenames for page-specific styles (checked in order) */
const PAGE_CSS_NAMES = ['styles.css', 'page.css'];

/**
 * Get page-specific CSS for a slug, if it exists.
 * - Folder posts: looks for styles.css or page.css in content/{slug}/
 * - Single-file posts: looks for {slug}.css in content/
 * Returns the CSS content or null if no file exists.
 */
export function getPageCss(slug: string): string | null {
  if (!slug || slug.includes('..') || path.isAbsolute(slug)) return null;

  // Folder post: content/{slug}/styles.css or content/{slug}/page.css
  if (isFolderPost(slug)) {
    const folderPath = path.join(postsDirectory, slug);
    for (const name of PAGE_CSS_NAMES) {
      const cssPath = path.join(folderPath, name);
      if (fs.existsSync(cssPath)) {
        const resolved = path.resolve(cssPath);
        if (resolved.startsWith(path.resolve(postsDirectory))) {
          return fs.readFileSync(cssPath, 'utf8');
        }
      }
    }
  } else {
    // Single-file post: content/{slug}.css
    const cssPath = path.join(postsDirectory, `${slug}.css`);
    if (fs.existsSync(cssPath)) {
      const resolved = path.resolve(cssPath);
      if (resolved.startsWith(path.resolve(postsDirectory))) {
        return fs.readFileSync(cssPath, 'utf8');
      }
    }
  }

  return null;
}