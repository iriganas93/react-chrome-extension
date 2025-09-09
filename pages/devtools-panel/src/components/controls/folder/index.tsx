import AutoControl from '@src/components/autoControl';
import type { FolderConfig } from '@extension/shared';

export default function Folder(config: FolderConfig) {
  return (
    <div id={`folder-${config.id}`}>
      <h2>{config.label}</h2>
      {config.controls.map((controlConfig, index) => (
        <AutoControl key={`${config.id}-control-${index}`} {...controlConfig} />
      ))}
    </div>
  );
}
