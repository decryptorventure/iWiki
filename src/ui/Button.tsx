import React from 'react';
import { cn } from './cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-all duration-200 ease-out ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A]/30 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'active:scale-[0.97]';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white hover:from-[#e55a2b] hover:to-[#FF6B4A] shadow-md hover:shadow-lg hover:shadow-[#FF6B4A]/20',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md hover:border-gray-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-black/5 hover:text-gray-900',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-md hover:shadow-lg hover:shadow-red-500/20',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
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
