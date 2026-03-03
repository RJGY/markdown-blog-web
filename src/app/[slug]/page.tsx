import Image from 'next/image';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { getPostBySlug, isPost } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ActiveTocProvider } from '@/components/ActiveTocContext';
import { TocWithActiveMarker } from '@/components/TocWithActiveMarker';
import { TocMobileMenu } from '@/components/TocMobileMenu';
import { ModeToggle } from "@/components/ModeToggle";
import { HomeButton } from "@/components/HomeButton";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isPost(slug)) {
    notFound();
  }

  const post = getPostBySlug(slug);
  const { frontmatter, content, headings } = post;
  const sections = 'sections' in post ? (post as { sections: { title: string; content: string; filename: string }[] }).sections : undefined;
  const layout = (frontmatter.layout as string)?.toLowerCase() === 'horizontal' ? 'horizontal' : 'vertical';
  const isHorizontal = layout === 'horizontal' && sections && sections.length > 0;

  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  };

  return (
    <ActiveTocProvider headings={headings}>
      <div className="w-full pt-0">
        <div className="sticky top-0 z-10 w-full bg-[var(--background)] border-b border-slate-200 dark:border-slate-700 opacity-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 py-3 px-4">
            <div className="flex items-center gap-3">
              <TocMobileMenu headings={headings} />
              <HomeButton />
            </div>
            <ModeToggle />
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="mx-auto max-w-6xl lg:pt-30 pt-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
              <div className="order-2 lg:order-1 hidden lg:flex lg:flex-col lg:gap-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={2160}
                  height={2160}
                  className="h-32 w-32 lg:h-50 lg:w-50 object-contain flex-shrink-0"
                />
                <aside className="lg:sticky lg:top-24 lg:self-start">
                  <TocWithActiveMarker headings={headings} />
                </aside>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
              <header className="mb-8">
                <div className="flex flex-col gap-4 lg:pt-0 pt-32">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={2160}
                    height={2160}
                    className="h-32 w-32 object-contain flex-shrink-0 lg:hidden"
                  />
                  <div className="pt-5 lg:pt-54">
                    <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
                    {Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {frontmatter.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-block px-2.5 py-1 text-sm rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-lg mb-2">{frontmatter.description}</h3>
                    <time className="text-gray-500">{frontmatter.date}</time>
                  </div>
                </div>
              </header>

              {sections && sections.length > 0 ? (
                <div
                  className={`grid grid-cols-1 gap-8 ${
                    isHorizontal && sections.length === 2
                      ? 'lg:grid-cols-2'
                      : isHorizontal && sections.length >= 3
                        ? 'lg:grid-cols-3'
                        : ''
                  }`}
                >
                  {sections.map((section) => (
                    <article
                      key={section.filename}
                      className="rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="top-0 z-10 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm text-slate-600 dark:text-slate-400 rounded-t-lg">
                        {section.filename}.md
                      </div>
                      <div className="p-4 prose prose-slate lg:prose-xl dark:prose-invert max-w-none">
                        <MDXRemote
                          source={section.content}
                          options={{ mdxOptions: mdxOptions }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="prose prose-slate lg:prose-xl dark:prose-invert">
                  <MDXRemote
                    source={content}
                    options={{ mdxOptions }}
                  />
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ActiveTocProvider>
  );
}