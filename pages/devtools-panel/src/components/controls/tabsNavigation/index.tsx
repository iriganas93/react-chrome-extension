import { Tab, Tabs } from '@mui/material';
import type { TabConfig } from '@extension/shared';

export interface TabsNavigationProps {
  tabs: TabConfig[];
}

export default function TabsNavigation({ tabs }: TabsNavigationProps) {
  if (!tabs || tabs.length === 0) return <></>;
  return (
    <Tabs>
      {tabs.map((tabConfig, index) => (
        <Tab key={`tab-nav-${index}`} label={tabConfig.title} />
      ))}
    </Tabs>
  );
}
