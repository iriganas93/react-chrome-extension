export interface BaseControl {
  id: string;
  type: string;
  label?: string;
}

export interface WithValue<T> extends BaseControl {
  value: T;
  onChange?: (v: T) => void;
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
  buttons: { id: string; label: string; onClick?: () => void }[];
}

export interface TableControlConfig<T = never> extends BaseControl {
  type: 'table';
  columns: { key: keyof T; label: string; editable?: boolean }[];
  data: T[];
  onChange?: (newData: T[]) => void;
}

export interface JsonControlConfig extends BaseControl {
  type: 'json';
  value: unknown;
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

/** 🖼️ Renderable controls (no tabs) */

export type RenderableControl =
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
  | FolderConfig;

/** 🔎 Map type → full control spec */
export type SpecByType = {
  number: NumberControlConfig;
  boolean: BooleanControlConfig;
  text: TextControlConfig;
  color: ColorControlConfig;
  button: ButtonControlConfig;
  buttonGroup: ButtonGroupControlConfig;
  table: TableControlConfig<unknown>;
  json: JsonControlConfig;
  vector: VectorControlConfig;
  spine: SpineControlConfig;
  folder: FolderConfig;
};

export type AnyControlConfig = RenderableControl | TabConfig;

export interface DevToolsRootConfig {
  schemaVersion: number;
  tabs: TabConfig[];
  initialTab?: string;
}

/** 🔒 Discriminant union helper */
export type ControlType = RenderableControl['type'];
