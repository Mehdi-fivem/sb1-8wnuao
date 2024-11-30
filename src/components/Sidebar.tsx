import React from 'react';
import { Users, FileText, Layout, Settings, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';

interface SidebarProps {
  isAdmin: boolean;
  hasSettingsAccess: boolean;
}

export function Sidebar({ isAdmin, hasSettingsAccess }: SidebarProps) {
  const location = useLocation();
  const { isOpen } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      } ${isOpen ? 'justify-start space-x-2 px-4' : 'justify-center'}`}
      title={!isOpen ? children?.toString() : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isOpen && (
        <span className="transition-all duration-200 whitespace-nowrap">
          {children}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen z-30 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'} 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full bg-white dark:bg-gray-800 shadow-lg overflow-x-hidden">
          <div className="flex flex-col h-full pt-16 lg:pt-4">
            <div className={`flex items-center ${isOpen ? 'justify-start px-4 space-x-2' : 'justify-center'} mb-8`}>
              <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              {isOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-all duration-200">
                  Dashboard
                </span>
              )}
            </div>
            <nav className="space-y-2 px-2">
              <NavLink to="/" icon={Layout}>
                Tableau de bord
              </NavLink>
              <NavLink to="/documents" icon={FileText}>
                Documents
              </NavLink>
              {isAdmin && (
                <NavLink to="/users" icon={Users}>
                  Utilisateurs
                </NavLink>
              )}
              {hasSettingsAccess && (
                <NavLink to="/settings" icon={Settings}>
                  Réglages
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/logs" icon={AlertCircle}>
                  Logs
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => useSidebar().toggle()}
        />
      )}
    </>
  );
}