import Database from 'better-sqlite3';
import { User, Document, Category, Notification, Log } from '../types';

const db = new Database('app.db');

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    role TEXT,
    profilePhoto TEXT,
    createdAt TEXT,
    lastLogin TEXT,
    permissions TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    name TEXT,
    date TEXT,
    category TEXT,
    fileUrl TEXT,
    fileType TEXT,
    uploadDate TEXT,
    userId TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    type TEXT,
    title TEXT,
    message TEXT,
    timestamp TEXT,
    read INTEGER,
    userId TEXT,
    createdBy TEXT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (createdBy) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    type TEXT,
    action TEXT,
    message TEXT,
    timestamp TEXT,
    userId TEXT,
    details TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

export const dbService = {
  // Users
  createUser: (user: User) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, username, password, email, role, profilePhoto, createdAt, lastLogin, permissions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
      user.username,
      user.password,
      user.email,
      user.role,
      user.profilePhoto,
      user.createdAt,
      user.lastLogin,
      JSON.stringify(user.permissions)
    );
    return user;
  },

  // ... autres méthodes CRUD similaires pour chaque entité
};

export default dbService;