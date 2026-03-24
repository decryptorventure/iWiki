import React from 'react';
import { Card as UIKitCard } from '@frontend-team/ui-kit';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'soft' | 'glossy';
};

export function Card({ className, ...props }: CardProps) {
  // @ts-ignore - UIKitCard might have different props
  return <UIKitCard className={className} {...props} />;
}
// Re-export pattern for compatibility
