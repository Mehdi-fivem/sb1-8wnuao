import React from 'react';
import { Category } from '../../types';
import { CategoryItem } from './CategoryItem';

interface CategoryTreeProps {
  categories: Category[];
  onAddSubcategory: (categoryId: string, name: string) => void;
  onDeleteSubcategory: (id: string) => void;
}

export function CategoryTree({ 
  categories, 
  onAddSubcategory, 
  onDeleteSubcategory 
}: CategoryTreeProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onAddSubcategory={onAddSubcategory}
          onDeleteSubcategory={onDeleteSubcategory}
        />
      ))}
    </div>
  );
}