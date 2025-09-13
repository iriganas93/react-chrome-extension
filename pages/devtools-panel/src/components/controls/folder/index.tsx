import AutoControl from '@src/components/controls/autoControl';
import type { FolderConfig } from '@extension/shared';

export default function Folder(config: FolderConfig) {
  return (
    <details id={`folder-${config.id}`} className="folder" open>
      <summary>{config.label ?? config.id}</summary>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {config.controls.map((controlConfig, index) => (
          <AutoControl key={`${config.id}-control-${index}`} {...controlConfig} />
        ))}
      </pre>
    </details>
  );
}
