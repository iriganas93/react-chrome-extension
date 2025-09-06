import type {
  AnyControlConfig,
  ButtonControlConfig,
  ButtonGroupControlConfig,
  ControlConfigWithValue,
  FolderConfig,
  TabConfig,
  TableControlConfig,
} from '../../types.js';

export const isFolder = (node: AnyControlConfig): node is FolderConfig => node.type === 'folder';

export const isTab = (node: AnyControlConfig): node is TabConfig => node.type === 'tab';

export const isButton = (node: AnyControlConfig): node is ButtonControlConfig => node.type === 'button';

export const isButtonGroup = (node: AnyControlConfig): node is ButtonGroupControlConfig => node.type === 'buttonGroup';

export const isTable = (node: AnyControlConfig): node is TableControlConfig<any> => node.type === 'table';

export const isWithValue = (node: AnyControlConfig): node is ControlConfigWithValue =>
  'value' in (node as any) && typeof (node as any).type === 'string';
