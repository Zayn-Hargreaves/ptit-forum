'use client';

import { ReactNode } from 'react';
import { useMeasure } from 'react-use';

interface PdfWrapperProps {
  children: (width: number) => ReactNode;
  className?: string;
}

export const PdfWrapper = ({ children, className }: PdfWrapperProps) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      {width > 0 ? children(width) : <div className="bg-muted/20 h-96 w-full animate-pulse" />}
    </div>
  );
};
