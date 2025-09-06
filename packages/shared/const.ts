export const PROJECT_URL_OBJECT = {
  url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite',
} as const;

export const GAME_MESSAGES = {
  REGISTER_CONFIG: 'game:register-config',
  PAGE_INIT: 'game:page-init',
  CONTROL_UPDATE: 'game:control-update',
} as const;

export const DEV_TOOLS_MESSAGES = {
  REQUEST_CONFIG: 'devtools:request-config',
  CONTROL_CHANGE: 'devtools:control-change',
  CONTROL_TRIGGER: 'devtools:control-trigger',
  POKE: 'devtools:poke',
} as const;

export const DESTINATIONS = {
  CONTENT_SCRIPT: 'content-script',
  DEVTOOLS: 'devtools',
  WINDOW: 'window',
} as const;

export const NAMESPACE = 'com.allwyn.devtools';

export type Destination = (typeof DESTINATIONS)[keyof typeof DESTINATIONS];

export type GameMessage = (typeof GAME_MESSAGES)[keyof typeof GAME_MESSAGES];

export type DevToolsMessage = (typeof DEV_TOOLS_MESSAGES)[keyof typeof DEV_TOOLS_MESSAGES];
