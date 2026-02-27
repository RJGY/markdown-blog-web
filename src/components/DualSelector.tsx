"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

type PostOption = {
  slug: string;
  title: string;
};

interface DualSelectorProps {
  posts: PostOption[];
  initialLeft?: string;
  initialRight?: string;
}

export function DualSelector({
  posts,
  initialLeft,
  initialRight,
}: DualSelectorProps) {
  const router = useRouter();

  const [leftValue, setLeftValue] = React.useState(initialLeft ?? "");
  const [rightValue, setRightValue] = React.useState(initialRight ?? "");

  React.useEffect(() => {
    setLeftValue(initialLeft ?? "");
  }, [initialLeft]);

  React.useEffect(() => {
    setRightValue(initialRight ?? "");
  }, [initialRight]);

  const updateRoute = (nextLeft: string, nextRight: string) => {
    const params = new URLSearchParams();
    if (nextLeft) params.set("left", nextLeft);
    if (nextRight) params.set("right", nextRight);

    const query = params.toString();
    router.push(`/dual${query ? `?${query}` : ""}`);
  };

  const handleChange =
    (position: "left" | "right") =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;

      if (position === "left") {
        const nextLeft = value;
        setLeftValue(nextLeft);
        updateRoute(nextLeft, rightValue);
      } else {
        const nextRight = value;
        setRightValue(nextRight);
        updateRoute(leftValue, nextRight);
      }
    };

  const handleSwap = () => {
    setLeftValue(rightValue);
    setRightValue(leftValue);
    updateRoute(rightValue, leftValue);
  };

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Left article
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={leftValue}
            onChange={handleChange("left")}
          >
            <option value="">Select an article…</option>
            {posts.map((post) => (
              <option key={post.slug} value={post.slug}>
                {post.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="rounded-md border border-slate-300 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Swap articles"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Right article
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            value={rightValue}
            onChange={handleChange("right")}
          >
            <option value="">Select an article…</option>
            {posts.map((post) => (
              <option key={post.slug} value={post.slug}>
                {post.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

