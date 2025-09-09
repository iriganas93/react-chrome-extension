import { DEV_TOOLS_MESSAGES, GAME_MESSAGES, DESTINATIONS, toJsonValue } from '@extension/shared';
import { useEffect, useState } from 'react';
import { onMessage, sendMessage } from 'webext-bridge/devtools';
import type { DevToolsRootConfig, RegisterConfigPayload } from '@extension/shared';

export const useConfig = () => {
  const [config, setConfig] = useState<DevToolsRootConfig>({} as DevToolsRootConfig);

  useEffect(() => {
    // page -> panel pushes
    const offCfg = onMessage(GAME_MESSAGES.REGISTER_CONFIG, ({ data }) => {
      const { config: registeredConfig } = data as unknown as RegisterConfigPayload;
      if (registeredConfig) setConfig(registeredConfig);
    });

    // pull current config on mount
    (async () => {
      try {
        const res = (await sendMessage(
          DEV_TOOLS_MESSAGES.REQUEST_CONFIG,
          toJsonValue({ config: {} }),
          DESTINATIONS.CONTENT_SCRIPT,
        )) as unknown as RegisterConfigPayload;
        if (res?.config) {
          setConfig(res.config);
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      offCfg();
    };
  }, []);
  return config;
};
