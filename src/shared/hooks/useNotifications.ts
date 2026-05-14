/**
 * useNotifications Hook
 * Gerencia notificações da aplicação
 */

import { useState, useCallback } from 'react';
import type { Notification } from '@/core/types';
import { nanoid } from 'nanoid';

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Adiciona notificação
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = nanoid();
      const newNotification: Notification = {
        ...notification,
        id,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remover após duração
      if (notification.duration) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration);
      }

      return id;
    },
    []
  );

  /**
   * Remove notificação
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Limpa todas as notificações
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
