// Template picker modal with preview and AI-apply action for Editor
import React from 'react';
import { X, FileText, Sparkles } from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';

interface EditorTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
}

interface EditorTemplateModalProps {
  templates: EditorTemplate[];
  activeTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  onApplyTemplate: (content: string) => void;
  onApplyWithAI: (content: string) => void;
  onClose: () => void;
}

export default function EditorTemplateModal({
  templates, activeTemplateId, onSelectTemplate, onApplyTemplate, onApplyWithAI, onClose,
}: EditorTemplateModalProps) {
  const activeTemplate = templates.find(t => t.id === (activeTemplateId || templates[0]?.id)) || templates[0];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
      <div className="bg-[var(--ds-bg-primary)] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter">
        <div className="px-6 py-4 border-b border-[var(--ds-border-secondary)] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[var(--ds-text-primary)] flex items-center gap-2">
              <FileText size={18} className="text-[var(--ds-fg-accent-primary)]" /> Chọn biểu mẫu bài viết
            </h3>
            <p className="text-xs text-[var(--ds-text-secondary)] mt-1">Chọn template phù hợp, xem preview trước khi áp dụng. Có thể kết hợp cùng iWiki AI.</p>
          </div>
          <Button variant="subtle" size="icon-s" onClick={onClose}><X size={18} /></Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Template list */}
          <div className="w-72 border-r border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)] p-4 space-y-3 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wide">Biểu mẫu gợi ý</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--ds-bg-accent-primary-subtle)] text-[10px] font-medium text-[var(--ds-fg-accent-primary)] border border-[var(--ds-border-accent-primary-subtle)]">
                <Sparkles size={10} /> AI friendly
              </span>
            </div>
            {templates.map(t => (
              <button key={t.id} onClick={() => onSelectTemplate(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm mb-1 transition-all flex flex-col gap-1 ${(activeTemplateId || templates[0]?.id) === t.id ? 'border-[var(--ds-border-accent-primary-subtle)] bg-[var(--ds-bg-primary)] shadow-sm' : 'border-[var(--ds-border-secondary)] bg-[var(--ds-bg-secondary)] hover:bg-[var(--ds-bg-primary)] hover:border-[var(--ds-border-secondary)]'}`}>
                <span className="font-semibold text-[var(--ds-text-primary)] line-clamp-2">{t.title}</span>
                <p className="text-xs text-[var(--ds-text-secondary)] line-clamp-2">{t.description}</p>
              </button>
            ))}
          </div>

          {/* Preview + actions */}
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--ds-border-secondary)] flex items-center justify-between shrink-0">
              <div>
                <p className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wide">Preview biểu mẫu</p>
                <p className="text-sm text-[var(--ds-text-secondary)] mt-0.5">Nội dung chỉ là khung gợi ý. Bạn có thể chỉnh sửa lại toàn bộ sau khi áp dụng.</p>
              </div>
              {activeTemplate && (
                <div className="flex items-center gap-2">
                  <Button variant="border" size="s" onClick={() => onApplyTemplate(activeTemplate.content)}>
                    Dùng template
                  </Button>
                  <Button variant="primary" size="s" onClick={() => onApplyWithAI(activeTemplate.content)}>
                    <Sparkles size={14} /> Dùng template + AI dàn ý
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[var(--ds-bg-primary)]">
              {activeTemplate && (
                <div className="border border-dashed border-[var(--ds-border-secondary)] rounded-2xl bg-[var(--ds-bg-secondary)] p-4 h-full">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wide">{activeTemplate.title}</p>
                    <p className="text-xs text-[var(--ds-text-secondary)] mt-0.5">{activeTemplate.description}</p>
                  </div>
                  <pre className="text-xs text-[var(--ds-text-secondary)] whitespace-pre-wrap font-mono leading-relaxed max-h-[380px] overflow-y-auto custom-scrollbar bg-[var(--ds-bg-primary)] rounded-xl border border-[var(--ds-border-secondary)] p-3">
{activeTemplate.content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
