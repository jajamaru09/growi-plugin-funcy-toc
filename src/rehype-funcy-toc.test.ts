import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { rehypeFuncyToc } from './rehype-funcy-toc';
import type { TocData } from './types';

function run(html: string): Root {
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html) as Root;
  rehypeFuncyToc()(tree);
  return tree;
}

function findFuncyToc(tree: Root): Element | undefined {
  let found: Element | undefined;
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'funcy-toc') found = node;
  });
  return found;
}

function getData(node: Element): TocData {
  return JSON.parse(String(node.properties?.dataFuncyToc)) as TocData;
}

describe('rehypeFuncyToc', () => {
  it('replaces a trigger heading with a funcy-toc element and excludes itself', () => {
    const tree = run(
      '<h2 id="a">目次</h2><h2 id="intro">Intro</h2><h3 id="sub">Sub</h3>',
    );
    const toc = findFuncyToc(tree);
    expect(toc).toBeDefined();
    const data = getData(toc!);
    expect(data.title).toBe('目次');
    expect(data.min).toBe(1);
    expect(data.max).toBe(4);
    expect(data.headings).toEqual([
      { depth: 2, id: 'intro', text: 'Intro' },
      { depth: 3, id: 'sub', text: 'Sub' },
    ]);
  });

  it('generates ids for headings that lack one', () => {
    const tree = run('<h2>目次</h2><h2>Intro</h2>');
    const data = getData(findFuncyToc(tree)!);
    expect(data.headings).toEqual([{ depth: 2, id: 'intro', text: 'Intro' }]);
    let headingId: unknown;
    visit(tree, 'element', (n: Element) => {
      if (n.tagName === 'h2') headingId = n.properties?.id;
    });
    expect(headingId).toBe('intro');
  });

  it('honors an inline {min-max} option', () => {
    const tree = run('<h2 id="t">目次 {2-3}</h2><h1 id="x">X</h1><h2 id="y">Y</h2>');
    const data = getData(findFuncyToc(tree)!);
    expect(data.min).toBe(2);
    expect(data.max).toBe(3);
    expect(data.headings).toEqual([
      { depth: 1, id: 'x', text: 'X' },
      { depth: 2, id: 'y', text: 'Y' },
    ]);
  });

  it('leaves the tree unchanged when there is no trigger', () => {
    const tree = run('<h2 id="intro">Intro</h2>');
    expect(findFuncyToc(tree)).toBeUndefined();
  });
});
