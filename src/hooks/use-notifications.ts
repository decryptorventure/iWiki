// Hook: notification state and dispatch actions
import { useApp } from '../context/AppContext';

export function useNotifications() {
  const { state, dispatch } = useApp();

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  return {
    notifications: state.notifications,
    unreadCount,
    markRead: (notificationId: string) =>
      dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId }),
    markAllRead: () =>
      dispatch({ type: 'MARK_ALL_READ' }),
    deleteNotification: (notificationId: string) =>
      dispatch({ type: 'DELETE_NOTIFICATION', notificationId }),
  };
}
