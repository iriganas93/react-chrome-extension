import { Conditional } from '@src/components/common/conditional';
import Config from '@src/components/config';
import { ConnectedContent } from '@src/components/container/connectedContent';
import { usePageConnection } from '@src/hooks/usePageConnection';
import Disconnected from '@src/views/diconnected';

export default function UI() {
  const { isConnected } = usePageConnection();

  return (
    <Conditional condition={isConnected} fallback={<Disconnected />}>
      <ConnectedContent>
        <div style={{ fontFamily: 'system-ui' }}>
          <Config />
        </div>
      </ConnectedContent>
    </Conditional>
  );
}
