import { describe, it, expect, beforeEach } from 'vitest';
import { readCollapsed, writeCollapsed } from './collapse-store';

describe('collapse-store', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to not collapsed (open)', () => {
    expect(readCollapsed('/page')).toBe(false);
  });

  it('round-trips a collapsed=true value per page path', () => {
    writeCollapsed('/page-a', true);
    writeCollapsed('/page-b', false);
    expect(readCollapsed('/page-a')).toBe(true);
    expect(readCollapsed('/page-b')).toBe(false);
  });
});
