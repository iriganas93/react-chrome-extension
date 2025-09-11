import AutoControl from '@src/components/controls/autoControl';
import TabContent from '@src/components/tabs/components/tabContent';
import TabsNavigation from '@src/components/tabs/components/tabsNavigation';
import { getPageConfigTab } from '@src/configs';
import { useState } from 'react';
import type { DevToolsRootConfig } from '@extension/shared';

interface TabsProps {
  config: DevToolsRootConfig;
}

export default function Tabs({ config }: TabsProps) {
  const [value, setValue] = useState(0);
  const tabs = [getPageConfigTab(config), ...config.tabs];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <TabsNavigation tabs={tabs} value={value} onChange={handleChange} />
      {tabs.map((tabConfig, index) => (
        <TabContent value={value} index={index}>
          <AutoControl {...tabConfig} />
        </TabContent>
      ))}
    </>
  );
}
