"use client";

import Link from "next/link";

export function HomeButton() {
  return (
    <Link
      href="/"
      className="nav-button inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition"
    >
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
      <span>Home</span>
    </Link>
  );
}

