import React from 'react';
import { cn } from './cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'full';
};

export function Input({ className, size = 'md', rounded = 'md', ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500',
        'hover:border-gray-300 transition-all duration-150',
        rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md',
        size === 'sm' ? 'h-8 px-3 text-xs' : size === 'lg' ? 'h-12 px-4 text-base' : 'h-10 px-4 text-sm',
        className,
      )}
      {...props}
    />
  );
}
