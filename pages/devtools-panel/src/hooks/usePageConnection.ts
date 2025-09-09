import { GAME_MESSAGES } from '@extension/shared';
import { useEffect, useState } from 'react';
import { onMessage } from 'webext-bridge/devtools';
import type { PageInitPayload } from '@extension/shared';

export const usePageConnection = () => {
  const [connection, setConnection] = useState<PageInitPayload>({
    ready: false,
    href: '',
  });

  useEffect(() => {
    // page -> panel pushes
    const offCfg = onMessage(GAME_MESSAGES.PAGE_INIT, ({ data }) => {
      if (data) setConnection(data as PageInitPayload);
    });

    return () => {
      offCfg();
    };
  }, []);

  return connection;
};
