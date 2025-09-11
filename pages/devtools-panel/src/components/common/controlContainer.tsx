import type { ReactNode } from 'react';

type ControlContainerProps = {
  children: ReactNode;
};

export const ControlContainer = ({ children }: ControlContainerProps) => <div className="w-full py-2">{children}</div>;
