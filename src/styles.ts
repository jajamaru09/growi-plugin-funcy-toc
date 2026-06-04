const STYLE_ID = 'grw-plugin-funcy-toc-styles';

const CSS = `
.grw-plugin-funcy-toc {
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 8px;
  background: var(--bs-tertiary-bg, #f8f9fa);
  padding: 0.5rem 1rem 0.75rem;
  margin: 1rem 0;
  display: inline-block;
  min-width: 280px;
  max-width: 100%;
}
.grw-plugin-funcy-toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
}
.grw-plugin-funcy-toc-title {
  font-weight: 600;
  font-size: 1rem;
}
.grw-plugin-funcy-toc-toggle {
  line-height: 1;
  padding: 0 0.5rem;
  min-width: 2rem;
}
.grw-plugin-funcy-toc-body {
  margin-top: 0.25rem;
}
.grw-plugin-funcy-toc-list {
  list-style: none;
  margin: 0;
  padding-left: 1rem;
}
.grw-plugin-funcy-toc-body > .grw-plugin-funcy-toc-list {
  padding-left: 0;
}
.grw-plugin-funcy-toc-list li {
  margin: 0.15rem 0;
}
.grw-plugin-funcy-toc-link {
  text-decoration: none;
  color: var(--bs-link-color, #0d6efd);
}
.grw-plugin-funcy-toc-link:hover {
  text-decoration: underline;
}
`;

export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
