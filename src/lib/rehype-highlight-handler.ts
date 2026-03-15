import type { Element } from 'hast';
import type { State } from 'mdast-util-to-hast';

/**
 * Custom handler for mdast "highlight" nodes (from remark-highlight-mark).
 * Converts them to <mark> elements instead of the default <div>,
 * which would cause "div cannot be descendant of p" hydration errors.
 */
export function highlightHandler(state: State, node: { children?: unknown[] }): Element {
  const result: Element = {
    type: 'element',
    tagName: 'mark',
    properties: {},
    children: state.all(node as Parameters<State['all']>[0]),
  };
  state.patch(node as Parameters<State['patch']>[0], result);
  return state.applyData(node as Parameters<State['applyData']>[0], result);
}
