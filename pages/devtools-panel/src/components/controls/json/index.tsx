// import { useControl } from '@src/hooks/useControl';
import type { JsonControlConfig } from '@extension/shared';

export default function JsonControl(controlConfig: JsonControlConfig) {
  // const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  //
  // const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   await handleControlChange(e.target.value);
  // };

  return <div>Render for {controlConfig.label}</div>;
}
