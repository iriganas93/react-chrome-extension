import { useControl } from '@src/hooks/useControl';
import type { BooleanControlConfig } from '@extension/shared';

export default function BooleanControl(controlConfig: BooleanControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id, label } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.checked);
  };

  return (
    <div>
      <input type="checkbox" id={id} name={`control-${id}`} checked={controlValue} onChange={onChangeHandler} />
      <label htmlFor={id}>{label ?? id}</label>
    </div>
  );
}
