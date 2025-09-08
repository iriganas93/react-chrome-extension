import { DESTINATIONS, DEV_TOOLS_MESSAGES, toJsonValue } from '@extension/shared';
import { sendMessage } from 'webext-bridge/devtools';

export const sendControlOnChangeMessage = async (controlId: string, value: unknown) => {
  await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, toJsonValue({ controlId, value }), DESTINATIONS.CONTENT_SCRIPT);
};

export const sendControlOnClickMessage = async (controlId: string, buttonId?: string) => {
  await sendMessage(
    DEV_TOOLS_MESSAGES.CONTROL_TRIGGER,
    toJsonValue({ controlId, buttonId }),
    DESTINATIONS.CONTENT_SCRIPT,
  );
};
