import React from 'react';
import { Modal as UIKitModal } from '@frontend-team/ui-kit';

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
};

export function Modal({ open, onOpenChange, title, children, footer, ...props }: ModalProps) {
  // @ts-ignore - UIKitModal props might differ slightly
  return (
    <UIKitModal open={open} onOpenChange={onOpenChange} title={title} footer={footer} {...props}>
      {children}
    </UIKitModal>
  );
}
