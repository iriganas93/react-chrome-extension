import { ControlContainer } from '@src/components/common/controlContainer';
import { sendControlOnClickMessage } from '@src/devtools-messages';
import type { ButtonControlConfig } from '@extension/shared';

export default function ButtonControl(controlConfig: ButtonControlConfig) {
  const { id, label } = controlConfig;

  return (
    <ControlContainer>
      <div className="button-container flex justify-center">
        <button
          className="bg-accent rounded-md px-4 py-2 font-semibold text-white"
          onClick={() => sendControlOnClickMessage(id)}>
          {label ?? id}
        </button>
      </div>
    </ControlContainer>
  );
}
