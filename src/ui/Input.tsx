import React from 'react';
import { cn } from './cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'lg' | 'xl' | 'full';
};

export function Input({ className, size = 'md', rounded = 'xl', ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A]',
        'hover:border-gray-300',
        'transition-all duration-200',
        rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-xl',
        size === 'sm' ? 'h-9 px-3 text-sm' : size === 'lg' ? 'h-12 px-4 text-base' : 'h-10 px-4 text-sm',
        className,
      )}
      {...props}
    />
  );
}
