import React, { useEffect } from 'react';
import { cn } from './cn';

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidthClassName = 'max-w-4xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col',
          maxWidthClassName,
          'max-h-[90vh]',
          'animate-modal-enter',
        )}
      >
        {(title || description) && (
          <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            {title && <div className="text-lg font-bold text-gray-900">{title}</div>}
            {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
          </div>
        )}

        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80">{footer}</div>}
      </div>
    </div>
  );
}
