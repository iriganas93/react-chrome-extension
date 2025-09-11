import { isFolder, isTab, isWithClickCallback, isWithValue, sendGameControlUpdateMessage } from '@extension/shared';
import type { AnyControlConfig, ControlValue } from '@extension/shared';

export class Control {
  _config: AnyControlConfig;
  _value?: ControlValue;
  id: string;

  constructor(public readonly config: AnyControlConfig) {
    this._config = config;
    this.id = config.id;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.update(value);
  }

  update(value?: ControlValue) {
    if (!isWithValue(this._config)) {
      console.warn(`Control ${this.id} does not have a value to update.`);
      return false;
    }

    if (value === null || value === undefined) {
      console.warn(`Control ${this.id} cannot be set to null or undefined.`);
      return false;
    }

    if (typeof value !== typeof this._config.value) {
      console.warn(
        `Control ${this.id} value type mismatch. Expected ${typeof this._config.value}, got ${typeof value}.`,
      );
      return false;
    }

    this._value = value;
    sendGameControlUpdateMessage(this.id, value);
    return true;
  }

  onChange(value: ControlValue) {
    if (isWithValue(this._config) && typeof this._config.onChange === 'function') {
      this._value = value;
      this._config.onChange?.(value);
      return;
    }

    console.warn(`Control ${this.id} does not have an onChange implementation.`);
  }

  onClick() {
    if (isWithClickCallback(this._config) && typeof this._config.onClick === 'function') {
      this._config.onClick?.();
      return;
    }
    console.warn(`Control ${this.id} does not have an onClick implementation.`);
  }
}

export const controls = new Map<string, Control>();

export const collectControls = (node: AnyControlConfig) => {
  controls.set(node.id, new Control(node));
  if (isFolder(node)) node.controls.forEach(collectControls);
  if (isTab(node)) node.controls.forEach(collectControls);
};
