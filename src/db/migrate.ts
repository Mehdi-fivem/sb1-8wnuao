import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './config/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function runMigrations() {
  try {
    console.log('🔄 Exécution des migrations...');

    // Create migrations table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get executed migrations
    const executedMigrations = new Set(
      db.prepare('SELECT name FROM migrations').all().map((row: any) => row.name)
    );

    // Read migration files
    const migrationsDir = join(__dirname, 'migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Begin transaction
    const transaction = db.transaction(() => {
      for (const file of migrationFiles) {
        if (!executedMigrations.has(file)) {
          const migration = readFileSync(join(migrationsDir, file), 'utf8');
          const statements = migration.split(';').filter(stmt => stmt.trim());

          for (const statement of statements) {
            if (statement.trim()) {
              db.prepare(statement).run();
            }
          }

          db.prepare(
            'INSERT INTO migrations (name) VALUES (?)'
          ).run(file);

          console.log(`✅ Migration exécutée: ${file}`);
        }
      }
    });

    // Execute transaction
    transaction();

    console.log('✨ Migrations terminées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();