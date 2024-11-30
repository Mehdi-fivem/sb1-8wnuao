import { dbService } from '../services/database.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import pool from '../config/database';

async function syncDatabase() {
  try {
    console.log('🔄 Synchronisation de la base de données...');

    // Lecture du fichier de schéma
    const schema = readFileSync(join(process.cwd(), 'src/db/migrations/schema.sql'), 'utf8');
    const statements = schema.split(';').filter(statement => statement.trim());

    const connection = await pool.getConnection();
    
    try {
      // Exécution des requêtes de création de schéma
      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
          console.log('✅ Exécution réussie:', statement.slice(0, 50) + '...');
        }
      }

      console.log('✨ Synchronisation terminée avec succès!');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

// Exécution de la synchronisation
syncDatabase();