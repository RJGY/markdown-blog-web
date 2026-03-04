import type { Root, Element, ElementContent } from 'hast';

function getHeadingLevel(tagName: string): number {
  const match = tagName?.match(/^h([1-6])$/);
  return match ? parseInt(match[1], 10) : 0;
}

function isHeading(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as Element).type === 'element' &&
    typeof (node as Element).tagName === 'string' &&
    /^h[1-6]$/.test((node as Element).tagName)
  );
}

/**
 * Rehype plugin that wraps each heading and its content in a <details> element
 * with the heading as <summary>. Headings become collapsible - click to toggle.
 */
export function rehypeCollapsibleHeadings() {
  return (tree: Root) => {
    const children = tree.children;

    function processSection(nodes: typeof children, startIndex: number, parentLevel: number): { result: typeof children; nextIndex: number } {
      const result: typeof children = [];
      let i = startIndex;

      while (i < nodes.length) {
        const node = nodes[i];
        if (isHeading(node)) {
          const level = getHeadingLevel(node.tagName);
          if (level <= parentLevel) break;

          i++;
          const { result: sectionContent, nextIndex } = processSection(nodes, i, level);
          i = nextIndex;

          const chevron: Element = {
            type: 'element',
            tagName: 'span',
            properties: { className: 'collapsible-chevron', 'aria-hidden': 'true' },
            children: [{ type: 'text', value: '\u25B8 ' }],
          };

          const headingWithChevron: Element = {
            ...node,
            children: [chevron, ...(node.children as ElementContent[])],
          };

          const summary: Element = {
            type: 'element',
            tagName: 'summary',
            properties: { className: 'cursor-pointer list-none' },
            children: [headingWithChevron],
          };

          const details: Element = {
            type: 'element',
            tagName: 'details',
            properties: { open: true, className: 'collapsible-heading my-2' },
            children: [summary, ...(sectionContent as ElementContent[])],
          };

          result.push(details);
        } else {
          result.push(node);
          i++;
        }
      }

      return { result, nextIndex: i };
    }

    const { result } = processSection(children, 0, 0);
    tree.children = result;
  };
}
