// pages/content/matches/example/index.ts (MAIN world)
import {
  NAMESPACE,
  DEV_TOOLS_MESSAGES,
  GAME_MESSAGES,
  isButton,
  isButtonGroup,
  isFolder,
  isTab,
  isTable,
  isWithValue,
} from '@extension/shared';
import { setNamespace, onMessage, sendMessage } from 'webext-bridge/window';
import type {
  DevToolsRootConfig,
  AnyControlConfig,
  TableControlConfig,
  WithValue,
  BaseControl,
} from '@extension/shared';

/** Namespace — keep in sync with content-script/devtools */
setNamespace(NAMESPACE);

let lastConfig: DevToolsRootConfig | null = null;

// augment runtime with proxy markers
type AugmentedControl = AnyControlConfig & {
  __isProxied?: boolean;
  __proxyRef?: any;
};

const controls = new Map<string, AugmentedControl>();

const cloneForPanel = <T>(obj: T) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

const collectControls = (node: AnyControlConfig) => {
  controls.set(node.id, node as AugmentedControl);
  if (isFolder(node)) node.controls.forEach(collectControls);
  if (isTab(node)) node.controls.forEach(collectControls);
};

const pushUpdate = (controlId: string, value: unknown) => {
  // always send JSON-safe
  sendMessage(GAME_MESSAGES.CONTROL_UPDATE, { controlId, value: cloneForPanel(value) }, 'content-script').catch(
    () => {},
  );
};

const adapter = {
  /** Initialize with full config (callbacks preserved locally). */
  init(rootConfig: DevToolsRootConfig) {
    lastConfig = rootConfig;
    controls.clear();
    rootConfig.tabs.forEach(collectControls);

    // send JSON-safe config to panel
    sendMessage(GAME_MESSAGES.REGISTER_CONFIG, { config: cloneForPanel(rootConfig) }, 'content-script').catch(() => {});
    sendMessage(GAME_MESSAGES.PAGE_INIT, { ready: true, href: location.href }, 'content-script').catch(() => {});

    return adapter;
  },

  /** Get a control handle.
   *  - Value controls: returns a proxy with `.value` and `.update(payload)`.
   *  - Non-value controls: returns a handle with `.update(payload)` that calls onChange/updates panel.
   */
  control<T = unknown>(id: string): T | undefined {
    const raw = controls.get(id);
    if (!raw) return undefined;

    // VALUE CONTROLS (number, boolean, text, color, json, vector)
    if (isWithValue(raw)) {
      if (raw.__isProxied) return raw.__proxyRef as T;

      const proxy = new Proxy(raw as WithValue<any> & BaseControl, {
        get(target, prop) {
          if (prop === '__isProxied') return true;
          if (prop === '__proxyRef') return proxy;
          if (prop === 'update') {
            // funnel updates through the setter to trigger onChange + pushUpdate
            return (payload: unknown) => {
              (proxy as any).value = payload;
            };
          }
          return (target as any)[prop];
        },
        set(target, prop: any, val) {
          const ok = Reflect.set(target as any, prop, val);
          if (prop === 'value') {
            // invoke callback
            const fn = (target as any).onChange;
            if (typeof fn === 'function') {
              try {
                fn(val);
              } catch (e) {
                console.warn('[DevToolsAdapter] onChange error:', e);
              }
            }
            // inform panel
            pushUpdate(target.id, val);
          }
          return ok;
        },
      });

      raw.__isProxied = true;
      raw.__proxyRef = proxy;
      return proxy as any;
    }

    // NON-VALUE CONTROLS
    // - table: update(payload = newData[]) → calls onChange(newData?) + pushUpdate(newData)
    // - button/buttonGroup: no update; handled via CONTROL_TRIGGER
    // - spine/folder/tab: ignore updates
    if (isTable(raw)) {
      return {
        ...(raw as object),
        update(newData: unknown[]) {
          const fn = (raw as TableControlConfig<any>).onChange;
          if (typeof fn === 'function') {
            try {
              fn(newData as any[]);
            } catch (e) {
              console.warn('[DevToolsAdapter] table.onChange error:', e);
            }
          }
          pushUpdate(raw.id, newData);
        },
      } as any;
    }

    // generic non-value: expose update(payload) that forwards to onChange if present
    return {
      ...(raw as object),
      update(payload: unknown) {
        const fn = (raw as any).onChange;
        if (typeof fn === 'function') {
          try {
            fn(payload);
          } catch (e) {
            console.warn('[DevToolsAdapter] onChange error:', e);
          }
        }
        pushUpdate(raw.id, payload);
      },
    } as any;
  },

  /** Cleanup */
  dispose() {
    controls.clear();
    lastConfig = null;
  },
};

// expose to the page/game
(window as any).__DEV_TOOLS_ADAPTER = adapter;
console.log('[CEB] Injected: adapter ready — use window.__DEV_TOOLS_ADAPTER.init(config)');

/* =========================
   Bridge handlers (devtools → page)
========================= */

// Panel asks for current config → return JSON-safe copy
onMessage(DEV_TOOLS_MESSAGES.REQUEST_CONFIG, async () => ({
  config: lastConfig ? cloneForPanel(lastConfig) : null,
}));

// Panel sets a control (value/payload) → call callbacks & push update
onMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, ({ data }) => {
  const { controlId, value } = (data || {}) as { controlId: string; value: unknown };
  const raw = controls.get(controlId);
  if (!raw) return;

  if (isWithValue(raw)) {
    // route via proxy to ensure onChange + pushUpdate happen every time
    const handle = adapter.control(controlId) as any;
    if (handle) handle.value = value;
    return;
  }

  // table or generic non-value types → use .update(payload)
  const handle = adapter.control(controlId) as any;
  if (handle?.update) handle.update(value);
});

// Panel triggers button/buttonGroup → call onClick handlers
onMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, ({ data }) => {
  const { controlId, buttonId } = (data || {}) as { controlId: string; buttonId?: string };
  const raw = controls.get(controlId);
  if (!raw) return;

  if (isButton(raw) && typeof raw.onClick === 'function') {
    try {
      raw.onClick();
    } catch (e) {
      console.warn('[DevToolsAdapter] onClick error:', e);
    }
    return;
  }

  if (isButtonGroup(raw)) {
    const btn = raw.buttons.find(b => b.id === buttonId);
    if (btn && typeof btn.onClick === 'function') {
      try {
        btn.onClick();
      } catch (e) {
        console.warn('[DevToolsAdapter] buttonGroup.onClick error:', e);
      }
    }
  }
});
