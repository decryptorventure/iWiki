import React from 'react';
import { cn } from './cn';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md';
};

export function IconButton({ className, size = 'md', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-bg-accent-primary-subtle)]',
        'active:scale-90',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
        className,
      )}
      {...props}
    />
  );
}
