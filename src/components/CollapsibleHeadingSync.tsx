'use client';

import { useEffect } from 'react';

/**
 * Syncs the open state to the chevron via inline styles.
 * Inline styles bypass all CSS specificity issues and should work for all heading levels.
 */
export function CollapsibleHeadingSync() {
  useEffect(() => {
    const syncChevron = (chevron: Element, isOpen: boolean) => {
      const el = chevron as HTMLElement;
      el.style.transition = 'transform 0.2s ease';
      el.style.transformOrigin = 'center';
      el.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
    };

    const syncAll = () => {
      document.querySelectorAll('details.collapsible-heading').forEach((details) => {
        const chevron = details.querySelector('.collapsible-chevron');
        if (chevron) {
          syncChevron(chevron, (details as HTMLDetailsElement).open);
        }
      });
    };

    const handleToggle = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('details.collapsible-heading')) {
        const chevron = target.querySelector('.collapsible-chevron');
        if (chevron) {
          syncChevron(chevron, (target as HTMLDetailsElement).open);
        }
      }
    };

    syncAll();
    requestAnimationFrame(() => syncAll());
    setTimeout(syncAll, 100);
    document.addEventListener('toggle', handleToggle, true);

    const observer = new MutationObserver(() => syncAll());
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['open'],
    });

    return () => {
      document.removeEventListener('toggle', handleToggle, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
