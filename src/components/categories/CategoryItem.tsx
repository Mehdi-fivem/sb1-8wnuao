import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Category, Subcategory } from '../../types';
import { CategoryForm } from './CategoryForm';

interface CategoryItemProps {
  category: Category;
  onAddSubcategory: (categoryId: string, name: string) => void;
  onDeleteSubcategory: (id: string) => void;
  level?: number;
}

export function CategoryItem({ 
  category, 
  onAddSubcategory, 
  onDeleteSubcategory, 
  level = 0 
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubcategory = (name: string) => {
    onAddSubcategory(category.id, name);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <div className="flex items-center space-x-2">
          {category.subcategories.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 dark:text-gray-400"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="text-sm text-gray-900 dark:text-white capitalize">
            {category.name}
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
          title="Ajouter une sous-catégorie"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showAddForm && (
        <div className="ml-8">
          <CategoryForm
            onSubmit={handleAddSubcategory}
            onCancel={() => setShowAddForm(false)}
            placeholder="Nouvelle sous-catégorie..."
          />
        </div>
      )}

      {isExpanded && category.subcategories.length > 0 && (
        <div className="ml-8 space-y-2">
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <span className="text-sm text-gray-900 dark:text-white capitalize">
                {subcategory.name}
              </span>
              <button
                onClick={() => onDeleteSubcategory(subcategory.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                title="Supprimer la sous-catégorie"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}