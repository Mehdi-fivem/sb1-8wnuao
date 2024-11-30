import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { User, Document, Category, Notification, Log } from '../types';

class DatabaseService {
  // Utilisateurs
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const connection = await pool.getConnection();
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await connection.execute(
        'INSERT INTO users (id, username, password, email, role, profile_photo, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          user.username,
          hashedPassword,
          user.email,
          user.role,
          user.profilePhoto,
          JSON.stringify(user.permissions)
        ]
      );

      return { ...user, id };
    } finally {
      connection.release();
    }
  }

  async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!Array.isArray(rows) || rows.length === 0) return null;

      const user = rows[0] as any;
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) return null;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePhoto: user.profile_photo,
        permissions: JSON.parse(user.permissions),
        createdAt: user.created_at,
        lastLogin: user.last_login,
        password: '' // Ne pas renvoyer le mot de passe
      };
    } finally {
      connection.release();
    }
  }

  // Documents
  async createDocument(document: Document): Promise<Document> {
    const connection = await pool.getConnection();
    try {
      const id = uuidv4();
      await connection.execute(
        'INSERT INTO documents (id, name, date, category_id, file_url, file_type, file_size, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          document.name,
          document.date,
          document.category,
          document.fileUrl,
          document.fileType,
          document.file?.size || 0,
          document.userId
        ]
      );

      return { ...document, id };
    } finally {
      connection.release();
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM documents ORDER BY upload_date DESC');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        date: row.date,
        category: row.category_id,
        fileUrl: row.file_url,
        fileType: row.file_type,
        uploadDate: row.upload_date,
        userId: row.user_id,
        file: null
      }));
    } finally {
      connection.release();
    }
  }

  // Catégories
  async getAllCategories(): Promise<Category[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM categories ORDER BY name');
      return (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        createdAt: row.created_at
      }));
    } finally {
      connection.release();
    }
  }

  // Notifications
  async createNotification(notification: Notification): Promise<Notification> {
    const connection = await pool.getConnection();
    try {
      const id = uuidv4();
      await connection.execute(
        'INSERT INTO notifications (id, type, title, message, user_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id,
          notification.type,
          notification.title,
          notification.message,
          notification.userId,
          notification.createdBy
        ]
      );

      return { ...notification, id };
    } finally {
      connection.release();
    }
  }

  // Logs
  async createLog(log: Log): Promise<Log> {
    const connection = await pool.getConnection();
    try {
      const id = uuidv4();
      await connection.execute(
        'INSERT INTO logs (id, type, action, message, details, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id,
          log.type,
          log.action,
          log.message,
          log.details,
          log.userId
        ]
      );

      return { ...log, id };
    } finally {
      connection.release();
    }
  }
}

export const dbService = new DatabaseService();
export default dbService;