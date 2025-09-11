import { TextField } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { NumberControlConfig } from '@extension/shared';

export default function NumberControl(controlConfig: NumberControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.valueAsNumber);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <TextField
          id={id}
          type="number"
          size="small"
          value={controlValue}
          onChange={onChangeHandler}
          slotProps={{
            htmlInput: {
              step: controlConfig.step,
              min: controlConfig.min,
              max: controlConfig.max,
            },
          }}
          sx={{ width: 150 }}
        />
      </ControlWithLabel>
    </ControlContainer>
  );
}
