import type { BaseControl } from '@extension/shared';
import type { ReactNode } from 'react';

type ControlContainerProps = {
  children: ReactNode;
  config: BaseControl;
};

export const ControlWithLabel = ({ children, config }: ControlContainerProps) => {
  const { id, label } = config;
  return (
    <div className="flex w-full items-center justify-between">
      <label htmlFor={id} className="pr-2">
        {label ?? id}
      </label>
      {children}
    </div>
  );
};
