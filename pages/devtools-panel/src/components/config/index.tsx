import { Conditional } from '@src/components/common/conditional';
import Tabs from '@src/components/tabs';
import { useConfig } from '@src/hooks/useConfig';

export default function Config() {
  const config = useConfig();

  return (
    <Conditional condition={!!config?.tabs} fallback={<div>Loading config...</div>}>
      <Tabs config={config} />
    </Conditional>
  );
}
