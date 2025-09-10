import type { ReactNode } from 'react';

type ConditionalProps = {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export const Conditional = ({ condition, children, fallback }: ConditionalProps) => {
  if (condition) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : <></>;
};
