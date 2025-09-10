import AutoControl from '@src/components/controls/autoControl';
import type { TabConfig } from '@extension/shared';

export default function TabContent(config: TabConfig) {
  return (
    <div id={`tab-content-${config.id}`}>
      <h2>{config.title}</h2>
      {config.controls.map((controlConfig, index) => (
        <AutoControl key={`${config.id}-control-${index}`} {...controlConfig} />
      ))}
    </div>
  );
}
