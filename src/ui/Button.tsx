import React from 'react';
import { cn } from './cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold ' +
  'transition-all duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'active:scale-[0.98]';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm transition-colors',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
