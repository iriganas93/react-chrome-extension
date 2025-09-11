import { Conditional } from '@src/components/common/conditional';
import Config from '@src/components/config';
import { ConnectedContent } from '@src/components/container/connectedContent';
import { sendControlOnClickMessage } from '@src/devtools-messages';
import { usePageConnection } from '@src/hooks/usePageConnection';
import Disconnected from '@src/views/diconnected';

export default function UI() {
  const { isConnected } = usePageConnection();

  return (
    <Conditional condition={isConnected} fallback={<Disconnected />}>
      <ConnectedContent>
        <div style={{ padding: 12, fontFamily: 'system-ui' }}>
          <div style={{ margin: '8px 0' }}>
            <button onClick={() => sendControlOnClickMessage('action')}>Trigger "action"</button>{' '}
          </div>

          <Config />
        </div>
      </ConnectedContent>
    </Conditional>
  );
}
