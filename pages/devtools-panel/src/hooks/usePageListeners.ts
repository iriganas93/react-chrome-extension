import { GAME_MESSAGES } from '@extension/shared';
import { controlBus } from '@src/services/controlBus';
import { controlUpdateEvent, pageConfigEvent, pageConnectionEvent } from '@src/utils/events';
import { useEffect } from 'react';
import { onMessage } from 'webext-bridge/devtools';
import type { RegisterConfigPayload, ControlUpdatePayload } from '@extension/shared';

export const usePageListeners = () => {
  useEffect(() => {
    const onPageRegisterConfig = onMessage(GAME_MESSAGES.REGISTER_CONFIG, ({ data }) => {
      const { config } = data as unknown as RegisterConfigPayload;
      if (config) controlBus.emit({ event: pageConfigEvent(), value: config });
    });

    const onPageInitMessage = onMessage(GAME_MESSAGES.PAGE_INIT, ({ data }) => {
      controlBus.emit({ event: pageConnectionEvent(), value: data });
    });

    const onPageControlUpdate = onMessage(GAME_MESSAGES.CONTROL_UPDATE, ({ data }) => {
      const { controlId, value } = data as ControlUpdatePayload;
      controlBus.emit({ event: controlUpdateEvent(controlId), value });
    });

    return () => {
      onPageInitMessage();
      onPageRegisterConfig();
      onPageControlUpdate();
    };
  }, []);
};
