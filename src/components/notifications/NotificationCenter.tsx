import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, FileText, User, Settings } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationCenter({ notifications, onClearAll, onMarkAsRead }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'user':
        return <User className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-2">
            <div className="flex items-center justify-between p-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Tout effacer
                </button>
              )}
            </div>

            <div className="mt-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  Aucune notification
                </p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => onMarkAsRead(notification.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors cursor-pointer ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-700'
                          : 'bg-blue-50 dark:bg-blue-900'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                        <div className="ml-3 flex-1">
                          <p className={`text-sm font-medium ${
                            notification.read
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-blue-900 dark:text-blue-100'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs ${
                            notification.read
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-blue-700 dark:text-blue-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}