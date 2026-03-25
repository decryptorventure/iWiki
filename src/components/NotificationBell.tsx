import React, { useEffect, useRef, useState } from 'react';
import { Bell, Clock, MessageSquare, Flame, Coins, Target, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../hooks/use-notifications';
import { APP_SCREENS } from '../constants/screens';

const MAX_PREVIEW = 5;

export default function NotificationBell() {
  const { dispatch } = useApp();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const openNotification = (notificationId: string, link?: string) => {
    markRead(notificationId);
    setOpen(false);
    if (!link) {
      dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
      return;
    }
    if (link.startsWith('article:')) {
      const articleId = link.split(':')[1];
      dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
      dispatch({ type: 'INCREMENT_VIEWS', articleId });
      dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.ARTICLE_DETAIL });
      return;
    }
    if (link === 'bounties') {
      dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.BOUNTIES });
      return;
    }
    dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={14} className="text-blue-500" />;
      case 'like':
        return <Flame size={14} className="text-orange-500" />;
      case 'reward':
        return <Coins size={14} className="text-yellow-500" />;
      case 'bounty':
        return <Target size={14} className="text-[#f76226]" />;
      default:
        return <Info size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        aria-label="Mở thông báo"
      >
        <Bell size={18} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[90vw] rounded-2xl border border-gray-200 bg-white shadow-xl z-30 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Thông báo</p>
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-gray-500 hover:text-[#f76226] transition-colors"
            >
              Đánh dấu đã đọc
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-sm text-center text-gray-500">Chưa có thông báo</div>
            ) : (
              notifications.slice(0, MAX_PREVIEW).map((item) => (
                <button
                  key={item.id}
                  onClick={() => openNotification(item.id, item.link)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    item.isRead ? 'bg-white' : 'bg-orange-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{item.content}</p>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        {item.time}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => {
                setOpen(false);
                dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
              }}
              className="w-full text-sm font-semibold text-[#f76226] hover:text-[#e55a2b] transition-colors"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
