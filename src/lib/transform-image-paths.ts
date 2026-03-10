/**
 * Transforms relative image paths in markdown to absolute URLs for content/{slug}/images/.
 * - Relative paths (e.g. "images/photo.png" or "./images/photo.png") → "/content/{slug}/images/..."
 * - Paths already starting with / or http(s) are left unchanged
 */
export function transformImagePaths(content: string, slug: string): string {
  return content.replace(
    /!\[([^\]]*)\]\(((?!\/|https?:\/\/)([^)]+))\)/g,
    (_, alt, fullPath) => {
      const normalized = fullPath.replace(/^\.\//, '');
      // Strip leading "images/" if present to avoid /content/slug/images/images/...
      const pathInImages = normalized.replace(/^images\//, '');
      return `![${alt}](/content/${slug}/images/${pathInImages})`;
    }
  );
}
