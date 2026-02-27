import fs from 'fs';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { getPostBySlug } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { TableOfContents } from '@/components/TableOfContents';
import { ModeToggle } from "@/components/ModeToggle";
import { HomeButton } from "@/components/HomeButton";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const { frontmatter, content, headings } = getPostBySlug(slug);

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center gap-3">
          <HomeButton />
          <ModeToggle />
        </div>

        

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
            <time className="text-gray-500">{frontmatter.date}</time>
          </header>

          <div className="mb-10">
            <TableOfContents headings={headings} />
          </div>

          <div className="prose prose-slate lg:prose-xl dark:prose-invert">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}