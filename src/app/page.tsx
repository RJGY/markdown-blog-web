import { getAllPosts } from '@/lib/markdown';
import { ModeToggle } from "@/components/ModeToggle"
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
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-6 flex justify-end">
        <ModeToggle />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:relative mb-8 gap-4 lg:gap-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={2160}
          height={2160}
          className="h-32 w-32 lg:absolute lg:-left-60 lg:-top-20 lg:h-60 lg:w-60 object-contain lg:pr-6 order-first"
        />
        <div className="lg:pt-40">
          <h1 className="text-4xl font-bold pb-2">My Blog</h1>
          <h4 className="text-lg">My Blog Description</h4>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className="block p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.frontmatter.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-clamp-3">
              {post.frontmatter.description || ''}
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              {post.frontmatter.date}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}