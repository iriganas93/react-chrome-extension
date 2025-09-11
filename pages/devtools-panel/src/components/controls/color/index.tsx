import { TextField } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { ColorControlConfig } from '@extension/shared';

export default function ColorControl(controlConfig: ColorControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.value);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <TextField
          id={id}
          type="color"
          size="small"
          value={controlValue}
          onChange={onChangeHandler}
          sx={{ width: 150 }}
        />
      </ControlWithLabel>
    </ControlContainer>
  );
}
