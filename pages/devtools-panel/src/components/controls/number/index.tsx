import { TextField } from '@mui/material';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabel } from '@src/components/common/controlWithLabel';
import { useControl } from '@src/hooks/useControl';
import { useNumberScrub } from '@src/hooks/useNumberScrub';
import type { NumberControlConfig } from '@extension/shared';
import type * as React from 'react';

export default function NumberControl(controlConfig: NumberControlConfig) {
  const { controlValue, handleControlChange } = useControl(controlConfig);
  const { id, min, max, step } = controlConfig;

  const { inputRef, inputHandlers } = useNumberScrub({
    value: Number(controlValue ?? 0),
    onChange: handleControlChange,
    step,
    min,
    max,
    pixelsForFullRange: 20, // adjust to taste (higher = slower)
    cursor: 'ew-resize',
    wheel: 'shift', // wheel nudging only with Shift
    blurOnStart: true, // prevent the input from staying focused
  });

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
          value={controlValue ?? ''}
          onChange={onChangeHandler}
          inputRef={inputRef}
          // attach handlers to the actual input element
          slotProps={{
            htmlInput: {
              ...inputHandlers, // onPointerDown, onWheel
              step,
              min,
              max,
              inputMode: 'numeric',
            },
          }}
          sx={{
            width: 150,
            // keep cursor default when idle; scrub hook sets ew-resize during drag
            '& input': { cursor: 'ew-resize' },
          }}
        />
      </ControlWithLabel>
    </ControlContainer>
  );
}
