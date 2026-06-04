import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isPluginEnabled, setEnabled, log, PLUGIN_NAME } from './hub';

const HUB_SETTINGS_KEY = 'growiPluginHub:settings';

describe('isPluginEnabled', () => {
  beforeEach(() => { setEnabled(true); delete (window as any).growiPluginHub; });

  it('returns true on the fast path when enabled', () => {
    expect(isPluginEnabled()).toBe(true);
  });

  it('returns false when disabled and no hub', () => {
    setEnabled(false);
    expect(isPluginEnabled()).toBe(false);
  });

  it('re-syncs from hub state when disabled but hub says active', () => {
    setEnabled(false);
    (window as any).growiPluginHub = {
      _getPluginStates: () => [{ registration: { id: PLUGIN_NAME }, status: 'active' }],
    };
    expect(isPluginEnabled()).toBe(true);
  });
});

describe('log fallback (no hub)', () => {
  let spy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    delete (window as any).growiPluginHub;
    localStorage.clear();
    spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => spy.mockRestore());

  it('stays silent when no hub settings exist', () => {
    log('hi');
    expect(spy).not.toHaveBeenCalled();
  });

  it('stays silent when debug is not true', () => {
    localStorage.setItem(HUB_SETTINGS_KEY, JSON.stringify({ debug: false }));
    log('hi');
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs when debug is true', () => {
    localStorage.setItem(HUB_SETTINGS_KEY, JSON.stringify({ debug: true }));
    log('hi');
    expect(spy).toHaveBeenCalledWith(`[${PLUGIN_NAME}]`, 'hi');
  });

  it('stays silent when this plugin is blacklisted in debugPlugins', () => {
    localStorage.setItem(HUB_SETTINGS_KEY, JSON.stringify({ debug: true, debugPlugins: [PLUGIN_NAME] }));
    log('hi');
    expect(spy).not.toHaveBeenCalled();
  });
});
