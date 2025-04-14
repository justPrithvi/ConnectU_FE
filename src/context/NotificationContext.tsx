import React, { createContext, useState, useContext, ReactNode } from 'react';

type NotificationContextType = {
  isVisible: boolean;
  notificationMessage: string;
  notificationType: 'success' | 'error';
  showNotification: (message: string, type: 'success' | 'error') => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('error');

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setIsVisible(true);
  };

  const hideNotification = () => {
    setIsVisible(false);
  };

  return (
    <NotificationContext.Provider value={{ isVisible, notificationMessage, notificationType, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
