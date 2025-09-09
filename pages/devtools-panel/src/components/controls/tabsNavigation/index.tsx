import type { TabConfig } from '@extension/shared';

export interface TabsNavigationProps {
  tabs: TabConfig[];
}

export default function TabsNavigation({ tabs }: TabsNavigationProps) {
  if (!tabs || tabs.length === 0) return <></>;
  return (
    <div>
      {tabs.map((tabConfig, index) => (
        <div key={index}>{tabConfig.title}</div>
      ))}
    </div>
  );
}
