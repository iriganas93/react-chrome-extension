import { useControl } from '@src/hooks/useControl';
import type { NumberControlConfig } from '@extension/shared';

export default function NumberControl(controlConfig: NumberControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id, label } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.valueAsNumber);
  };

  return (
    <div>
      <label htmlFor={id}>{label ?? id}</label>
      <input
        id={id}
        name={`control-${id}`}
        type="number"
        step={controlConfig.step}
        min={controlConfig.min}
        max={controlConfig.max}
        value={controlValue}
        onChange={onChangeHandler}
      />
    </div>
  );
}
