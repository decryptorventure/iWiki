import React from 'react';
import { Lightbulb, Rocket } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type ComingSoonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  description: string;
  onViewIdea: () => void;
};

export default function ComingSoonModal({
  open,
  onOpenChange,
  featureName,
  description,
  onViewIdea,
}: ComingSoonModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidthClassName="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <Rocket size={18} className="text-[#FF6B4A]" />
          <span>{featureName}</span>
        </div>
      }
      description="Tính năng này đang được hoàn thiện để ra mắt bản chính thức."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Để sau
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onOpenChange(false);
              onViewIdea();
            }}
          >
            <Lightbulb size={16} />
            Xem Idea
          </Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <p className="text-sm leading-relaxed text-gray-700">{description}</p>
      </div>
    </Modal>
  );
}
