import { DESTINATIONS, DEV_TOOLS_MESSAGES, toJsonValue } from '@extension/shared';
import { controlBus } from '@src/services/controlBus';
import { pageConfigEvent } from '@src/utils/events';
import { useEffect } from 'react';
import { sendMessage } from 'webext-bridge/devtools';
import type { RegisterConfigPayload } from '@extension/shared';

export const useRequestConfig = () => {
  useEffect(() => {
    (async () => {
      const res = (await sendMessage(
        DEV_TOOLS_MESSAGES.REQUEST_CONFIG,
        toJsonValue({ config: {} }),
        DESTINATIONS.CONTENT_SCRIPT,
      )) as unknown as RegisterConfigPayload;
      if (res?.config) controlBus.emit({ event: pageConfigEvent(), value: res.config });
    })();
  }, []);
};
