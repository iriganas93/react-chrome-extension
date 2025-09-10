import Config from '@src/components/config';
import { sendControlOnChangeMessage, sendControlOnClickMessage } from '@src/devtools-messages';
import { useGameListeners } from '@src/hooks/useGameListeners';
import { usePageConnection } from '@src/hooks/usePageConnection';

export default function Panel() {
  useGameListeners();
  const connection = usePageConnection();
  if (!connection || !connection.ready) {
    return <h3>Connecting</h3>;
  }
  console.log('Ready', connection);
  return (
    <div style={{ padding: 12, fontFamily: 'system-ui' }}>
      <h3>Allwyn DevTools</h3>

      <div style={{ margin: '8px 0' }}>
        <button onClick={() => sendControlOnChangeMessage('music', 7)}>Set speed = 7</button>{' '}
        <button onClick={() => sendControlOnClickMessage('action')}>Trigger "action"</button>{' '}
        <button onClick={() => sendControlOnChangeMessage('config-json', { foo: 'baz', nested: { x: 2 } })}>
          Update JSON
        </button>
      </div>

      <Config />
    </div>
  );
}
