// src/bridge/registerGameListeners.ts
import { GAME_MESSAGES } from '@extension/shared';
import { controlBus } from '@src/services/controlBus';
import { controlUpdateEvent } from '@src/utils/events';
import { useEffect } from 'react';
import { onMessage } from 'webext-bridge/devtools';
import type { ControlUpdatePayload } from '@extension/shared';

export const useGameListeners = () => {
  useEffect(() => {
    console.log('Listening for game messages...');
    const off = onMessage(GAME_MESSAGES.CONTROL_UPDATE, ({ data }) => {
      const { controlId, value } = data as ControlUpdatePayload;
      console.log('Received control update from game:', { controlId, value });
      controlBus.emit({ controlEventId: controlUpdateEvent(controlId), value });
    });

    return () => {
      off();
    };
  }, []);
};
