import React from 'react';
import { Download, Eye, Trash2, FileText } from 'lucide-react';
import { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onView: (document: Document) => void;
  currentUser: { role: string; permissions: { documents: { delete: boolean } } };
}

const fallbackImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop&q=80';

export function DocumentCard({ document, onDelete, onView, currentUser }: DocumentCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImageUrl;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="aspect-w-3 aspect-h-2 bg-gray-100 dark:bg-gray-700 relative cursor-pointer"
        onClick={() => onView(document)}
      >
        {document.fileType.includes('image') ? (
          <img
            src={document.fileUrl}
            alt={document.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
            <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {document.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(document);
              }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Voir"
            >
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            <a
              href={document.fileUrl}
              download={document.name}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Télécharger"
            >
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </a>
            {(currentUser?.permissions.documents.delete || currentUser?.role === 'admin') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(document.id);
                }}
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {document.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {new Date(document.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}