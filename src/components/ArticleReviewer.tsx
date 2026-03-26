
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Send, Save, Quote, Info, Trash2, SendHorizontal } from 'lucide-react';
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
    <div className="flex flex-col h-full animate-fade-in max-w-7xl mx-auto px-6">
      {/* Review Header Bar */}
      <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8">
         <div className="flex items-center gap-4">
            <Button variant="subtle" size="icon-m" onClick={onBack}><ArrowLeft size={20}/></Button>
            <div>
               <h1 className="text-2xl font-black text-[var(--ds-text-primary)]">Review: {article.title}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <Badge variant="subtle" size="xs">Tác giả: {article.author.name}</Badge>
                 <Badge variant="dim" size="xs">Space: {article.folderName}</Badge>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="border" size="m" onClick={() => setShowRejectReason(true)} className="text-red-500 hover:bg-red-50 hover:border-red-200">
               <XCircle size={18}/> Từ chối
            </Button>
            <Button variant="primary" size="m" onClick={handleApprove} className="bg-green-600 hover:bg-green-700 border-green-600 shadow-lg shadow-green-500/20">
               <CheckCircle size={18}/> Duyệt & Xuất bản
            </Button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 overflow-hidden pb-10">
        {/* Main Content Viewer */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 shadow-xl p-10 overflow-y-auto custom-scrollbar relative">
           <div className="absolute top-6 right-6 opacity-40">
             <Info size={24} title="Bôi đen văn bản để thêm feedback inline" />
           </div>
           <div className="mb-10 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Nội dung bài viết (Chế độ Review)</div>
           
           <h2 className="text-4xl font-extrabold mb-8 text-[var(--ds-text-primary)]">{article.title}</h2>
           
           <div 
             className="prose prose-lg max-w-none text-[var(--ds-text-secondary)] leading-relaxed"
             onMouseUp={handleAddInlineComment}
             dangerouslySetInnerHTML={{ __html: article.content }}
           />

           <div className="mt-20 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200/50 flex flex-col items-center justify-center text-center">
              <Quote className="text-gray-300 mb-4" size={40} />
              <h4 className="font-bold text-gray-500">Kết thúc bài viết</h4>
              <p className="text-sm text-gray-400 max-w-sm mt-1">Anh đã đọc hết nội dung. Hãy sử dụng bảng điều khiển bên phải để để lại feedback chi tiết hoặc phê duyệt ngay.</p>
           </div>
        </div>

        {/* Feedback Side Panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
           {/* Inline Inline Feedback Tool */}
           <div className="bg-[var(--ds-bg-accent-primary-subtle)] border border-[var(--ds-border-accent-primary-subtle)] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[var(--ds-fg-accent-primary)] font-black">
                <MessageSquare size={20} /> Feedback Inline
              </div>
              {selectedQuote ? (
                <div className="bg-white/80 p-3 rounded-xl border border-orange-200 mb-4 animate-in fade-in slide-in-from-top-2">
                   <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-tighter">Đoạn trích dẫn:</p>
                   <p className="text-sm italic font-medium text-gray-700 line-clamp-3">"{selectedQuote}"</p>
                </div>
              ) : (
                <div className="p-3 bg-white/40 rounded-xl border border-dashed border-orange-200 mb-4 text-xs text-orange-800 italic">
                   Mẹo: Bôi đen một đoạn văn bản bất kỳ ở bên trái để trích dẫn vào feedback.
                </div>
              )}
              <Textarea 
                placeholder="Nhận xét hoặc yêu cầu sửa đổi..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className="w-full mb-3 bg-white/60 border-orange-100"
              />
              <Button 
                variant="primary" 
                fullWidth 
                size="m" 
                disabled={!commentInput.trim()}
                onClick={submitInlineComment}
                className="gap-2"
              >
                Gửi phản hồi <SendHorizontal size={16} />
              </Button>
           </div>

           {/* Feedback History List */}
           <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-3xl p-6 border border-gray-100 overflow-hidden flex flex-col">
              <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-4 flex items-center justify-between">
                Lịch sử Feedback ({inlineComments.length})
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {inlineComments.map((c: any) => (
                  <div key={c.id} className="bg-white dark:bg-zinc-900 border border-gray-100 rounded-2xl p-4 shadow-sm group">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-[var(--ds-fg-accent-primary)] uppercase tracking-tighter bg-orange-50 px-2 py-0.5 rounded-full">Inline Detail</span>
                        <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                     </div>
                     <p className="text-xs text-gray-400 mb-2 italic border-l-2 border-orange-200 pl-3 line-clamp-2">"{c.quote}"</p>
                     <p className="text-sm font-semibold text-gray-800">{c.content}</p>
                     <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-50 pt-2">
                        <span>Review bởi <strong>{c.authorName}</strong></span>
                        <button className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"><Trash2 size={12}/></button>
                     </div>
                  </div>
                ))}
                {inlineComments.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                     <MessageSquare size={24} className="opacity-20 mb-2" />
                     <p className="text-xs italic">Chưa có feedback nào.</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-[40px] p-10 max-w-xl w-full mx-6 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-3xl font-black text-red-600 mb-4 flex items-center gap-3">
                 <XCircle size={32} /> Phê duyệt không thành công
              </h2>
              <p className="text-gray-600 mb-6">Vui lòng cung cấp lý do tổng quát hoặc feedback chính để Contributor (Tác giả) có thể chỉnh sửa lại bài viết của mình.</p>
              
              <Textarea 
                placeholder="Lý do bài viết chưa đạt chuẩn... (VD: Thiếu bằng chứng thực tế, Trình bày chưa gãy gọn...)"
                className="w-full h-40 mb-6 border-red-100 focus:ring-red-500 focus:border-red-500"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-4">
                 <Button variant="subtle" fullWidth size="l" onClick={() => setShowRejectReason(false)}>Hủy</Button>
                 <Button 
                   variant="primary" 
                   fullWidth 
                   size="l" 
                   className="bg-red-600 hover:bg-red-700 border-red-600 shadow-xl shadow-red-500/20"
                   onClick={handleReject}
                 >
                   Xác nhận Từ chối
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
