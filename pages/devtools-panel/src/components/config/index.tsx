import Tabs from '@src/components/tabs';
import { useConfig } from '@src/hooks/useConfig';

export default function Config() {
  const config = useConfig();

  if (!config?.tabs) return <div>Loading config...</div>;

  return (
    <>
      <Tabs config={config} />
    </>
  );
}
