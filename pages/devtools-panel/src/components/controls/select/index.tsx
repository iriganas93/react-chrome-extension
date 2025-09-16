import { Autocomplete, TextField } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import type { SelectControlConfig } from '@extension/shared';
import type { SyntheticEvent } from 'react';

export default function SelectControl(controlConfig: SelectControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig);
  const { id, data } = controlConfig;

  const onChangeHandler = async (e: SyntheticEvent<Element, Event>, value: string) => {
    await handleControlChange(value);
  };

  return (
    <ControlContainer>
      <ControlWithLabel config={controlConfig}>
        <Autocomplete
          disablePortal
          autoSelect={true}
          defaultValue={controlValue as string}
          options={data}
          sx={{ width: 150 }}
          onInputChange={onChangeHandler}
          renderInput={params => <TextField {...params} id={id} size="small" />}
        />
      </ControlWithLabel>
    </ControlContainer>
  );
}
