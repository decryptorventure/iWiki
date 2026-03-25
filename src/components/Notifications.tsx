import React from 'react';
import { Bell, Check, Trash2, Clock, Info, MessageSquare, Flame, Coins, Target } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Button } from '@frontend-team/ui-kit';

export default function Notifications() {
    const { dispatch } = useApp();
    const { addToast } = useToast();
    const { notifications, markRead, markAllRead, deleteNotification } = useNotifications();

    const handleMarkAsRead = (id: string) => markRead(id);

    const handleMarkAllRead = () => {
        markAllRead();
        addToast('Đã đánh dấu tất cả là đã đọc', 'success');
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNotification(id);
        addToast('Đã xóa thông báo', 'info');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment': return <MessageSquare size={16} className="text-[var(--ds-fg-info)]" />;
            case 'like': return <Flame size={16} className="text-[var(--ds-fg-accent-primary)]" />;
            case 'reward': return <Coins size={16} className="text-[var(--ds-fg-accent-secondary)]" />;
            case 'bounty': return <Target size={16} className="text-[var(--ds-fg-accent-primary)]" />;
            default: return <Info size={16} className="text-[var(--ds-text-secondary)]" />;
        }
    };

    const handleNotificationClick = (n: any) => {
        handleMarkAsRead(n.id);
        if (n.link) {
            if (n.link.startsWith('article:')) {
                const articleId = n.link.split(':')[1];
                dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
                dispatch({ type: 'INCREMENT_VIEWS', articleId });
                dispatch({ type: 'SET_SCREEN', screen: 'article-detail' });
            } else if (n.link === 'bounties') {
                dispatch({ type: 'SET_SCREEN', screen: 'bounties' });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-8 py-12 animate-fade-in">
            <div className="flex items-center justify-between mb-8 animate-slide-up">
                <h1 className="text-3xl font-extrabold text-[var(--ds-text-primary)] flex items-center gap-3">
                    <div className="p-2 bg-[var(--ds-bg-info)] rounded-xl text-white shadow-md">
                        <Bell size={24} />
                    </div>
                    Thông báo
                </h1>
                {notifications.some(n => !n.isRead) && (
                    <Button variant="subtle" size="s" onClick={handleMarkAllRead}>
                        <Check size={16} /> Đánh dấu tất cả đã đọc
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--ds-bg-secondary)] rounded-3xl border border-dashed border-[var(--ds-border-secondary)]">
                        <div className="p-4 bg-[var(--ds-bg-primary)] rounded-full inline-block mb-4 shadow-sm">
                            <Bell size={32} className="text-[var(--ds-text-tertiary)]" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--ds-text-primary)]">Chưa có thông báo nào</h3>
                        <p className="text-[var(--ds-text-secondary)]">Chúng tôi sẽ báo cho bạn khi có tin mới!</p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer animate-slide-up stagger-${Math.min(i + 1, 6)} ${n.isRead ? 'bg-[var(--ds-bg-primary)] border-[var(--ds-border-secondary)]' : 'bg-[var(--ds-bg-accent-primary-subtle)] border-[var(--ds-border-accent-primary-subtle)] shadow-sm'}`}
                        >
                            {!n.isRead && (
                                <div className="absolute top-5 left-2 w-1.5 h-1.5 bg-[var(--ds-bg-accent-primary)] rounded-full"></div>
                            )}
                            <div className="flex gap-4">
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.isRead ? 'bg-[var(--ds-bg-secondary)]' : 'bg-[var(--ds-bg-primary)] shadow-sm'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-[var(--ds-text-primary)]">{n.title}</span>
                                        <span className="text-xs text-[var(--ds-text-secondary)] flex items-center gap-1"><Clock size={12} /> {n.time}</span>
                                    </div>
                                    <p className="text-sm text-[var(--ds-text-secondary)] line-clamp-2">{n.content}</p>
                                </div>
                                <Button variant="subtle" size="icon-s" onClick={(e: React.MouseEvent) => handleDelete(n.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-[var(--ds-fg-danger)] hover:bg-[var(--ds-bg-danger-subtle)]">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
