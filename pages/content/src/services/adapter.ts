// pages/content/matches/example/index.ts (MAIN world)
import {
  NAMESPACE,
  DEV_TOOLS_MESSAGES,
  isButton,
  isButtonGroup,
  isWithValue,
  sendGameRegisterConfigMessage,
  sendGamePageInitMessage,
  sendGameControlUpdateMessage,
  cloneForPanel,
} from '@extension/shared';
import { collectControls, controls } from '@src/services/controls';
import { setNamespace, onMessage } from 'webext-bridge/window';
import type {
  DevToolsRootConfig,
  AnyControlConfig,
  AugmentedControl,
  ControlsChangePayload,
  ControlClickPayload,
  ControlValue,
} from '@extension/shared';

/** Namespace — keep in sync with content-script/devtools */
setNamespace(NAMESPACE);

let lastConfig: DevToolsRootConfig | null = null;

const adapter = {
  /** Initialize with full config (callbacks preserved locally). */
  init(rootConfig: DevToolsRootConfig) {
    lastConfig = rootConfig;
    controls.clear();
    rootConfig.tabs.forEach(collectControls);

    sendGameRegisterConfigMessage(rootConfig);
    sendGamePageInitMessage();

    return adapter;
  },

  control(id: string): AugmentedControl | AnyControlConfig | undefined {
    const control = controls.get(id);

    if (!control) return undefined;
    if (!isWithValue(control)) return control;
    if (control.__isProxied) return control.__proxyRef;

    const proxy = new Proxy(control, {
      // Control what gets exposed to the page accessing the control
      get(target, prop: keyof AugmentedControl) {
        if (prop === '__isProxied') return true;
        if (prop === '__proxyRef') return proxy;
        if (prop === 'update') {
          return (payload: typeof proxy.value) => {
            proxy.value = payload;
          };
        }
        return target[prop];
      },
      set(target, prop, val: ControlValue) {
        const ok = Reflect.set(target, prop, val);
        if (prop !== 'value' || typeof target.onChange !== 'function') return ok;

        try {
          target.onChange(val);
        } catch (e) {
          console.warn('[DevToolsAdapter] onChange error:', e);
        }
        sendGameControlUpdateMessage(target.id, val);
        return ok;
      },
    });

    control.__isProxied = true;
    control.__proxyRef = proxy;
    return proxy;
  },
};

// expose to the page/game
type WindowWithAdapter = Window & { __DEV_TOOLS_ADAPTER?: typeof adapter };
(window as WindowWithAdapter).__DEV_TOOLS_ADAPTER = adapter;

// Panel asks for current config → return JSON-safe copy
onMessage(DEV_TOOLS_MESSAGES.REQUEST_CONFIG, async () => ({
  config: lastConfig ? cloneForPanel(lastConfig) : null,
}));

// Panel sets a control (value/payload) → call callbacks & push update
onMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, ({ data }) => {
  const { controlId, value } = data as ControlsChangePayload;
  const control = controls.get(controlId);
  if (!control) return;

  const handle = adapter.control(controlId) as AugmentedControl;

  if (isWithValue(control)) {
    if (handle) handle.value = value;
    return;
  }

  if (handle?.update) handle.update(value);
});

// Panel triggers button/buttonGroup → call onClick handlers
onMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, ({ data }) => {
  const { controlId, buttonId } = data as ControlClickPayload;
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
