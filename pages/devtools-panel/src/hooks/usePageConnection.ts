import { controlBus } from '@src/services/controlBus';
import { pageConnectionEvent } from '@src/utils/events';
import { useEffect, useState } from 'react';
import type { PageInitPayload } from '@extension/shared';

export const usePageConnection = () => {
  const [connection, setConnection] = useState<PageInitPayload>({
    ready: false,
    href: '',
  });
  const isConnected = connection && connection.ready;

  useEffect(
    () =>
      controlBus.on(pageConnectionEvent(), ({ value }) => {
        setConnection(value as PageInitPayload);
      }),
    [],
  );

  return { connection, isConnected };
};
