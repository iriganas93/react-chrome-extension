import type { BaseControl } from '@extension/shared';
import type { ReactNode } from 'react';

type ControlContainerProps = {
  children: ReactNode;
  config: BaseControl;
};

export const ControlWithLabelCol = ({ children, config }: ControlContainerProps) => {
  const { id, label } = config;
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xs font-semibold">{label || id}:</span>
      {children}
    </div>
  );
};
