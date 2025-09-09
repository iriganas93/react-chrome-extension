import { GAME_MESSAGES } from '@extension/shared';
import { sendControlOnChangeMessage } from '@src/devtools-messages';
import { useCallback, useEffect, useState } from 'react';
import { onMessage } from 'webext-bridge/devtools';
import type { ControlConfigWithValue, ControlUpdatePayload } from '@extension/shared';

export const useControl = <T extends ControlConfigWithValue>(controlConfig: T) => {
  const [controlValue, setControlValue] = useState<T['value']>(controlConfig.value);

  useEffect(() => {
    const offUpd = onMessage(GAME_MESSAGES.CONTROL_UPDATE, ({ data }) => {
      const { controlId, value } = data as ControlUpdatePayload;
      if (controlId !== controlConfig.id) return;

      console.log(`${controlConfig.id} received updated value: `, value);
      setControlValue(value);
    });

    return () => {
      offUpd();
    };
  }, [controlConfig.id]);

  const handleControlChange = useCallback(
    async (newValue: T['value']) => {
      await sendControlOnChangeMessage(controlConfig.id, newValue);
      setControlValue(newValue);
    },
    [controlConfig.id],
  );

  return { controlValue, handleControlChange };
};
