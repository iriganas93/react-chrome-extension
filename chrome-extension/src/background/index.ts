import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { onMessage } from 'webext-bridge/background';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

onMessage('bg:echo', async ({ data }) => data);

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
