import { v4 as uuidv4 } from 'uuid';
import db from '../../db/config/database';
import { Category, Subcategory } from '../../types';

export const categoryService = {
  createCategory: (name: string): Category => {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO categories (id, name, created_at)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, name.toLowerCase(), createdAt);

    return {
      id,
      name: name.toLowerCase(),
      createdAt,
      subcategories: []
    };
  },

  createSubcategory: (name: string, categoryId: string): Subcategory => {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO subcategories (id, name, category_id, created_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, name.toLowerCase(), categoryId, createdAt);

    return {
      id,
      name: name.toLowerCase(),
      categoryId,
      createdAt
    };
  },

  getAllCategories: (): Category[] => {
    const categories = db.prepare(`
      SELECT * FROM categories ORDER BY name
    `).all() as any[];

    const subcategories = db.prepare(`
      SELECT * FROM subcategories ORDER BY name
    `).all() as any[];

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      createdAt: cat.created_at,
      subcategories: subcategories
        .filter(sub => sub.category_id === cat.id)
        .map(sub => ({
          id: sub.id,
          name: sub.name,
          categoryId: sub.category_id,
          createdAt: sub.created_at
        }))
    }));
  },

  deleteCategory: (id: string): void => {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    stmt.run(id);
  },

  deleteSubcategory: (id: string): void => {
    const stmt = db.prepare('DELETE FROM subcategories WHERE id = ?');
    stmt.run(id);
  }
};

export default categoryService;