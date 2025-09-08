import { toJsonValue } from './helpers.js';
import { DESTINATIONS, GAME_MESSAGES } from '../../const.js';
import { sendMessage } from 'webext-bridge/window';
import type { ControlValue, DevToolsRootConfig } from '../../types.js';

export const sendGameControlUpdateMessage = (controlId: string, value: ControlValue) => {
  sendMessage(
    GAME_MESSAGES.CONTROL_UPDATE,
    { controlId, value: toJsonValue(value) },
    DESTINATIONS.CONTENT_SCRIPT,
  ).catch(() => {});
};

export const sendGameRegisterConfigMessage = (config: DevToolsRootConfig) => {
  sendMessage(GAME_MESSAGES.REGISTER_CONFIG, { config: toJsonValue(config) }, DESTINATIONS.CONTENT_SCRIPT).catch(
    () => {},
  );
};

export const sendGamePageInitMessage = () => {
  sendMessage(
    GAME_MESSAGES.PAGE_INIT,
    {
      ready: true,
      href: location.href,
    },
    DESTINATIONS.CONTENT_SCRIPT,
  ).catch(() => {});
};
