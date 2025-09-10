import AutoControl from '@src/components/controls/autoControl';
import TabsNavigation from '@src/components/controls/tabsNavigation';
import { useConfig } from '@src/hooks/useConfig';

export default function Config() {
  const config = useConfig();
  if (!config?.tabs) return <div>Loading config...</div>;

  return (
    <>
      <TabsNavigation tabs={config.tabs} />
      {config.tabs.map(tabConfig => (
        <AutoControl {...tabConfig} />
      ))}
      <details open>
        <summary>Config</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(config, null, 2)}</pre>
      </details>
    </>
  );
}
