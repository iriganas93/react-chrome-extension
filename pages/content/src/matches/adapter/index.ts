// The adapter script should run in the MAIN-WORLD (on inspected window context)
import {
  NAMESPACE,
  DEV_TOOLS_MESSAGES,
  sendGameRegisterConfigMessage,
  sendGamePageInitMessage,
  toJsonValue,
  logger,
} from '@extension/shared';
import { collectControls, controls } from '@src/services/controls';
import { setNamespace, onMessage } from 'webext-bridge/window';
import type { DevToolsRootConfig, ControlsChangePayload, ControlClickPayload } from '@extension/shared';
import type { Control } from '@src/services/controls';

/** Namespace — keep in sync with content-script/devtools */
setNamespace(NAMESPACE);

let lastConfig: DevToolsRootConfig | null = null;

const adapter = {
  /** Initialize with full config (callbacks preserved locally). */
  init(rootConfig: DevToolsRootConfig) {
    lastConfig = rootConfig;
    controls.clear();
    rootConfig.tabs.forEach(collectControls);

    sendGamePageInitMessage();
    sendGameRegisterConfigMessage(rootConfig);

    return adapter;
  },

  control(id: string): Control | undefined {
    return controls.get(id);
  },
};

// expose to the page/game
type WindowWithAdapter = Window & { __DEV_TOOLS_ADAPTER?: typeof adapter };
(window as WindowWithAdapter).__DEV_TOOLS_ADAPTER = adapter;
logger.log('Injected: adapter ready — use window.__DEV_TOOLS_ADAPTER.init(config)');

// Panel asks for current config → return JSON-safe copy
onMessage(DEV_TOOLS_MESSAGES.REQUEST_CONFIG, async () => ({
  config: lastConfig ? toJsonValue(lastConfig) : null,
}));

// Panel sets a control (value/payload) → call callbacks & push update
onMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, ({ data }) => {
  const { controlId, value } = data as ControlsChangePayload;
  const control = adapter.control(controlId);
  if (!control) return;

  control.onChange(value);
});

// Panel triggers button/buttonGroup → call onClick handlers
onMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, ({ data }) => {
  const { controlId } = data as ControlClickPayload;
  const control = adapter.control(controlId);
  if (!control) return;

  control.onClick();
});
