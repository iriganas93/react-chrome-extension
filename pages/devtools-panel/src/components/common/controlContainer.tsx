import type { ReactNode } from 'react';

type ControlContainerProps = {
  children: ReactNode;
};

export const ControlContainer = ({ children }: ControlContainerProps) => (
  <div className="w-full border-b border-b-gray-200 px-4 py-4">{children}</div>
);
