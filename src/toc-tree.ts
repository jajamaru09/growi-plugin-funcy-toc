import type { HeadingItem, TocNode } from './types';

export function buildTocTree(headings: HeadingItem[], min: number, max: number): TocNode[] {
  const filtered = headings.filter(h => h.depth >= min && h.depth <= max);
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];

  for (const h of filtered) {
    const node: TocNode = { ...h, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= h.depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }
  return roots;
}
