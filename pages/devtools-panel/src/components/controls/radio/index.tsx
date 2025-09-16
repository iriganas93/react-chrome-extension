// import { useControl } from '@src/hooks/useControl';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { RadioControlConfig } from '@extension/shared';
import type { ChangeEvent } from 'react';

export default function RadioControl(controlConfig: RadioControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig);
  const { id, data } = controlConfig;

  const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleControlChange(event.target.value);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <RadioGroup id={id} row name="row-radio-buttons-group" onChange={onChangeHandler}>
          {data.map(option => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
              checked={controlValue === option}
            />
          ))}
        </RadioGroup>
      </ControlWithLabel>
    </ControlContainer>
  );
}
