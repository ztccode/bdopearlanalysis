/**
 * NotificationProvider
 * Context global para notificações
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/shared/hooks';
import type { Notification } from '@/core/types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Provider component
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar o contexto
 */
export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationContext deve ser usado dentro de NotificationProvider');
  }

  return context;
}
