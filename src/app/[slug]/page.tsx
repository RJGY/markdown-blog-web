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
  const sections = 'sections' in post ? (post as { sections: { title: string; content: string }[] }).sections : undefined;
  const layout = (frontmatter.layout as string)?.toLowerCase() === 'horizontal' ? 'horizontal' : 'vertical';
  const isHorizontal = layout === 'horizontal' && sections && sections.length > 0;

  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  };

  return (
    <ActiveTocProvider headings={headings}>
      <div className="w-full py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 py-3 sticky top-0 z-30 -mx-4 px-4 lg:mx-0 lg:px-0 lg:py-0 lg:static bg-[var(--background)] lg:bg-transparent border-b border-slate-200 dark:border-slate-700 lg:border-0">
            <div className="flex items-center gap-3">
              <TocMobileMenu headings={headings} />
              <HomeButton />
            </div>
            <ModeToggle />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
            <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start hidden lg:flex lg:flex-col lg:gap-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={2160}
                height={2160}
                className="h-32 w-32 lg:h-60 lg:w-60 object-contain flex-shrink-0"
              />
              <TocWithActiveMarker headings={headings} />
            </aside>
            <div className="order-1 lg:order-2 space-y-8">
            <header className="mb-8">
              <div className="flex flex-col gap-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={2160}
                  height={2160}
                  className="h-32 w-32 object-contain flex-shrink-0 lg:hidden"
                />
                <div>
                  <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
                  <h3 className="text-lg mb-2">{frontmatter.description}</h3>
                  <time className="text-gray-500">{frontmatter.date}</time>
                </div>
              </div>
            </header>

            {isHorizontal && sections ? (
              <div
                className={`grid grid-cols-1 gap-8 ${
                  sections.length === 2
                    ? 'lg:grid-cols-2'
                    : sections.length >= 3
                      ? 'lg:grid-cols-3'
                      : ''
                }`}
              >
                {sections.map((section) => (
                  <article key={section.title} className="space-y-4">
                    <div className="prose prose-slate lg:prose-xl dark:prose-invert max-w-none">
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
    </ActiveTocProvider>
  );
}