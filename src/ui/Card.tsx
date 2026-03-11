import React from 'react';
import { cn } from './cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'soft' | 'glossy';
};

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-white transition-all duration-300',
        variant === 'default' && 'border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300/80',
        variant === 'soft' && 'border-gray-100 bg-gray-50/60 shadow-sm hover:shadow-md',
        variant === 'glossy' && 'border-white/30 bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-xl',
        className,
      )}
      {...props}
    />
  );
}
