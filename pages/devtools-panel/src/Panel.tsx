import { DEV_TOOLS_MESSAGES, GAME_MESSAGES, DESTINATIONS } from '@extension/shared';
import { useEffect, useState } from 'react';
import { onMessage, sendMessage } from 'webext-bridge/devtools';

type Control =
  | { id: string; type: 'number' | 'boolean' | 'color' | 'json'; value?: any; label?: string }
  | { id: string; type: 'button'; label?: string }
  | { id: string; type: 'table'; columns: any[]; data: any[] }
  | { id: string; type: 'folder' | 'tab'; label?: string; controls: Control[] };

type DevToolsRootConfig = { schemaVersion: number; tabs: Control[] };

export default function Panel() {
  const [config, setConfig] = useState<DevToolsRootConfig | null>(null);
  const [log, setLog] = useState<string>('');

  useEffect(() => {
    // page -> panel pushes
    const offCfg = onMessage(GAME_MESSAGES.REGISTER_CONFIG, ({ data }) => {
      const cfg = (data as any)?.config as DevToolsRootConfig | undefined;
      if (cfg) setConfig(cfg);
      setLog(l => l + '\n[CONFIG] ' + (cfg ? 'received' : 'invalid'));
    });
    const offUpd = onMessage(GAME_MESSAGES.CONTROL_UPDATE, ({ data }) => {
      // data is { controlId, value }
      setLog(l => l + '\n[UPDATE] ' + JSON.stringify(data));
    });

    // pull current config on mount
    (async () => {
      try {
        const res = await sendMessage<{ config: DevToolsRootConfig | null }>(
          DEV_TOOLS_MESSAGES.REQUEST_CONFIG,
          {},
          DESTINATIONS.CONTENT_SCRIPT,
        );
        if (res?.config) {
          setConfig(res.config);
          setLog(l => l + '\n[CONFIG] pulled on mount');
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      offCfg();
      offUpd();
    };
  }, []);

  // Send changes to the page adapter
  const setControl = async (controlId: string, value: any) => {
    await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, { controlId, value }, DESTINATIONS.CONTENT_SCRIPT);
  };
  const triggerControl = async (controlId: string, buttonId?: string) => {
    await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, { controlId, buttonId }, DESTINATIONS.CONTENT_SCRIPT);
  };

  return (
    <div style={{ padding: 12, fontFamily: 'system-ui' }}>
      <h3>Allwyn DevTools</h3>

      <div style={{ margin: '8px 0' }}>
        <button onClick={() => setControl('music', 7)}>Set speed = 7</button>{' '}
        <button onClick={() => triggerControl('action')}>Trigger "action"</button>{' '}
        <button onClick={() => setControl('config-json', { foo: 'baz', nested: { x: 2 } })}>Update JSON</button>
      </div>

      <details open>
        <summary>Config</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(config, null, 2)}</pre>
      </details>

      <details>
        <summary>Log</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{log}</pre>
      </details>
    </div>
  );
}
