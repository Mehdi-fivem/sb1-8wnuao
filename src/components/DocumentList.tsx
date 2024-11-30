import React, { useState } from 'react';
import { Search, Calendar, Filter, Upload } from 'lucide-react';
import { Document, Category } from '../types';
import { DocumentViewer } from './DocumentViewer';
import { DocumentForm } from './DocumentForm';
import { DocumentDropZone } from './DocumentDropZone';
import { DocumentGrid } from './documents/DocumentGrid';

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (id: string) => void;
  onAddDocument: (name: string, date: string, category: string, file: File) => void;
  currentUser: { role: string; permissions: { documents: { delete: boolean } } };
  categories: Category[];
}

export function DocumentList({ documents, onDeleteDocument, onAddDocument, currentUser, categories }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || doc.date === dateFilter;
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    const matchesType = !typeFilter || doc.fileType.includes(typeFilter);
    return matchesSearch && matchesDate && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec les boutons d'action */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Documents</h2>
        <div className="flex items-center space-x-2">
          {(currentUser?.permissions.documents.create || currentUser?.role === 'admin') && (
            <button
              onClick={() => setShowDropZone(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer des documents
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <DocumentForm
          onSubmit={(name, date, category, file) => {
            onAddDocument(name, date, category, file);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
          categories={categories}
        />
      )}

      {showDropZone && (
        <DocumentDropZone
          onSubmit={onAddDocument}
          onClose={() => setShowDropZone(false)}
          categories={categories}
        />
      )}

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="">Tous les types</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <DocumentGrid
        documents={filteredDocuments}
        categories={categories}
        onDeleteDocument={onDeleteDocument}
        onViewDocument={setSelectedDocument}
        currentUser={currentUser}
      />

      {/* Visualiseur de document */}
      {selectedDocument && (
        <DocumentViewer
          fileUrl={selectedDocument.fileUrl}
          fileType={selectedDocument.fileType}
          name={selectedDocument.name}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}