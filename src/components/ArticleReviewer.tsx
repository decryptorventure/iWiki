
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Send, Save, Quote, Info, Trash2, SendHorizontal, User, Folder as FolderIcon, Edit } from 'lucide-react';
import { Button, Badge, Textarea, Tooltip } from '@frontend-team/ui-kit';
import { Article, ApprovalInlineComment } from '../types';

export default function ArticleReviewer({ articleId, onBack }: { articleId: string, onBack: () => void }) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const article = state.articles.find(a => a.id === articleId);

  const [commentInput, setCommentInput] = useState('');
  const [selectedQuote, setSelectedQuote] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!article) return <div className="p-20 text-center">Article not found.</div>;

  const inlineComments = article.approval?.comments || [];

  const handleAddInlineComment = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setSelectedQuote(selection);
      addToast(`Đã chọn đoạn văn bản: "${selection.slice(0, 30)}..." để feedback`, 'info');
    }
  };

  const submitInlineComment = () => {
    if (!commentInput.trim()) return;
    const newComment: ApprovalInlineComment = {
      id: `ic-${Date.now()}`,
      content: commentInput.trim(),
      quote: selectedQuote || 'Chung cho bài viết',
      authorId: state.currentUser.id,
      authorName: state.currentUser.name,
      createdAt: new Date().toISOString(),
      lineNumber: 0,
    };

    dispatch({ 
      type: 'ADD_APPROVAL_COMMENT', 
      articleId,
      comment: newComment
    });
    setCommentInput('');
    setSelectedQuote('');
    addToast('Đã thêm feedback inline thành công', 'success');
  };

  const handleApprove = () => {
    dispatch({ 
      type: 'APPROVE_ARTICLE', 
      articleId,
      approverId: state.currentUser.id
    });
    // The reducer doesn't set it to 'published' automatically, but to 'approved'
    // Usually, Approved articles can then be Published. 
    // To match user's 'Published' requirement, let's also call PUBLISH_APPROVED_ARTICLE
    dispatch({ type: 'PUBLISH_APPROVED_ARTICLE', articleId });
    
    addToast('Đã phê duyệt và xuất bản bài viết thành công! 🎉', 'success');
    onBack();
  };

  const handleReject = () => {
    if (!rejectionReason.trim() && inlineComments.length === 0) {
      addToast('Vui lòng nhập lý do từ chối hoặc ít nhất một feedback inline', 'warning');
      setShowRejectReason(true);
      return;
    }
    dispatch({ 
      type: 'REJECT_ARTICLE', 
      articleId,
      approverId: state.currentUser.id,
      reason: rejectionReason.trim()
    });
    addToast('Đã từ chối bài viết. Tác giả sẽ nhận được feedback để sửa lại.', 'info');
    onBack();
  };

  return (
    <div className="h-full flex flex-col bg-[var(--ds-bg-canvas-secondary)] animate-fade-in overflow-hidden">
      {/* Review Header Bar - Slimmer & Pro */}
      <header className="shrink-0 bg-[var(--ds-bg-primary)]/80 backdrop-blur-md border-b border-[var(--ds-border-secondary)] px-8 py-4 flex items-center justify-between z-30 shadow-sm">
         <div className="flex items-center gap-5">
            <Button variant="subtle" size="icon-m" onClick={onBack} className="rounded-2xl bg-[var(--ds-bg-subtle)] hover:bg-[var(--ds-bg-tertiary)] transition-all">
              <ArrowLeft size={20} className="text-[var(--ds-icon-secondary)]" />
            </Button>
            <div className="flex flex-col">
               <div className="flex items-center gap-3">
                 <h1 className="text-xl font-bold tracking-tight text-[var(--ds-text-primary)] truncate max-w-md">{article.title}</h1>
                 <Badge variant="warning" size="xs" className="px-2 py-0.5 rounded-full font-bold">Review Mode</Badge>
               </div>
               <div className="flex items-center gap-3 mt-0.5">
                 <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--ds-text-tertiary)] bg-[var(--ds-bg-subtle)] px-2 py-0.5 rounded-lg uppercase tracking-tight">
                   <User size={10}/> {article.author.name}
                 </div>
                 <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--ds-text-tertiary)] bg-[var(--ds-bg-subtle)] px-2 py-0.5 rounded-lg uppercase tracking-tight">
                   <FolderIcon size={10}/> {article.folderName}
                 </div>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button variant="border" size="m" onClick={() => setShowRejectReason(true)} className="rounded-2xl text-[var(--ds-fg-danger)] border-[var(--ds-border-danger-subtle)] hover:bg-[var(--ds-bg-danger-subtle)] font-bold px-6">
               <XCircle size={18} className="mr-2" /> Từ chối
            </Button>
            <Button variant="primary" size="m" onClick={handleApprove} className="rounded-2xl bg-[var(--ds-fg-success)] hover:opacity-90 border-none shadow-xl shadow-[var(--ds-fg-success)]/20 font-bold px-8">
               <CheckCircle size={18} className="mr-2" /> Duyệt & Xuất bản
            </Button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Document Content (Hero Area) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--ds-bg-primary)] px-12 py-16 scroll-smooth">
           <article className="max-w-3xl mx-auto">
              {/* Review Guidance Info */}
              <div className="mb-12 flex items-center gap-4 p-5 bg-[var(--ds-bg-accent-secondary-subtle)] border border-[var(--ds-border-accent-secondary-subtle)] rounded-3xl text-[var(--ds-fg-accent-secondary)] animate-slide-up">
                <div className="p-3 bg-[var(--ds-bg-accent-secondary)] rounded-2xl text-[var(--ds-fg-on-contrast)] shadow-lg">
                  <Info size={20} />
                </div>
                <div>
                   <p className="font-black text-xs uppercase tracking-widest mb-0.5">KM Review Assistance</p>
                   <p className="text-sm font-medium opacity-90 leading-relaxed">
                     Hãy bôi đen bất kỳ đoạn văn bản nào bên dưới để trích dẫn vào Feedback Inline ở cột bên phải. 
                     Sử dụng inline comment giúp Contributor sửa đổi chính xác hơn.
                   </p>
                </div>
              </div>

              {/* Real Content */}
              <h2 className="text-5xl font-black mb-10 text-[var(--ds-text-primary)] leading-[1.1] tracking-tight">{article.title}</h2>
              
              <div 
                className="prose prose-xl prose-stone dark:prose-invert max-w-none text-[var(--ds-text-secondary)] leading-[1.8] font-medium selection:bg-[var(--ds-bg-accent-secondary-subtle)] selection:text-[var(--ds-fg-accent-secondary)]"
                onMouseUp={handleAddInlineComment}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-24 pt-12 border-t border-[var(--ds-border-subtle)] flex flex-col items-center justify-center text-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                 <Quote className="text-[var(--ds-fg-accent-secondary)] mb-6 group-hover:scale-110 transition-transform" size={48} />
                 <h4 className="font-black text-xl text-[var(--ds-text-primary)] mb-2">Hết nội dung cần Review</h4>
                 <p className="text-sm text-[var(--ds-text-secondary)] max-w-sm font-medium">Anh đã đọc trọn vẹn bản nháp. Vui lòng kiểm tra lại các feedback trước khi đưa ra quyết định cuối cùng.</p>
              </div>
           </article>
        </div>

        {/* RIGHT: Fixed Review Sidebar */}
        <aside className="w-[420px] bg-[var(--ds-bg-canvas-secondary)] border-l border-[var(--ds-border-secondary)] flex flex-col z-20 shadow-2xl overflow-hidden">
           {/* Sidebar Section 1: Interaction Zone */}
           <div className="p-8 border-b border-[var(--ds-border-secondary)] bg-[var(--ds-bg-primary)]/50">
              <h3 className="flex items-center gap-2.5 font-black text-sm uppercase tracking-widest text-[var(--ds-fg-accent-primary)] mb-6">
                <div className="w-8 h-8 rounded-xl bg-[var(--ds-bg-accent-primary-subtle)] flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                Phản hồi chi tiết
              </h3>

              {selectedQuote ? (
                <div className="bg-[var(--ds-bg-accent-secondary-subtle)] border-2 border-[var(--ds-border-accent-secondary-subtle)] p-5 rounded-[24px] mb-6 animate-in fade-in slide-in-from-right-4 relative group">
                   <div className="absolute top-4 right-4 text-[var(--ds-fg-accent-secondary)] opacity-20">
                     <Quote size={24} />
                   </div>
                   <p className="text-[10px] font-black text-[var(--ds-fg-accent-secondary)] mb-2 uppercase tracking-tighter flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--ds-bg-accent-secondary)]" /> Đang trích dẫn
                   </p>
                   <p className="text-[13px] italic font-semibold text-[var(--ds-fg-accent-secondary)] leading-relaxed blur-0 group-hover:blur-[0.5px] transition-all">
                     "{selectedQuote.length > 150 ? selectedQuote.slice(0, 150) + '...' : selectedQuote}"
                   </p>
                   <button 
                     onClick={() => setSelectedQuote('')}
                     className="mt-3 text-[10px] font-bold text-[var(--ds-fg-accent-secondary)] hover:opacity-80 underline underline-offset-2"
                   >
                     Gỡ trích dẫn
                   </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[var(--ds-border-subtle)] rounded-[24px] mb-6 text-center group hover:border-[var(--ds-border-accent-secondary-subtle)] transition-all">
                   <div className="w-12 h-12 rounded-full bg-[var(--ds-bg-subtle)] flex items-center justify-center text-[var(--ds-text-tertiary)] group-hover:text-[var(--ds-fg-accent-secondary)] group-hover:bg-[var(--ds-bg-accent-secondary-subtle)] transition-all">
                     <Edit size={24} />
                   </div>
                   <p className="text-xs font-bold text-[var(--ds-text-tertiary)] max-w-[200px] leading-relaxed group-hover:text-[var(--ds-fg-accent-secondary)]">Bôi đen văn bản để trích dẫn rồi gõ feedback</p>
                </div>
              )}

              <div className="space-y-4">
                <Textarea 
                  placeholder="KM đánh giá thế nào về đoạn này?"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  className="w-full text-sm font-medium min-h-[120px] rounded-2xl border-[var(--ds-border-subtle)] focus:border-[var(--ds-fg-accent-primary)] focus:ring-0 resize-none shadow-inner bg-[var(--ds-bg-primary)]"
                />
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="l" 
                  disabled={!commentInput.trim()}
                  onClick={submitInlineComment}
                  className="rounded-2xl py-6 font-black shadow-lg shadow-[var(--ds-fg-accent-primary)]/10 gap-3"
                >
                  Gửi Feedback <SendHorizontal size={20} />
                </Button>
              </div>
           </div>

           {/* Sidebar Section 2: History (Scrollable) */}
           <div className="flex-1 flex flex-col min-h-0 bg-[var(--ds-bg-subtle)]/50">
              <div className="px-8 py-5 border-b border-[var(--ds-border-secondary)] flex items-center justify-between">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-[var(--ds-text-tertiary)]">Feedback đã gửi ({inlineComments.length})</h3>
                <Badge variant="subtle" size="xs" className="opacity-50">Timeline</Badge>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar">
                {inlineComments.map((c: any) => (
                  <div key={c.id} className="bg-[var(--ds-bg-primary)] rounded-3xl p-5 border border-[var(--ds-border-subtle)] shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[var(--ds-fg-accent-secondary)]">
                     <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--ds-bg-accent-secondary-subtle)] flex items-center justify-center text-[10px] font-bold text-[var(--ds-fg-accent-secondary)]">KM</div>
                          <span className="text-[10px] font-black text-[var(--ds-text-primary)] uppercase">{c.authorName}</span>
                        </div>
                        <span className="text-[9px] font-bold text-[var(--ds-text-tertiary)]">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                     <p className="text-[11px] text-[var(--ds-text-tertiary)] mb-3 italic bg-[var(--ds-bg-subtle)] p-2 rounded-xl line-clamp-2 border-l border-[var(--ds-border-accent-secondary-subtle)]">"{c.quote}"</p>
                     <p className="text-sm font-bold text-[var(--ds-text-primary)] leading-snug">{c.content}</p>
                     <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[var(--ds-fg-danger)] hover:opacity-80"><Trash2 size={14}/></button>
                     </div>
                  </div>
                ))}
                {inlineComments.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                     <div className="w-16 h-16 bg-[var(--ds-bg-primary)] rounded-full flex items-center justify-center shadow-sm mb-4 border border-[var(--ds-border-subtle)] opacity-50">
                       <MessageSquare size={24} className="text-[var(--ds-icon-secondary)]" />
                     </div>
                     <p className="text-xs font-bold text-[var(--ds-text-tertiary)] tracking-wide uppercase">Chưa có feedback</p>
                  </div>
                )}
              </div>
           </div>
        </aside>
      </div>

      {/* Reject Modal - Clean & Bold */}
      {showRejectReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ds-bg-canvas-secondary)]/90 backdrop-blur-md animate-in fade-in transition-all">
           <div className="bg-[var(--ds-bg-primary)] rounded-[40px] p-12 max-w-2xl w-full mx-6 shadow-[0_20px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 border border-[var(--ds-border-subtle)]">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-[var(--ds-bg-danger-subtle)] rounded-[28px] flex items-center justify-center text-[var(--ds-fg-danger)]">
                   <XCircle size={40} />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-[var(--ds-text-primary)] tracking-tight">Từ chối bài viết</h2>
                    <p className="text-[var(--ds-text-secondary)] font-medium">Bản nháp này chưa đạt tiêu chuẩn. Vui lòng cho biết lý do chính.</p>
                 </div>
              </div>
              
              <Textarea 
                placeholder="Ví dụ: Thiếu dữ liệu thực tế, Văn phong không phù hợp, Sai tiêu chuẩn format..."
                className="w-full h-56 mb-8 border-[var(--ds-border-subtle)] focus:border-[var(--ds-fg-danger)] focus:ring-4 focus:ring-[var(--ds-bg-danger-subtle)] rounded-[32px] p-6 text-lg font-medium shadow-inner"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-6">
                 <Button variant="subtle" fullWidth size="l" onClick={() => setShowRejectReason(false)} className="rounded-[24px] py-8 text-lg font-bold">Quay lại</Button>
                 <Button 
                   variant="primary" 
                   fullWidth 
                   size="l" 
                   className="bg-[var(--ds-fg-danger)] hover:opacity-90 border-none shadow-2xl shadow-[var(--ds-fg-danger)]/30 rounded-[24px] py-8 text-lg font-black"
                   onClick={handleReject}
                 >
                   Xác nhận từ chối
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
