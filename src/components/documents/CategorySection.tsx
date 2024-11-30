import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { Document, Category } from '../../types';
import { DocumentCard } from './DocumentCard';

interface CategorySectionProps {
  category: Category;
  documents: Document[];
  onDeleteDocument: (id: string) => void;
  onViewDocument: (document: Document) => void;
  currentUser: { role: string; permissions: { documents: { delete: boolean } } };
}

const ITEMS_PER_PAGE = 6;

export function CategorySection({ 
  category, 
  documents, 
  onDeleteDocument, 
  onViewDocument, 
  currentUser 
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (documents.length === 0) return null;

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleDocuments = documents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
            {category.name}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({documents.length})
            </span>
          </h3>
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-2">
            {visibleDocuments.map(document => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={onDeleteDocument}
                onView={onViewDocument}
                currentUser={currentUser}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-2 pb-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}