import { getAllPosts } from '@/lib/markdown';
import { ModeToggle } from "@/components/ModeToggle";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const posts = getAllPosts()
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date as string || 0).getTime();
      const dateB = new Date(b.frontmatter.date as string || 0).getTime();
      return dateB - dateA; // descending: latest first
    });

  return (
    <main className="w-full pt-0">
      <div className="sticky top-0 z-10 w-full bg-[var(--background)] border-b border-slate-200 dark:border-slate-700 opacity-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 py-3">
          <ModeToggle />
        </div>
      </div>
      <div className="mx-auto max-w-6xl py-15">
        <div className="mb-8 pt-15">
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={2160}
              height={2160}
              className="h-32 w-32 lg:h-50 lg:w-50 object-contain flex-shrink-0"
            />
            <div className="pb-1">
              <h1 className="text-4xl font-bold pb-2">My Blog</h1>
              <h4 className="text-lg">My Blog Description</h4>
            </div>
          </div>
          <hr className="mt-6 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
            return (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="block p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.frontmatter.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-500 text-sm mb-2">
                  {post.frontmatter.date}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-3">
                  {post.frontmatter.description || ''}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}