import { FormControlLabel, Switch } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { BooleanControlConfig } from '@extension/shared';

export default function BooleanControl(controlConfig: BooleanControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig); // to register the control and handle updates
  const { id, label } = controlConfig;

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(e.target.checked);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <FormControlLabel
          label={label ?? id}
          control={
            <Switch
              size="small"
              checked={controlValue}
              onChange={onChangeHandler}
              slotProps={{ input: { 'aria-label': 'controlled' } }}
            />
          }
        />
      </ControlWithLabel>
    </ControlContainer>
  );
}
