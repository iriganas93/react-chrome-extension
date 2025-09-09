// import { useControl } from '@src/hooks/useControl';
import type { BooleanControlConfig } from '@extension/shared';

export default function BooleanControl(controlConfig: BooleanControlConfig) {
  // const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  //
  // const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   await handleControlChange(e.target.checked);
  // };

  return <div>Render for {controlConfig.id}</div>;
}
