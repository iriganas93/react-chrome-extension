import BooleanControl from '@src/components/controls/boolean';
import ButtonControl from '@src/components/controls/button';
import ButtonGroupControl from '@src/components/controls/ButtonGroup';
import ColorControl from '@src/components/controls/color';
import Folder from '@src/components/controls/folder';
import JsonControl from '@src/components/controls/json';
import NumberControl from '@src/components/controls/number';
import RadioControl from '@src/components/controls/radio';
import SelectControl from '@src/components/controls/select';
import SpineControl from '@src/components/controls/spine';
import TabContent from '@src/components/controls/tabContent';
import TableControl from '@src/components/controls/table';
import TextControl from '@src/components/controls/text';
import VectorControl from '@src/components/vector';
import type { ControlComponent, ControlComponentsMap, ControlType, ControlConfigByType } from '@extension/shared';

const COMPONENT_MAP: ControlComponentsMap = {
  number: NumberControl,
  text: TextControl,
  boolean: BooleanControl,
  color: ColorControl,
  button: ButtonControl,
  buttonGroup: ButtonGroupControl,
  table: TableControl,
  json: JsonControl,
  vector: VectorControl,
  spine: SpineControl,
  select: SelectControl,
  radio: RadioControl,
  folder: Folder,
  tab: TabContent,
};

export default function AutoControl<C extends ControlType>(controlConfig: ControlConfigByType[C]) {
  const ControlComponent = COMPONENT_MAP?.[controlConfig.type] as ControlComponent<C> | undefined;
  if (!ControlComponent) {
    return <div>Unsupported control type: {controlConfig.type}</div>;
  }
  return <ControlComponent {...controlConfig} />;
}
