import { logger } from '@extension/shared';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    logger.log('[content-ui/all] Loaded content-ui');
  }, []);

  return <></>;
}
