import { controlBus } from '@src/services/controlBus';
import { pageConfigEvent } from '@src/utils/events';
import { useEffect, useState } from 'react';
import type { DevToolsRootConfig } from '@extension/shared';

export const useConfig = () => {
  const [config, setConfig] = useState<DevToolsRootConfig>({} as DevToolsRootConfig);

  useEffect(
    () =>
      controlBus.on(pageConfigEvent(), ({ value }) => {
        setConfig(value as DevToolsRootConfig);
      }),
    [],
  );
  return config;
};
