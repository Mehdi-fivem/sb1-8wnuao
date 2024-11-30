import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './config/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateSchema() {
  try {
    console.log('🔄 Génération du schéma de la base de données...');

    // Read all migration files
    const migrationsDir = join(__dirname, 'migrations');
    const schemaFile = readFileSync(join(migrationsDir, '001_initial_schema.sql'), 'utf8');
    const subcategoriesFile = readFileSync(join(migrationsDir, '004_add_subcategories.sql'), 'utf8');

    // Combine all schema definitions
    const fullSchema = `
-- Schema de la base de données GDocs
-- Généré automatiquement le ${new Date().toISOString()}

${schemaFile}

${subcategoriesFile}
    `.trim();

    // Write schema to file
    const outputPath = join(process.cwd(), 'schema.sql');
    const fs = require('fs');
    fs.writeFileSync(outputPath, fullSchema);

    console.log('✨ Schéma généré avec succès!');
    console.log(`📄 Le fichier schema.sql a été créé dans: ${outputPath}`);
    
    // Display usage instructions
    console.log('\nPour utiliser ce schéma sur un nouveau serveur:');
    console.log('1. Copiez le fichier schema.sql sur le serveur');
    console.log('2. Connectez-vous à votre base de données');
    console.log('3. Exécutez la commande: source schema.sql');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du schéma:', error);
    process.exit(1);
  }
}

// Generate schema
generateSchema();