const PREFIX = 'funcy-toc:collapsed:';

export function readCollapsed(pagePath: string): boolean {
  try {
    return localStorage.getItem(PREFIX + pagePath) === '1';
  } catch {
    return false;
  }
}

export function writeCollapsed(pagePath: string, collapsed: boolean): void {
  try {
    localStorage.setItem(PREFIX + pagePath, collapsed ? '1' : '0');
  } catch {
    // localStorage unavailable (private mode etc.) — ignore
  }
}
