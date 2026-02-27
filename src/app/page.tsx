import { getAllPosts } from '@/lib/markdown';
import { ModeToggle } from "@/components/ModeToggle"
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-6 flex justify-end">
          <ModeToggle />
        </div>
      <h1 className="text-4xl font-bold mb-2">My Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${post.slug}`} className="block group">
            <h2 className="text-xl font-semibold group-hover:text-blue-600 transition">
              {post.frontmatter.title}
            </h2>
            <p className="text-gray-500">{post.frontmatter.date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}