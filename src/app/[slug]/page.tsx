import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HomeButton />
            <Link
              href={`/dual?left=${slug}`}
              className="nav-button inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition"
            >
              <span>Dual View</span>
            </Link>
          </div>
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
          <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
            <TableOfContents headings={headings} />
          </aside>
          <article className="order-1 lg:order-2">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
              <time className="text-gray-500">{frontmatter.date}</time>
            </header>

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
    </div>
  );
}