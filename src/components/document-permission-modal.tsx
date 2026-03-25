// Share & permission modal for DocumentManagement
import React from 'react';
import { Globe, Folder, FileText, Search } from 'lucide-react';
import { Button, Input, Select, Modal } from '@frontend-team/ui-kit';

const ACCESS_OPTIONS = [
  { value: 'viewer', label: 'Người xem' },
  { value: 'editor', label: 'Người chỉnh sửa' },
  { value: 'restricted', label: 'Bị hạn chế' },
];

const MEMBER_OPTIONS = [
  { value: 'editor', label: 'Người chỉnh sửa' },
  { value: 'viewer', label: 'Người xem' },
  { value: 'remove', label: 'Xóa quyền' },
];

interface DocumentPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: { id: string; name: string; type: 'folder' | 'doc' } | null;
}

export function DocumentPermissionModal({ open, onOpenChange, selectedItem }: DocumentPermissionModalProps) {
  if (!selectedItem) return null;
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Chia sẻ & Phân quyền"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="subtle" size="s" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button variant="primary" size="s" onClick={() => onOpenChange(false)}>Lưu thay đổi</Button>
        </div>
      }
    >
      <p className="text-sm text-[var(--ds-text-tertiary)] flex items-center gap-2 mb-6">
        {selectedItem.type === 'folder' ? <Folder size={14} /> : <FileText size={14} />}
        {selectedItem.name}
      </p>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-[var(--ds-text-primary)] mb-3">Quyền truy cập chung</h4>
          <div className="flex items-center justify-between p-3 border border-[var(--ds-border-tertiary)] rounded-xl bg-[var(--ds-bg-secondary)] hover:bg-[var(--ds-bg-primary)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--ds-bg-primary)] rounded-lg shadow-sm"><Globe size={20} className="text-[var(--ds-fg-info)]" /></div>
              <div>
                <div className="text-sm font-bold text-[var(--ds-text-primary)]">Bất kỳ ai trong iKame</div>
                <div className="text-xs text-[var(--ds-text-tertiary)]">Có thể tìm và xem nội dung này</div>
              </div>
            </div>
            <Select options={ACCESS_OPTIONS} defaultValue="viewer" size="s" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[var(--ds-text-primary)] mb-3">Người có quyền truy cập</h4>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-tertiary)]" size={16} />
            <Input type="text" placeholder="Thêm người hoặc nhóm..." className="w-full pl-9" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/ikame/100/100" alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-[var(--ds-bg-secondary)]" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-sm font-bold text-[var(--ds-text-primary)]">Nguyễn Văn A (Bạn)</div>
                  <div className="text-xs text-[var(--ds-text-tertiary)]">nguyen.van.a@ikame.com</div>
                </div>
              </div>
              <span className="text-sm text-[var(--ds-text-tertiary)]">Chủ sở hữu</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--ds-bg-info-subtle)] text-[var(--ds-fg-info)] flex items-center justify-center font-bold text-xs">HR</div>
                <div>
                  <div className="text-sm font-bold text-[var(--ds-text-primary)]">Phòng Nhân sự</div>
                  <div className="text-xs text-[var(--ds-text-tertiary)]">hr@ikame.com</div>
                </div>
              </div>
              <Select options={MEMBER_OPTIONS} defaultValue="editor" size="xs" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
