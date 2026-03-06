import React from 'react';
import { Bell, Check, Trash2, Clock, Info, MessageSquare, Heart, Coins, Target, X } from 'lucide-react';
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
        dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: id });
        addToast('Đã xóa thông báo', 'info');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment': return <MessageSquare size={16} className="text-blue-500" />;
            case 'like': return <Heart size={16} className="text-red-500" />;
            case 'reward': return <Coins size={16} className="text-yellow-500" />;
            case 'bounty': return <Target size={16} className="text-orange-500" />;
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
            } else if (n.link === 'bounties') {
                dispatch({ type: 'SET_SCREEN', screen: 'bounties' });
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell size={24} className="text-orange-500" />
                        Thông báo
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật những hoạt động mới nhất của bạn</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                        <Check size={14} /> Đánh dấu đã đọc
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Bell size={40} className="text-gray-200 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-gray-900">Không có thông báo</h3>
                        <p className="text-sm text-gray-400">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${n.isRead ? 'bg-white border-gray-100 hover:border-gray-200' : 'bg-orange-50/30 border-orange-100 shadow-sm'}`}
                        >
                            {!n.isRead && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                            <div className="flex gap-4">
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.isRead ? 'bg-gray-50' : 'bg-white'}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-900">{n.title || n.message}</span>
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock size={11} /> {n.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{n.content}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(n.id, e)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
