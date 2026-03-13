import React from 'react';
import { Bell, Check, Trash2, Clock, Info, MessageSquare, Flame, Coins, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';

export default function Notifications() {
    const { state, dispatch } = useApp();
    const { addToast } = useToast();
    const { notifications } = state;

    const handleMarkAsRead = (id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: id });
    };

    const handleMarkAllRead = () => {
        notifications.forEach(n => {
            if (!n.isRead) dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: n.id });
        });
        addToast('Đã đánh dấu tất cả là đã đọc', 'success');
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({ type: 'DELETE_NOTIFICATION', notificationId: id });
        addToast('Đã xóa thông báo', 'info');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment': return <MessageSquare size={16} className="text-blue-500" />;
            case 'like': return <Flame size={16} className="text-orange-500" />;
            case 'reward': return <Coins size={16} className="text-yellow-500" />;
            case 'bounty': return <Target size={16} className="text-[#FF6B4A]" />;
            default: return <Info size={16} className="text-gray-400" />;
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
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-md shadow-indigo-500/20">
                        <Bell size={24} />
                    </div>
                    Thông báo
                </h1>
                {notifications.some(n => !n.isRead) && (
                    <button onClick={handleMarkAllRead} className="text-sm font-medium text-gray-500 hover:text-[#FF6B4A] transition-colors flex items-center gap-1.5">
                        <Check size={16} /> Đánh dấu tất cả đã đọc
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="p-4 bg-white rounded-full inline-block mb-4 shadow-sm">
                            <Bell size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Chưa có thông báo nào</h3>
                        <p className="text-gray-500">Chúng tôi sẽ báo cho bạn khi có tin mới!</p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer animate-slide-up stagger-${Math.min(i + 1, 6)} ${n.isRead ? 'bg-white border-gray-100' : 'bg-gradient-to-r from-orange-50/50 to-white border-orange-100/50 shadow-sm'}`}
                        >
                            {!n.isRead && (
                                <div className="absolute top-5 left-2 w-1.5 h-1.5 bg-[#FF6B4A] rounded-full"></div>
                            )}
                            <div className="flex gap-4">
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-gray-900">{n.title}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {n.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(n.id, e)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
