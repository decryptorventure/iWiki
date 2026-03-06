import React from 'react';
import { cn } from './cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'soft';
};

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all duration-200',
        variant === 'default' && 'border-gray-200 shadow-sm hover:border-gray-300',
        variant === 'soft' && 'border-gray-100 bg-gray-50 hover:border-gray-200',
        className,
      )}
      {...props}
    />
  );
}
