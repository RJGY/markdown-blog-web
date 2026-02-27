import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const postsDirectory = path.join(process.cwd(), 'content');

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
  const headingLines = content.split('\n').filter((line) => line.match(/^#{2,6}\s/));

  return headingLines.map((line) => {
    const level = line.split(' ')[0].length;
    const rawText = line.replace(/^#{2,6}\s/, '').trim();
    const text = stripMarkdownFormatting(rawText);
    const id = slugger.slug(text);
    return { level, text, id };
  });
}

// Update your getPostBySlug to include headings
export function getPostBySlug(slug: string) {
  try {
    const fullPath = path.join(process.cwd(), 'content', `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const headings = extractHeadings(content); // Get the headings

    return { slug, frontmatter: data, content, headings };
  } catch (e) {
    // Return a default or trigger a 404
    return { slug, frontmatter: { title: "Not Found", date: "" }, content: "Post not found.", headings: [] };
  }
}

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    return getPostBySlug(slug);
  });
}