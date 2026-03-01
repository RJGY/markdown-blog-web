'use client';

import { useActiveToc } from './ActiveTocContext';
import { TableOfContents } from './TableOfContents';

interface TocWithActiveMarkerProps {
  headings: { level: number; text: string; id: string }[];
}

export function TocWithActiveMarker({ headings }: TocWithActiveMarkerProps) {
  const { activeHeadingId, activeSectionId } = useActiveToc();

  return (
    <TableOfContents
      headings={headings}
      activeHeadingId={activeHeadingId}
      activeSectionId={activeSectionId}
    />
  );
}
