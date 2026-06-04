import { describe, it, expect, vi } from 'vitest';

// Emulate the PRODUCTION behavior of growiReact, which dereferences
// window.growiFacade.react and therefore throws if growiFacade is not yet set.
vi.mock('@growi/pluginkit/dist/v4/client/utils/growi-facade/growi-react', () => ({
  growiReact: () => (window as unknown as { growiFacade: { react: unknown } }).growiFacade.react,
}));

describe('FuncyToc module load safety', () => {
  it('does not touch window.growiFacade at import time (deferred to render)', async () => {
    // growiFacade is undefined at plugin bundle load time in real GROWI.
    delete (window as unknown as { growiFacade?: unknown }).growiFacade;

    // Importing the module must not throw even though growiFacade is undefined.
    await expect(import('./FuncyToc')).resolves.toHaveProperty('FuncyToc');
  });
});
