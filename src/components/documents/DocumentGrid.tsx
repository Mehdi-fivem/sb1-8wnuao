import React from 'react';
import { Document, Category } from '../../types';
import { CategorySection } from './CategorySection';

interface DocumentGridProps {
  documents: Document[];
  categories: Category[];
  onDeleteDocument: (id: string) => void;
  onViewDocument: (document: Document) => void;
  currentUser: { role: string; permissions: { documents: { delete: boolean } } };
}

export function DocumentGrid({ documents, categories, onDeleteDocument, onViewDocument, currentUser }: DocumentGridProps) {
  // Grouper les documents par catégorie
  const documentsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = documents.filter(doc => doc.category === category.name);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <CategorySection
          key={category.id}
          category={category}
          documents={documentsByCategory[category.name] || []}
          onDeleteDocument={onDeleteDocument}
          onViewDocument={onViewDocument}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}