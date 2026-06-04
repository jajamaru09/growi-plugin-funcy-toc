import { describe, it, expect } from 'vitest';
import { toText, createSlugger } from './hast-utils';

describe('toText', () => {
  it('concatenates nested text nodes', () => {
    const node = {
      type: 'element', tagName: 'h2', properties: {},
      children: [
        { type: 'text', value: 'Hello ' },
        { type: 'element', tagName: 'em', properties: {}, children: [{ type: 'text', value: 'World' }] },
      ],
    };
    expect(toText(node as any)).toBe('Hello World');
  });
});

describe('createSlugger', () => {
  it('slugifies text', () => {
    const s = createSlugger();
    expect(s.slug('Hello World')).toBe('hello-world');
  });

  it('de-duplicates repeated slugs', () => {
    const s = createSlugger();
    expect(s.slug('Hello')).toBe('hello');
    expect(s.slug('Hello')).toBe('hello-1');
  });

  it('avoids collision with reserved ids', () => {
    const s = createSlugger();
    s.reserve('intro');
    expect(s.slug('Intro')).toBe('intro-1');
  });

  it('keeps unicode letters', () => {
    const s = createSlugger();
    expect(s.slug('日本語')).toBe('日本語');
  });

  it('falls back to "section" for empty text', () => {
    const s = createSlugger();
    expect(s.slug('   ')).toBe('section');
  });
});
