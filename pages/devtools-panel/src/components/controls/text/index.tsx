import { TextField } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { TextControlConfig } from '@extension/shared';

export default function TextControl(controlConfig: TextControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.value);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <TextField id={id} size="small" value={controlValue ?? ''} onChange={onChangeHandler} />
      </ControlWithLabel>
    </ControlContainer>
  );
}
