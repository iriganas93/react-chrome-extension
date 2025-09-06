import { NAMESPACE, DEV_TOOLS_MESSAGES, GAME_MESSAGES, DESTINATIONS } from '../../../../packages/shared';
import { allowWindowMessaging, onMessage, sendMessage } from 'webext-bridge/content-script';

allowWindowMessaging(NAMESPACE);

console.log('[CEB] Bridge content script loaded');

// DevTools ➜ Page (request/response)
onMessage(
  DEV_TOOLS_MESSAGES.REQUEST_CONFIG,
  async ({ data }) =>
    await sendMessage(DEV_TOOLS_MESSAGES.REQUEST_CONFIG, data ?? {}, DESTINATIONS.WINDOW).catch(() => null), // returned value is sent back to devtools
);

// DevTools ➜ Page (fire-and-forget)
onMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, async ({ data }) => {
  await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_CHANGE, data ?? {}, DESTINATIONS.WINDOW).catch(() => {});
});

onMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, async ({ data }) => {
  await sendMessage(DEV_TOOLS_MESSAGES.CONTROL_TRIGGER, data ?? {}, DESTINATIONS.WINDOW).catch(() => {});
});

onMessage(DEV_TOOLS_MESSAGES.POKE, async ({ data }) => {
  await sendMessage(DEV_TOOLS_MESSAGES.POKE, data ?? {}, DESTINATIONS.WINDOW).catch(() => {});
});

// Page ➜ DevTools (pushes; devtools may not be open)
onMessage(GAME_MESSAGES.REGISTER_CONFIG, async ({ data }) => {
  await sendMessage(GAME_MESSAGES.REGISTER_CONFIG, data ?? {}, DESTINATIONS.DEVTOOLS).catch(() => {});
});

onMessage(GAME_MESSAGES.CONTROL_UPDATE, async ({ data }) => {
  await sendMessage(GAME_MESSAGES.CONTROL_UPDATE, data ?? {}, DESTINATIONS.DEVTOOLS).catch(() => {});
});

onMessage(GAME_MESSAGES.PAGE_INIT, async ({ data }) => {
  await sendMessage(GAME_MESSAGES.PAGE_INIT, data ?? {}, DESTINATIONS.DEVTOOLS).catch(() => {});
});
