
import React, { useState } from 'react';
import { Layout, Edit2, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Input, Textarea, Badge } from '@frontend-team/ui-kit';

export function PermissionSpaceConfig() {
  const { state } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Note: In this demo, we use state from INITIAL_FOLDERS, but real editing would update global state.
  const rootSpaces = state.folders;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-[var(--ds-text-primary)]">Cấu trúc 7 Space & Folder Dữ liệu</h3>
          <p className="text-[var(--ds-text-secondary)]">Quản lý định danh, biểu tượng và mô tả cho các Space nội bộ.</p>
        </div>
        <Button variant="primary" size="s">
          <Plus size={18} /> Thêm Space mới
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rootSpaces.map((space) => (
          <div 
            key={space.id}
            className="group bg-white dark:bg-zinc-900 border border-[var(--ds-border-subtle)] rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="mt-2 text-[var(--ds-text-tertiary)] cursor-grab">
                <GripVertical size={20} />
              </div>
              
              <div className="text-4xl p-4 bg-[var(--ds-bg-subtle)] rounded-xl min-w-[80px] flex items-center justify-center">
                {space.icon || '📁'}
              </div>

              <div className="flex-1 min-w-0">
                {editingId === space.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1">Tên Space</label>
                        <Input defaultValue={space.name} className="w-full" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1"> Biểu tượng (Icon)</label>
                        <Input defaultValue={space.icon} className="w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1">Mô tả mục đích</label>
                      <Textarea defaultValue={space.description} className="w-full h-20" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="subtle" size="xs" onClick={() => setEditingId(null)}>Hủy</Button>
                      <Button variant="primary" size="xs" onClick={() => setEditingId(null)}><Save size={14} /> Lưu cấu hình</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-[var(--ds-text-primary)]">{space.name}</h4>
                      <Badge variant="subtle" size="xs">ID: {space.id}</Badge>
                      <Badge variant="dim" size="xs">{space.children?.length || 0} folders</Badge>
                    </div>
                    <p className="text-sm text-[var(--ds-text-secondary)] line-clamp-2 mb-3">
                      {space.description || 'Chưa có mô tả cho Space này.'}
                    </p>
                    <div className="flex items-center gap-2">
                       <Button variant="border" size="xs" onClick={() => setEditingId(space.id)}>
                         <Edit2 size={14} /> Chỉnh sửa Space
                       </Button>
                       <Button variant="dim" size="xs" className="text-red-500 hover:bg-red-50 border-red-100">
                         <Trash2 size={14} /> Gỡ bỏ
                       </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--ds-bg-info-subtle)] border border-[var(--ds-bg-info-border)] rounded-2xl p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500 rounded-xl text-white shadow-md">
            <Layout size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-900 mb-1">Quy tắc chuẩn hóa 7 Space</h4>
            <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4 opacity-90">
              <li>Mọi folder nhánh cuối (leaf folder) phải bắt buộc chứa 3 thư mục chuẩn: Process, Knowledge, Case Studies.</li>
              <li>Tên Space nên ngắn gọn (max 3 từ) để hiển thị tốt trên Sidebar.</li>
              <li>Icon sử dụng chuẩn Emoji hoặc Lucide Icon token.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
