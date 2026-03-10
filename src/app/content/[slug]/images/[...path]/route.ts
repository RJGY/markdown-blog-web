import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

/** MIME types for common image formats */
const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; path?: string | string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pathParam = resolvedParams.path;
  const pathSegments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];

  if (!slug || pathSegments.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Prevent path traversal
  if (slug.includes('..') || pathSegments.some((p) => p.includes('..'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const imagePath = path.join(contentDir, slug, 'images', ...pathSegments);
  const resolved = path.resolve(imagePath);
  const contentBase = path.resolve(contentDir);

  if (!resolved.startsWith(contentBase) || !resolved.startsWith(path.join(contentBase, slug, 'images'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream';

  const buffer = fs.readFileSync(imagePath);
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
