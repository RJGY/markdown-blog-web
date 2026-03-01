'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ActiveTocContextValue {
  activeHeadingId: string | null;
  activeSectionId: string | null;
}

const ActiveTocContext = createContext<ActiveTocContextValue>({
  activeHeadingId: null,
  activeSectionId: null,
});

export function useActiveToc() {
  return useContext(ActiveTocContext);
}

interface ActiveTocProviderProps {
  headings: { level: number; text: string; id: string }[];
  children: React.ReactNode;
}

export function ActiveTocProvider({ headings, children }: ActiveTocProviderProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const updateActiveHeading = useCallback(() => {
    if (headings.length === 0) return;

    const viewportOffset = 120;
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);

    if (headingElements.length === 0) return;

    let currentActive: string | null = null;
    for (const el of headingElements) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportOffset) {
        currentActive = el.id;
      }
    }
    // If no heading has passed the threshold, use the first one
    if (!currentActive && headingElements.length > 0) {
      currentActive = headingElements[0].id;
    }

    setActiveHeadingId(currentActive);

    // Compute active section: the nearest level-1 heading at or before the active heading
    if (currentActive) {
      const activeIndex = headings.findIndex((h) => h.id === currentActive);
      let sectionId: string | null = null;
      for (let i = activeIndex; i >= 0; i--) {
        if (headings[i].level === 1) {
          sectionId = headings[i].id;
          break;
        }
      }
      setActiveSectionId(sectionId);
    } else {
      setActiveSectionId(null);
    }
  }, [headings]);

  useEffect(() => {
    updateActiveHeading();

    const handleScroll = () => {
      requestAnimationFrame(updateActiveHeading);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateActiveHeading]);

  // Re-observe when headings might change (e.g. after hydration)
  useEffect(() => {
    const timer = setTimeout(updateActiveHeading, 100);
    return () => clearTimeout(timer);
  }, [headings, updateActiveHeading]);

  return (
    <ActiveTocContext.Provider value={{ activeHeadingId, activeSectionId }}>
      {children}
    </ActiveTocContext.Provider>
  );
}
