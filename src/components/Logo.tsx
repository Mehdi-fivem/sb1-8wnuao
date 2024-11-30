import React from 'react';
import { FileText } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:inline">
        Gestionnaire de Documents
      </span>
      <span className="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">
        GD
      </span>
    </div>
  );
}