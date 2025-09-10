// src/bridge/registerGameListeners.ts
import { GAME_MESSAGES } from '@extension/shared';
import { controlBus } from '@src/services/controlBus';
import { controlUpdateEvent, pageConnectionEvent } from '@src/utils/events';
import { useEffect } from 'react';
import { onMessage } from 'webext-bridge/devtools';
import type { ControlUpdatePayload } from '@extension/shared';

export const usePageListeners = () => {
  useEffect(() => {
    const offInit = onMessage(GAME_MESSAGES.PAGE_INIT, ({ data }) => {
      controlBus.emit({ event: pageConnectionEvent, value: data });
    });

    const off = onMessage(GAME_MESSAGES.CONTROL_UPDATE, ({ data }) => {
      const { controlId, value } = data as ControlUpdatePayload;
      controlBus.emit({ event: controlUpdateEvent(controlId), value });
    });

    return () => {
      offInit();
      off();
    };
  }, []);
};
