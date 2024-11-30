import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronRight, Sun, Moon, Bell, User } from 'lucide-react';
import { CategoryManager } from './CategoryManager';
import { ProfileSettings } from './ProfileSettings';
import { Category, NotificationSettings, User as UserType } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface SettingsPageProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  notificationSettings: NotificationSettings;
  onUpdateNotificationSettings: (settings: NotificationSettings) => void;
  currentUser: UserType;
  onUpdateProfile: (userData: Partial<UserType>) => void;
}

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="p-4 border-t border-gray-100 dark:border-gray-700">{children}</div>}
    </div>
  );
}

export function SettingsPage({ 
  categories, 
  onAddCategory, 
  onDeleteCategory,
  notificationSettings,
  onUpdateNotificationSettings,
  currentUser,
  onUpdateProfile
}: SettingsPageProps) {
  const { isDark, toggleTheme } = useTheme();

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Réglages</h1>
      </div>

      <div className="space-y-3">
        <SettingsSection
          title="Profil"
          icon={<User className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
        >
          <ProfileSettings
            currentUser={currentUser}
            onUpdateProfile={onUpdateProfile}
          />
        </SettingsSection>

        <SettingsSection
          title="Gestion des catégories"
          icon={<Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
        >
          <CategoryManager
            categories={categories}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
          />
        </SettingsSection>

        <SettingsSection
          title="Préférences d'affichage"
          icon={isDark ? <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Mode sombre</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDark ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          icon={<Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Nouveaux documents
              </span>
              <button
                onClick={() => handleNotificationToggle('documents')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notificationSettings.documents ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`${
                    notificationSettings.documents ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Activité des utilisateurs
              </span>
              <button
                onClick={() => handleNotificationToggle('userActivity')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notificationSettings.userActivity ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`${
                    notificationSettings.userActivity ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mises à jour système
              </span>
              <button
                onClick={() => handleNotificationToggle('systemUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notificationSettings.systemUpdates ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`${
                    notificationSettings.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}