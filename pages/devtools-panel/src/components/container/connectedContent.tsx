import { useRequestConfig } from '@src/hooks/useRequestConfig';
import type { ReactNode } from 'react';

type ConnectedContentProps = {
  children: ReactNode;
};

export const ConnectedContent = ({ children }: ConnectedContentProps) => {
  useRequestConfig();
  return <>{children}</>;
};
