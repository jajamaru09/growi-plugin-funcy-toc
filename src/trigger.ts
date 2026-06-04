export interface TriggerInfo {
  title: string;
  min: number;
  max: number;
}

const KEYWORDS = new Set(['目次', 'toc', 'table of contents']);
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 4;

function clampLevel(n: number): number {
  if (n < 1) return 1;
  if (n > 6) return 6;
  return n;
}

export function parseTrigger(text: string): TriggerInfo | null {
  const trimmed = text.trim();
  let title = trimmed;
  let min = DEFAULT_MIN;
  let max = DEFAULT_MAX;

  const m = trimmed.match(/^(.*?)\s*\{\s*(\d)\s*-\s*(\d)\s*\}$/);
  if (m) {
    title = m[1].trim();
    const a = clampLevel(Number(m[2]));
    const b = clampLevel(Number(m[3]));
    if (a <= b) { min = a; max = b; }
    // else: keep defaults (malformed range)
  }

  if (!KEYWORDS.has(title.toLowerCase())) return null;
  return { title, min, max };
}
