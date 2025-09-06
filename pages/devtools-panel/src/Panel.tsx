import '@src/Panel.css';
import { t } from '@extension/i18n';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn, ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { useEffect, useState } from 'react';
import { sendMessage, onMessage } from 'webext-bridge/devtools';
import type { ComponentPropsWithoutRef } from 'react';

const Panel = () => {
  const [reply, setReply] = useState<string>('');
  const { isLight } = useStorage(exampleThemeStorage);
  const logo = isLight ? 'devtools-panel/logo_horizontal.svg' : 'devtools-panel/logo_horizontal_dark.svg';

  useEffect(() => {
    const off1 = onMessage('page:reply', ({ data }) => setReply(JSON.stringify(data)));
    const off2 = onMessage('page:init', ({ data }) => setReply(`INIT ${JSON.stringify(data)}`));
    return () => {
      off1();
      off2();
    };
  }, []);

  const pingPage = async () => {
    // You can send to 'content-script' or directly 'window' (see note below)
    await sendMessage('devtools:ping', { time: Date.now() }, 'content-script');
  };

  return (
    <div className={cn('App', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
      <header className={cn('App-header', isLight ? 'text-gray-900' : 'text-gray-100')}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        <p>
          Edit me at <code>pages/devtools-panel/src/Panel.tsx</code>
        </p>
        <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
        <button onClick={pingPage}>Ping inspected page</button>
        <pre>{reply}</pre>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const { isLight } = useStorage(exampleThemeStorage);

  return (
    <button
      className={cn(
        props.className,
        'mt-4 rounded px-4 py-1 font-bold shadow hover:scale-105',
        isLight ? 'bg-white text-black' : 'bg-black text-white',
      )}
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Panel, <LoadingSpinner />), ErrorDisplay);
