import type { DevToolsRootConfig, TabConfig } from '@extension/shared';

export const getPageConfigTab = (config: DevToolsRootConfig) =>
  ({
    id: 'page-config-tab',
    type: 'tab',
    title: 'Config',
    controls: [{ id: 'page-config-json', label: 'Game Config', type: 'json', value: config }],
  }) as TabConfig;
