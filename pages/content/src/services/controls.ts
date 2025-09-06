import { isFolder, isTab } from '@extension/shared';
import type { AnyControlConfig } from '@extension/shared';

export const controls = new Map<string, AnyControlConfig>();

export const collectControls = (node: AnyControlConfig) => {
  controls.set(node.id, node);
  if (isFolder(node)) node.controls.forEach(collectControls);
  if (isTab(node)) node.controls.forEach(collectControls);
};
