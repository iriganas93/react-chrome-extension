import { Tab, Tabs } from '@mui/material';
import { a11yProps } from '@src/utils/components';
import type { TabConfig } from '../../../../../../../packages/shared/index.mjs';

export interface TabsNavigationProps {
  tabs: TabConfig[];
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function TabsNavigation({ tabs, value, onChange }: TabsNavigationProps) {
  if (!tabs || tabs.length === 0) return <></>;
  return (
    <Tabs value={value} onChange={onChange}>
      {tabs.map((tabConfig, index) => (
        <Tab label={tabConfig.title} {...a11yProps(index)} />
      ))}
    </Tabs>
  );
}
