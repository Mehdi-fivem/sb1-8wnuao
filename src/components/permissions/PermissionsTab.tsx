import React from 'react';
import { User } from '../../types';
import { Shield } from 'lucide-react';

interface PermissionsTabProps {
  user: User;
  onUpdatePermissions: (userId: string, permissions: User['permissions']) => void;
}

export function PermissionsTab({ user, onUpdatePermissions }: PermissionsTabProps) {
  const handlePermissionChange = (
    module: keyof User['permissions'],
    action: string,
    value: boolean
  ) => {
    const newPermissions = {
      ...user.permissions,
      [module]: {
        ...user.permissions[module],
        [action]: value
      }
    };
    onUpdatePermissions(user.id, newPermissions);
  };

  const PermissionSection = ({ 
    title, 
    module 
  }: { 
    title: string; 
    module: keyof User['permissions']
  }) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {module === 'documents' || module === 'users' ? (
          <>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={user.permissions[module].view}
                  onChange={(e) => handlePermissionChange(module, 'view', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Visualiser</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={user.permissions[module].create}
                  onChange={(e) => handlePermissionChange(module, 'create', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Créer</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={user.permissions[module].edit}
                  onChange={(e) => handlePermissionChange(module, 'edit', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Modifier</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={user.permissions[module].delete}
                  onChange={(e) => handlePermissionChange(module, 'delete', e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Supprimer</span>
              </label>
            </div>
          </>
        ) : module === 'settings' ? (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={user.permissions.settings.view}
                onChange={(e) => handlePermissionChange('settings', 'view', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Visualiser</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={user.permissions.settings.manage}
                onChange={(e) => handlePermissionChange('settings', 'manage', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Gérer</span>
            </label>
          </div>
        ) : module === 'dashboard' && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={user.permissions.dashboard.view}
                onChange={(e) => handlePermissionChange('dashboard', 'view', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Visualiser</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gestion des droits - {user.username}
        </h2>
      </div>
      
      <PermissionSection title="Documents" module="documents" />
      <PermissionSection title="Utilisateurs" module="users" />
      <PermissionSection title="Réglages" module="settings" />
      <PermissionSection title="Tableau de bord" module="dashboard" />
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>* Les administrateurs ont automatiquement tous les droits</p>
      </div>
    </div>
  );
}