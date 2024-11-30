import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { Category } from '../../types';

export const categoryService = {
  createCategory: (name: string, parentId?: string): Category => {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO categories (id, name, parent_id, created_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, name.toLowerCase(), parentId || null, createdAt);

    return {
      id,
      name: name.toLowerCase(),
      parentId,
      createdAt,
      subcategories: []
    };
  },

  getAllCategories: (): Category[] => {
    const stmt = db.prepare(`
      SELECT c.*, p.name as parent_name 
      FROM categories c 
      LEFT JOIN categories p ON c.parent_id = p.id
      ORDER BY c.name
    `);

    const categories = stmt.all() as any[];
    return buildCategoryTree(categories);
  },

  deleteCategory: (id: string): void => {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    stmt.run(id);
  }
};

function buildCategoryTree(categories: any[]): Category[] {
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

export default categoryService;