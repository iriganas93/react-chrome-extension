import { useControl } from '@src/hooks/useControl';
import type { TextControlConfig } from '@extension/shared';

export default function TextControl(controlConfig: TextControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id, label } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={id}>{label ?? id}</label>
      <input id={id} type="text" name={`control-${id}`} value={controlValue} onChange={onChangeHandler} />
    </div>
  );
}
