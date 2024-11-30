import { Category } from '../../../types';

export function buildCategoryTree(categories: any[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // First pass: Create category objects
  categories.forEach(cat => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      parentId: cat.parent_id,
      createdAt: cat.created_at,
      subcategories: []
    });
  });

  // Second pass: Build tree structure
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parent_id) {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.subcategories!.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}