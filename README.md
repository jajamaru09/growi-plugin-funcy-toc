# growi-plugin-funcy-toc

A good-looking, collapsible WordPress-style table of contents for GROWI.

## Usage

Write a heading whose text is `目次`, `toc`, or `table of contents` (case-insensitive)
anywhere in a page. A TOC box is rendered in its place, listing the page's headings.

```markdown
## 目次
```

Restrict the heading levels with an inline range (default is H1–H4):

```markdown
## 目次 {2-4}
```

Features: collapse/expand (remembered per page via localStorage), smooth scroll,
and URL-hash update on click.

## Development

```bash
npm install
npm test
npm run build
```

The built `dist/` directory is committed so GROWI can load the assets directly.
Install in GROWI's admin screen by pointing it at this repository's git URL.

## extension-hub

When `growi-plugin-extension-hub` is installed, this plugin appears in the hub's
ON/OFF settings and routes debug logs through `hub.log()`. It also works fully
standalone when the hub is absent.
