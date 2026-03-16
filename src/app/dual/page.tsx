import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

import { HomeButton } from '@/components/HomeButton';
import { CollapsibleHeadingSync } from '@/components/CollapsibleHeadingSync';
import { rehypeCollapsibleHeadings } from '@/lib/rehype-collapsible-headings';
import { transformTableLineBreaks } from '@/lib/transform-table-line-breaks';
import { ModeToggle } from '@/components/ModeToggle';
import { TableOfContents } from '@/components/TableOfContents';
import { DualSelector } from '@/components/DualSelector';
import { getAllPosts, getPostBySlug } from '@/lib/markdown';

interface DualPageProps {
  searchParams: Promise<{
    left?: string;
    right?: string;
  }>;
}

export default async function DualPage({ searchParams }: DualPageProps) {
  const { left, right } = await searchParams;
  const leftSlug = left;
  const rightSlug = right;

  const allPosts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title || post.slug,
  }));

  const leftPost = leftSlug ? getPostBySlug(leftSlug) : null;
  const rightPost = rightSlug ? getPostBySlug(rightSlug) : null;

  if (
    (leftSlug && leftPost && leftPost.frontmatter.title === 'Not Found') ||
    (rightSlug && rightPost && rightPost.frontmatter.title === 'Not Found')
  ) {
    notFound();
  }

  const columns = [
    leftPost && { post: leftPost, label: 'Left article' },
    rightPost && { post: rightPost, label: 'Right article' },
  ].filter(Boolean) as { post: any; label: string }[];

  return (
    <div className="w-full py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="sticky top-0 z-10 -mx-4 -mt-12 mb-6 flex items-center justify-between gap-3 bg-[var(--background)] px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <HomeButton />
          <ModeToggle />
        </div>

        <DualSelector
          posts={allPosts}
          initialLeft={leftSlug}
          initialRight={rightSlug}
        />

        {columns.length > 0 && (
          <>
            <CollapsibleHeadingSync />
            <div
            className={`grid grid-cols-1 gap-8 ${
              columns.length === 2 ? 'lg:grid-cols-2' : ''
            }`}
          >
            {columns.map(({ post, label }) => (
              <div key={`${label}-${post.slug}`} className="space-y-8">

                <article>
                  <header className="mb-8">
                    <h2 className="mb-2 text-3xl font-bold">
                      {post.frontmatter.title}
                    </h2>
                    <time className="text-gray-500">
                      {post.frontmatter.date}
                    </time>
                  </header>

                  <div>
                    <TableOfContents headings={post.headings} />
                  </div>

                  <div className="prose prose-slate lg:prose-xl dark:prose-invert">
                    <MDXRemote
                      source={transformTableLineBreaks(post.content)}
                      options={{
                        mdxOptions: {
                          remarkPlugins: [remarkGfm],
                          rehypePlugins: [rehypeSlug, rehypeCollapsibleHeadings],
                        },
                      }}
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
