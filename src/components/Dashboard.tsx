import React from 'react';
import { FileText, Users, FolderOpen, BarChart2, HardDrive, AlertCircle } from 'lucide-react';
import { Document, User, Log } from '../types';

interface DashboardProps {
  documents: Document[];
  users: User[];
  logs: Log[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function Dashboard({ documents, users, logs }: DashboardProps) {
  // Calcul des statistiques
  const totalDocuments = documents.length;
  const totalUsers = users.length;
  const totalAdmins = users.filter(user => user.role === 'admin').length;

  // Calcul de la taille totale des fichiers
  const totalStorage = documents.reduce((total, doc) => {
    if (doc.file) {
      return total + doc.file.size;
    }
    return total;
  }, 0);

  // Calcul de la taille des logs (estimation : 1Ko par log)
  const logsStorage = logs.length * 1024; // 1Ko par log

  // Statistiques par catégorie
  const documentsByCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par type de fichier
  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.fileType.split('/')[1]?.toUpperCase() || 'AUTRE';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte statistique - Total Documents */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDocuments}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Carte statistique - Total Utilisateurs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Utilisateurs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">dont {totalAdmins} admin(s)</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Carte statistique - Stockage utilisé */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stockage utilisé</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatFileSize(totalStorage)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(totalStorage / (1024 * 1024 * 1024)).toFixed(2)}% utilisé
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <HardDrive className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Carte statistique - Stockage des logs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stockage des logs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatFileSize(logsStorage)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {logs.length} entrées
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Carte statistique - Types de fichiers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Types de fichiers</p>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <BarChart2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(documentsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">{type}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carte statistique - Documents par catégorie */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents par catégorie</p>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(documentsByCategory).map(([category, count]) => (
            <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{category}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">documents</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}