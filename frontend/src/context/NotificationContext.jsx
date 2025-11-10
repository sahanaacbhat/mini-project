import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { notificationAPI } from '../lib/api';

const NotificationContext = createContext({ hasUnread: false, refreshing: false, refresh: async () => {}, markAllRead: async () => {} });

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await notificationAPI.list();
      setItems(res.notifications || []);
    } catch {}
    finally { setRefreshing(false); }
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationAPI.markAllRead();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  const hasUnread = useMemo(() => items.some(n => !n.isRead), [items]);

  return (
    <NotificationContext.Provider value={{ hasUnread, refreshing, refresh, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};


