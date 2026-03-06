import React from 'react';
import { cn } from './cn';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md';
  rounded?: 'md' | 'lg' | 'full';
};

export function IconButton({ className, rounded = 'md', size = 'md', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-orange-500/10',
        'active:scale-95 text-gray-400 hover:text-gray-700 hover:bg-gray-100',
        rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        className,
      )}
      {...props}
    />
  );
}
