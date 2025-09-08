import { DESTINATIONS, DEV_TOOLS_MESSAGES } from '../../const.js';
import { sendMessage } from 'webext-bridge/devtools';

export const sendControlOnChangeMessage = async (controlId: string, value: unknown) => {
  await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, { controlId, value }, DESTINATIONS.CONTENT_SCRIPT);
};

export const sendControlOnClickMessage = async (controlId: string, buttonId?: string) => {
  await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, { controlId, buttonId }, DESTINATIONS.CONTENT_SCRIPT);
};
