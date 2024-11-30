import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CategoryFormProps {
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  level?: number;
  placeholder?: string;
}

export function CategoryForm({ onSubmit, onCancel, level = 0, placeholder = "Nouvelle catégorie..." }: CategoryFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex gap-2 mt-2"
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
      />
      <button
        type="submit"
        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-1" />
        Ajouter
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Annuler
        </button>
      )}
    </form>
  );
}