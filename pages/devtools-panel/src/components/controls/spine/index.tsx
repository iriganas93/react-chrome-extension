import '@esotericsoftware/spine-player/dist/spine-player.min.css';
import { SpinePlayer } from '@esotericsoftware/spine-player';
import { ControlContainer } from '@src/components/common/controlContainer';
import { ControlWithLabelCol } from '@src/components/common/controlWithLabelCol';
import { useResource } from '@src/hooks/useResources';
import { useEffect } from 'react';
import type { SpinePlayerConfig } from '@esotericsoftware/spine-player';
import type { SpineControlConfig } from '@extension/shared';

export default function SpineControl(controlConfig: SpineControlConfig) {
  const { skeleton, atlas } = controlConfig.value;
  const spineId = `spine-container-${controlConfig.id}`;
  const skeletonResource = useResource(skeleton);
  const atlasResource = useResource(atlas);

  useEffect(() => {
    if (!skeletonResource?.url || !atlasResource?.url) return;
    new SpinePlayer(spineId, {
      skeleton: skeletonResource.url,
      atlas: atlasResource.url,
      scale: 1,
    } as unknown as SpinePlayerConfig);
  }, [spineId, skeletonResource?.url, atlasResource?.url]);

  return (
    <ControlContainer>
      <ControlWithLabelCol config={controlConfig}>
        <div id={spineId} className="overflow-hidden rounded-md"></div>
      </ControlWithLabelCol>
    </ControlContainer>
  );
}
