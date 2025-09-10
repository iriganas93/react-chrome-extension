import type {
  AnyControlConfig,
  ButtonControlConfig,
  ButtonGroupControlConfig,
  AugmentedControl,
  FolderConfig,
  TabConfig,
} from '../../types.js';

export const isFolder = (node: AnyControlConfig): node is FolderConfig => node.type === 'folder';

export const isTab = (node: AnyControlConfig): node is TabConfig => node.type === 'tab';

export const isButton = (node: AnyControlConfig): node is ButtonControlConfig => node.type === 'button';

export const isButtonGroup = (node: AnyControlConfig): node is ButtonGroupControlConfig => node.type === 'buttonGroup';

export const isWithValue = (node: AnyControlConfig): node is AugmentedControl => 'value' in node;

export const isWithClickCallback = (node: AnyControlConfig): node is ButtonControlConfig => 'onClick' in node;
