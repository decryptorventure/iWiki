import React, { useEffect } from 'react';
import { cn } from './cn';
import { X } from 'lucide-react';

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
  maxWidthClassName = 'max-w-2xl',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full rounded-lg bg-white shadow-xl overflow-hidden flex flex-col',
          maxWidthClassName,
          'max-h-[90vh]'
        )}
      >
        {(title || description) && (
          <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
            <div>
              {title && <div className="text-base font-bold text-gray-900 leading-none">{title}</div>}
              {description && <div className="text-xs text-gray-400 mt-1.5 font-medium">{description}</div>}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto no-scrollbar">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
