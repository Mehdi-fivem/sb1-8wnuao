import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, Save } from 'lucide-react';
import { Category } from '../types';

interface DocumentDropZone {
  onSubmit: (name: string, date: string, category: string, file: File) => void;
  onClose: () => void;
  categories: Category[];
}

interface PendingDocument {
  file: File;
  name: string;
  category: string;
  date: string;
}

export function DocumentDropZone({ onSubmit, onClose, categories }: DocumentDropZone) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const detectDocumentType = (fileName: string): string => {
    const lowerFileName = fileName.toLowerCase();
    
    const categoryMappings: Record<string, string[]> = {
      'administrative': ['contrat', 'attestation', 'certificat', 'formulaire', 'admin'],
      'financial': ['facture', 'devis', 'budget', 'finance', 'comptable'],
      'personal': ['cv', 'lettre', 'motivation', 'personnel'],
      'professional': ['rapport', 'presentation', 'projet', 'reunion', 'professionnel'],
    };

    for (const [category, keywords] of Object.entries(categoryMappings)) {
      if (keywords.some(keyword => lowerFileName.includes(keyword))) {
        return category;
      }
    }

    return 'other';
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadErrors([]);
    const errors: string[] = [];

    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      // Vérification du type de fichier
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Type de fichier non supporté`);
        continue;
      }

      // Vérification de la taille (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: Fichier trop volumineux (max 10MB)`);
        continue;
      }

      const category = detectDocumentType(file.name);
      const date = new Date().toISOString().split('T')[0];
      
      setPendingDocuments(prev => [...prev, {
        file,
        name: file.name,
        category,
        date
      }]);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
    }
  }, []);

  const handleSaveDocument = (doc: PendingDocument) => {
    try {
      onSubmit(doc.name, doc.date, doc.category, doc.file);
      setUploadedFiles(prev => [...prev, doc.name]);
      setPendingDocuments(prev => prev.filter(d => d !== doc));
    } catch (error) {
      setUploadErrors(prev => [...prev, `Erreur lors de l'enregistrement de ${doc.name}`]);
    }
  };

  const handleRemovePending = (index: number) => {
    setPendingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePendingDocument = (index: number, updates: Partial<PendingDocument>) => {
    setPendingDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, ...updates } : doc
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Importer des documents
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className={`h-12 w-12 ${
                isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
              }`} />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">
                  Glissez et déposez vos documents ici
                </p>
                <p className="mt-1">
                  PDF, PNG, JPG jusqu'à 10MB
                </p>
              </div>
            </div>
          </div>

          {pendingDocuments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Documents en attente d'enregistrement
              </h3>
              <div className="space-y-4">
                {pendingDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePending(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Libellé
                        </label>
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => handleUpdatePendingDocument(index, { name: e.target.value })}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={doc.category}
                          onChange={(e) => handleUpdatePendingDocument(index, { category: e.target.value })}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSaveDocument(doc)}
                          className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Fichiers importés avec succès :
              </h3>
              <ul className="list-disc list-inside text-sm text-green-600 dark:text-green-400">
                {uploadedFiles.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}

          {uploadErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Erreurs d'import
                </h3>
              </div>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}