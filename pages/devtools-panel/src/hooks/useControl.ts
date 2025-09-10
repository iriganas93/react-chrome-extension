import { sendControlOnChangeMessage } from '@src/devtools-messages';
import { controlBus } from '@src/services/controlBus';
import { controlUpdateEvent } from '@src/utils/events';
import { useEffect, useState } from 'react';
import type { ControlConfigWithValue } from '@extension/shared';

export const useControl = <T extends ControlConfigWithValue>(controlConfig: T) => {
  const [controlValue, setControlValue] = useState<T['value']>(controlConfig.value);
  console.log(`Initialized control ${controlConfig.id} with value: `, controlValue);

  useEffect(
    () =>
      controlBus.on(controlUpdateEvent(controlConfig.id), ({ value }) => {
        setControlValue(value as T['value']);
      }),
    [controlConfig.id],
  );

  const handleControlChange = async (newValue: T['value']) => {
    console.log(`${controlConfig.id} changed to: `, newValue);
    await sendControlOnChangeMessage(controlConfig.id, newValue);
    setControlValue(newValue);
  };

  return { controlValue, handleControlChange };
};
