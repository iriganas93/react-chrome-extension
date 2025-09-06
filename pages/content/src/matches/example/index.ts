// pages/content/matches/example/index.ts  (page context)
import { setNamespace, onMessage, sendMessage } from 'webext-bridge/window';

const NAMESPACE = 'com.allwyn.devtools';
setNamespace(NAMESPACE);

onMessage('ext:ping', ({ data }) => ({ pong: true, href: location.href, time: data?.time }));

window.__TEST = 'Hello from example/index.ts';
// console.log('Accessing window', window.__TEST);

// send to content-script (always present), not devtools
setTimeout(() => {
  sendMessage('page:init', { ready: true, href: location.href }, 'content-script').catch(() => {
    /* ignore if tab is in an odd state */
  });
}, 0);
