import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { toText, createSlugger } from './hast-utils';
import { parseTrigger, type TriggerInfo } from './trigger';
import type { HeadingItem, TocData } from './types';

export type LogFn = (...args: unknown[]) => void;
const noop: LogFn = () => {};

export interface RehypeFuncyTocOptions {
  log?: LogFn;
  context?: string;
}

const HEADING_DEPTH: Record<string, number> = {
  h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6,
};

interface TaggedElement extends Element {
  __funcyTrigger?: TriggerInfo;
}

export function rehypeFuncyToc(options: RehypeFuncyTocOptions = {}) {
  const log = options.log ?? noop;
  const ctx = options.context ?? 'unknown';

  return (tree: Root): void => {
    const slugger = createSlugger();
    const headings: HeadingItem[] = [];
    const triggers: TaggedElement[] = [];

    // Pass 1: reserve all existing ids so generated slugs never collide.
    visit(tree, 'element', (node: Element) => {
      const id = node.properties?.id;
      if (typeof id === 'string') slugger.reserve(id);
    });

    // Pass 2: classify headings into triggers vs. content headings.
    visit(tree, 'element', (node: Element) => {
      const depth = HEADING_DEPTH[node.tagName];
      if (!depth) return;

      const text = toText(node);
      const trigger = parseTrigger(text);
      if (trigger) {
        (node as TaggedElement).__funcyTrigger = trigger;
        triggers.push(node as TaggedElement);
        return;
      }

      let id = typeof node.properties?.id === 'string' ? (node.properties.id as string) : '';
      if (!id) {
        id = slugger.slug(text);
        node.properties = { ...(node.properties ?? {}), id };
      }
      headings.push({ depth, id, text: text.trim() });
    });

    // Pass 3: replace each trigger heading with a <funcy-toc> element.
    let triggerCount = 0;
    for (const node of triggers) {
      const trigger = node.__funcyTrigger as TriggerInfo;
      delete node.__funcyTrigger;
      const data: TocData = {
        title: trigger.title,
        min: trigger.min,
        max: trigger.max,
        headings,
      };
      node.tagName = 'funcy-toc';
      node.properties = { dataFuncyToc: JSON.stringify(data) };
      node.children = [];
      triggerCount += 1;
    }

    log(`[rehypeFuncyToc/${ctx}] headings=${headings.length} triggers=${triggerCount}`);
  };
}
