import React from 'react';
import { growiReact } from '@growi/pluginkit/dist/v4/client/utils/growi-facade/growi-react';
import { buildTocTree } from './toc-tree';
import { readCollapsed, writeCollapsed } from './collapse-store';
import type { TocData, TocNode } from './types';

const C = {
  root: 'grw-plugin-funcy-toc',
  header: 'grw-plugin-funcy-toc-header',
  title: 'grw-plugin-funcy-toc-title',
  toggle: 'grw-plugin-funcy-toc-toggle',
  body: 'grw-plugin-funcy-toc-body',
  list: 'grw-plugin-funcy-toc-list',
  link: 'grw-plugin-funcy-toc-link',
};

type FuncyTocProps = {
  node?: { properties?: { dataFuncyToc?: unknown } };
  'data-funcy-toc'?: unknown;
  dataFuncyToc?: unknown;
};

function parseData(props: FuncyTocProps): TocData | null {
  const raw = props?.node?.properties?.dataFuncyToc
    ?? props?.['data-funcy-toc']
    ?? props?.dataFuncyToc;
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as TocData;
  } catch {
    return null;
  }
}

function handleClick(e: React.MouseEvent, id: string): void {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try {
    history.pushState(null, '', `#${id}`);
  } catch {
    // ignore (e.g. cross-origin restrictions)
  }
}

function renderNodes(nodes: TocNode[]): React.ReactElement {
  return (
    <ul className={C.list}>
      {nodes.map(n => (
        <li key={n.id}>
          <a className={C.link} href={`#${n.id}`} onClick={e => handleClick(e, n.id)}>
            {n.text}
          </a>
          {n.children.length > 0 ? renderNodes(n.children) : null}
        </li>
      ))}
    </ul>
  );
}

export function FuncyToc(props: FuncyTocProps): React.ReactElement | null {
  // Resolve React from GROWI's facade at RENDER time, not module-load time.
  // In production growiReact reads window.growiFacade.react, which is only
  // defined once GROWI's renderer is active — calling it at import would crash.
  const { useState, useCallback } = growiReact(React);

  const data = parseData(props);
  const pagePath = typeof location !== 'undefined' ? location.pathname : '';
  const [collapsed, setCollapsed] = useState<boolean>(() => readCollapsed(pagePath));
  const toggle = useCallback(() => {
    setCollapsed((c: boolean) => {
      const next = !c;
      writeCollapsed(pagePath, next);
      return next;
    });
  }, [pagePath]);

  if (!data) return null;
  const tree = buildTocTree(data.headings, data.min, data.max);
  if (tree.length === 0) return null;

  return (
    <div className={C.root}>
      <div className={C.header}>
        <span className={C.title}>{data.title}</span>
        <button
          type="button"
          className={`${C.toggle} btn btn-sm btn-outline-secondary`}
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        >
          {collapsed ? '+' : '−'}
        </button>
      </div>
      {collapsed ? null : <nav className={C.body}>{renderNodes(tree)}</nav>}
    </div>
  );
}
