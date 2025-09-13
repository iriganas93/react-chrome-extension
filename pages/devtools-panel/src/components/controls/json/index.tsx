import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabelCol } from '@src/components/common/controlWithLabelCol';
import type { JsonControlConfig } from '@extension/shared';

export default function JsonControl(controlConfig: JsonControlConfig) {
  return (
    <ControlContainer>
      <ControlWithLabelCol config={controlConfig}>
        <pre className="json-viewer">{JSON.stringify(controlConfig.value, null, 2)}</pre>
      </ControlWithLabelCol>
    </ControlContainer>
  );
}
