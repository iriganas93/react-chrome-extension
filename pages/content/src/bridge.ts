// pages/content/bridge.ts
import { allowWindowMessaging, onMessage, sendMessage } from 'webext-bridge/content-script';

const NAMESPACE = 'com.allwyn.devtools';
allowWindowMessaging(NAMESPACE);

console.log('[CEB] Bridge content script loaded');

// DevTools -> Page
onMessage('devtools:ping', async ({ data }) => {
  const res = await sendMessage('ext:ping', data, 'window');
  await sendMessage('page:reply', { got: res }, 'devtools').catch(() => {});
});

// Page -> DevTools (init)
onMessage('page:init', async ({ data }) => {
  // devtools may not be open yet; ignore errors
  await sendMessage('page:init', data, 'devtools').catch(() => {});
});
