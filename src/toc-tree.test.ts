import { describe, it, expect } from 'vitest';
import { buildTocTree } from './toc-tree';
import type { HeadingItem } from './types';

const headings: HeadingItem[] = [
  { depth: 1, id: 'a', text: 'A' },
  { depth: 2, id: 'b', text: 'B' },
  { depth: 3, id: 'c', text: 'C' },
  { depth: 2, id: 'd', text: 'D' },
  { depth: 1, id: 'e', text: 'E' },
];

describe('buildTocTree', () => {
  it('nests headings by depth', () => {
    const tree = buildTocTree(headings, 1, 6);
    expect(tree.map(n => n.id)).toEqual(['a', 'e']);
    expect(tree[0].children.map(n => n.id)).toEqual(['b', 'd']);
    expect(tree[0].children[0].children.map(n => n.id)).toEqual(['c']);
  });

  it('filters by min/max before nesting', () => {
    const tree = buildTocTree(headings, 2, 3);
    expect(tree.map(n => n.id)).toEqual(['b', 'd']);
    expect(tree[0].children.map(n => n.id)).toEqual(['c']);
  });

  it('returns an empty array when nothing is in range', () => {
    expect(buildTocTree(headings, 5, 6)).toEqual([]);
  });
});
