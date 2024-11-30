import React from 'react';
import { CategoryForm } from '../categories/CategoryForm';
import { CategoryTree } from '../categories/CategoryTree';
import { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, parentId?: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManager({ categories, onAddCategory, onDeleteCategory }: CategoryManagerProps) {
  return (
    <div className="space-y-4">
      <CategoryForm onSubmit={(name) => onAddCategory(name)} />
      <CategoryTree
        categories={categories}
        onAddSubcategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
}