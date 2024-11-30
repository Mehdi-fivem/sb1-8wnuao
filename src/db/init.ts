import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

async function initDatabase() {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🚀 Initializing database...');

    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS gdocs');
    await connection.query('USE gdocs');

    // Read and execute schema
    const schemaPath = join(__dirname, 'migrations', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    try {
      await connection.query(schema);
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    // Create admin user if not exists
    const [adminRows] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (!(adminRows as any[]).length) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminPermissions = {
        documents: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, manage: true },
        dashboard: { view: true },
        logs: { view: true }
      };

      await connection.query(
        'INSERT INTO users (id, username, password, email, role, permissions) VALUES (?, ?, ?, ?, ?, ?)',
        [
          uuidv4(),
          'admin',
          hashedPassword,
          'admin@example.com',
          'admin',
          JSON.stringify(adminPermissions)
        ]
      );
      console.log('✅ Admin user created successfully');
    }

    console.log('✨ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run initialization
initDatabase();