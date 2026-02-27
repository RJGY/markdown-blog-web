import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content');

export function extractHeadings(content: string) {
  // Regex to find ## through ###### headings
  const headingLines = content.split('\n').filter((line) => line.match(/^#{2,6}\s/));

  return headingLines.map((line) => {
    const level = line.split(' ')[0].length; // 2 for ##, 3 for ###, etc.
    const text = line.replace(/^#{2,6}\s/, '').trim();
    // Create a URL-friendly ID: "Hello World" -> "hello-world"
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
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