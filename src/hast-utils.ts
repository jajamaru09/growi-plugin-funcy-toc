import type { Node, Text } from 'hast';

export function toText(node: Node): string {
  if (node.type === 'text') {
    return (node as Text).value;
  }
  const children = (node as { children?: Node[] }).children;
  if (Array.isArray(children)) {
    return children.map(toText).join('');
  }
  return '';
}

export interface Slugger {
  reserve(id: string): void;
  slug(text: string): string;
}

export function createSlugger(): Slugger {
  const used = new Set<string>();
  return {
    reserve(id: string): void {
      used.add(id);
    },
    slug(text: string): string {
      const base = (text.toLowerCase().trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')) || 'section';
      let candidate = base;
      let i = 1;
      while (used.has(candidate)) {
        candidate = `${base}-${i}`;
        i += 1;
      }
      used.add(candidate);
      return candidate;
    },
  };
}
