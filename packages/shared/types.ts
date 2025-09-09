import type { JSX } from 'react';

export interface BaseControl {
  id: string;
  type: string;
  label?: string;
}

export interface WithValue<T> extends BaseControl {
  value: T;
  onChange?: (v: T) => void;
  update?: (v: T) => void;
}

export interface NumberControlConfig extends WithValue<number> {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanControlConfig extends WithValue<boolean> {
  type: 'boolean';
}

export interface TextControlConfig extends WithValue<string> {
  type: 'text';
}

export interface ColorControlConfig extends WithValue<string> {
  type: 'color';
}

export interface ButtonControlConfig extends BaseControl {
  type: 'button';
  onClick?: () => void; // optional on extension side
}

export interface ButtonGroupControlConfig extends BaseControl {
  type: 'buttonGroup';
  buttons: ButtonControlConfig[];
}

export interface TableControlConfig<T = object> extends BaseControl {
  type: 'table';
  columns: { key: keyof T; label: string }[];
  data: T[];
  onChange?: (newData: T[]) => void;
}

export interface JsonControlConfig extends WithValue<object> {
  type: 'json';
}

export interface Vector {
  x: number;
  y: number;
}

export interface VectorControlConfig extends WithValue<Vector> {
  type: 'vector';
}

export interface SpineControlConfig extends BaseControl {
  type: 'spine';
  skeleton: string;
  atlas: string;
}

export interface FolderConfig extends BaseControl {
  type: 'folder';
  controls: AnyControlConfig[];
}

export interface TabConfig extends BaseControl {
  type: 'tab';
  title: string;
  controls: AnyControlConfig[];
}

export type ControlConfigWithValue =
  | NumberControlConfig
  | BooleanControlConfig
  | TextControlConfig
  | ColorControlConfig
  | JsonControlConfig
  | VectorControlConfig;

export type ControlValue = ControlConfigWithValue['value'];

export type AugmentedControl = ControlConfigWithValue & {
  __isProxied?: boolean;
  __proxyRef?: AugmentedControl;
  onChange: (v: ControlValue) => void;
  update: (v: ControlValue) => void;
};

export type AnyControlConfig =
  | NumberControlConfig
  | BooleanControlConfig
  | TextControlConfig
  | ColorControlConfig
  | ButtonControlConfig
  | ButtonGroupControlConfig
  | TableControlConfig<unknown>
  | JsonControlConfig
  | VectorControlConfig
  | SpineControlConfig
  | FolderConfig
  | TabConfig;

export type ControlType = AnyControlConfig['type'];

export type ControlConfigByType = {
  number: NumberControlConfig;
  boolean: BooleanControlConfig;
  text: TextControlConfig;
  color: ColorControlConfig;
  button: ButtonControlConfig;
  buttonGroup: ButtonGroupControlConfig;
  table: TableControlConfig;
  json: JsonControlConfig;
  vector: VectorControlConfig;
  spine: SpineControlConfig;
  folder: FolderConfig;
  tab: TabConfig;
};

export interface DevToolsRootConfig {
  schemaVersion: number;
  tabs: TabConfig[];
  initialTab?: string;
}

export type ControlsChangePayload = {
  controlId: string;
  value: ControlValue;
};

export type ControlClickPayload = {
  controlId: string;
  buttonId?: string;
};

export type ControlUpdatePayload = {
  controlId: string;
  value: ControlValue;
};

export type PageInitPayload = {
  ready: boolean;
  href: string;
};

export type RegisterConfigPayload = {
  config: DevToolsRootConfig;
};

export type ControlComponentsMap = {
  [K in ControlType]: (props: ControlConfigByType[K]) => JSX.Element;
};

export type ControlComponent<T extends ControlType> = (props: ControlConfigByType[T]) => JSX.Element;
