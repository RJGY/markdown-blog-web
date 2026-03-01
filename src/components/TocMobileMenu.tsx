'use client';

import { useState, useEffect } from 'react';
import { TableOfContents } from './TableOfContents';

interface TocMobileMenuProps {
  headings: { level: number; text: string; id: string }[];
}

export function TocMobileMenu({ headings }: TocMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Hamburger button - visible only on mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open table of contents"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Slide-out panel */}
      <div
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 flex justify-end p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close table of contents"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className="overflow-y-auto p-4 max-h-[calc(100vh-3.5rem)]"
          onClick={(e) => {
            const target = (e.target as HTMLElement).closest('a[href^="#"]');
            if (target) setIsOpen(false);
          }}
        >
          <TableOfContents headings={headings} />
        </div>
      </div>
    </>
  );
}
