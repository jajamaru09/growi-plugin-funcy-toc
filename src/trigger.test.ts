import { describe, it, expect } from 'vitest';
import { parseTrigger } from './trigger';

describe('parseTrigger', () => {
  it('matches the bare Japanese keyword with default levels', () => {
    expect(parseTrigger('目次')).toEqual({ title: '目次', min: 1, max: 4 });
  });

  it('trims whitespace and matches case-insensitively', () => {
    expect(parseTrigger('  Toc  ')).toEqual({ title: 'Toc', min: 1, max: 4 });
  });

  it('matches "table of contents"', () => {
    expect(parseTrigger('Table of Contents')).toEqual({
      title: 'Table of Contents', min: 1, max: 4,
    });
  });

  it('parses an explicit {min-max} range', () => {
    expect(parseTrigger('目次 {2-4}')).toEqual({ title: '目次', min: 2, max: 4 });
  });

  it('falls back to defaults when min > max', () => {
    expect(parseTrigger('toc {5-2}')).toEqual({ title: 'toc', min: 1, max: 4 });
  });

  it('clamps levels into 1..6', () => {
    expect(parseTrigger('toc {0-9}')).toEqual({ title: 'toc', min: 1, max: 6 });
  });

  it('returns null for non-keyword headings', () => {
    expect(parseTrigger('はじめに')).toBeNull();
  });

  it('returns null when a malformed option breaks the keyword match', () => {
    expect(parseTrigger('目次 {3}')).toBeNull();
  });
});
