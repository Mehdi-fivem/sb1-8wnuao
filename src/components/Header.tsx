import React, { useState } from 'react';
import { User, LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationCenter } from './notifications/NotificationCenter';
import { Logo } from './Logo';
import { Notification, User as UserType } from '../types';
import { useSidebar } from '../contexts/SidebarContext';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  notifications: Notification[];
  onClearNotifications: () => void;
  onMarkNotificationAsRead: (id: string) => void;
}

export function Header({ 
  user, 
  onLogout, 
  notifications,
  onClearNotifications,
  onMarkNotificationAsRead
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { toggle, isOpen } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <Logo />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <NotificationCenter
              notifications={notifications}
              onClearAll={onClearNotifications}
              onMarkAsRead={onMarkNotificationAsRead}
            />
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
                  {user.username}
                </span>
                {user.role === 'admin' && (
                  <span className="hidden sm:inline-flex bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                    {user.username}
                    {user.role === 'admin' && (
                      <span className="ml-2 inline-flex bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}