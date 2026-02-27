"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function HomeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  const baseClasses =
    "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition";
  const lightClasses =
    "border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100";
  const darkClasses =
    "border border-gray-700 text-gray-200 bg-gray-900 hover:bg-gray-800";

  const classes = `${baseClasses} ${mounted && isDark ? darkClasses : lightClasses}`;

  if (!mounted) {
    return (
      <div
        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border border-transparent"
        aria-hidden
      >
        <span className="invisible">Home</span>
      </div>
    );
  }

  return (
    <Link href="/" className={classes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span className="ml-2">Home</span>
    </Link>
  );
}

