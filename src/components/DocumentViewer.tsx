import React from 'react';
import { X, Download } from 'lucide-react';

interface DocumentViewerProps {
  fileUrl: string;
  fileType: string;
  name: string;
  onClose: () => void;
}

export function DocumentViewer({ fileUrl, fileType, name, onClose }: DocumentViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h2>
          <div className="flex items-center space-x-2">
            <a
              href={fileUrl}
              download={name}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="Télécharger"
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative w-full h-[80vh] bg-gray-100 dark:bg-gray-700 overflow-auto">
          {fileType.startsWith('image/') ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={fileUrl}
                alt={name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : fileType === 'application/pdf' ? (
            <iframe
              src={fileUrl}
              title={name}
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Aperçu non disponible pour ce type de fichier
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}