import { User, Document, Category, Notification, Log } from '../types';
import { generateMockDocuments } from './mockData';

const STORAGE_KEYS = {
  USERS: 'app_users',
  DOCUMENTS: 'app_documents',
  CATEGORIES: 'app_categories',
  NOTIFICATIONS: 'app_notifications',
  LOGS: 'app_logs'
};

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const dbService = {
  // Users
  createUser: (user: User) => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    users.push(user);
    setStorageItem(STORAGE_KEYS.USERS, users);
    return user;
  },

  updateUser: (userData: Partial<User> & { id: string }) => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === userData.id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...userData };
    setStorageItem(STORAGE_KEYS.USERS, users);
    return users[index];
  },

  deleteUser: (id: string) => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const filteredUsers = users.filter(u => u.id !== id);
    setStorageItem(STORAGE_KEYS.USERS, filteredUsers);
  },

  getAllUsers: () => {
    return getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
  },

  getUserByCredentials: (username: string, password: string) => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    return users.find(u => u.username === username && u.password === password) || null;
  },

  // Documents
  createDocument: (document: Document) => {
    const documents = getStorageItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
    documents.push(document);
    setStorageItem(STORAGE_KEYS.DOCUMENTS, documents);
    return document;
  },

  updateDocument: (document: Partial<Document> & { id: string }) => {
    const documents = getStorageItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
    const index = documents.findIndex(d => d.id === document.id);
    if (index === -1) return null;

    documents[index] = { ...documents[index], ...document };
    setStorageItem(STORAGE_KEYS.DOCUMENTS, documents);
    return documents[index];
  },

  deleteDocument: (id: string) => {
    const documents = getStorageItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
    const filteredDocuments = documents.filter(d => d.id !== id);
    setStorageItem(STORAGE_KEYS.DOCUMENTS, filteredDocuments);
  },

  getAllDocuments: () => {
    return getStorageItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  },

  // Categories
  createCategory: (category: Category) => {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    categories.push(category);
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  deleteCategory: (id: string) => {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const filteredCategories = categories.filter(c => c.id !== id);
    setStorageItem(STORAGE_KEYS.CATEGORIES, filteredCategories);
  },

  getAllCategories: () => {
    return getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  },

  // Notifications
  createNotification: (notification: Notification) => {
    const notifications = getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.unshift(notification);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return notification;
  },

  markNotificationAsRead: (id: string) => {
    const notifications = getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  },

  getAllNotifications: () => {
    return getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  clearAllNotifications: () => {
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // Logs
  createLog: (log: Log) => {
    const logs = getStorageItem<Log[]>(STORAGE_KEYS.LOGS, []);
    logs.unshift(log);
    setStorageItem(STORAGE_KEYS.LOGS, logs);
    return log;
  },

  getAllLogs: () => {
    return getStorageItem<Log[]>(STORAGE_KEYS.LOGS, []);
  },

  clearAllLogs: () => {
    setStorageItem(STORAGE_KEYS.LOGS, []);
  },

  deleteLog: (id: string) => {
    const logs = getStorageItem<Log[]>(STORAGE_KEYS.LOGS, []);
    const filteredLogs = logs.filter(log => log.id !== id);
    setStorageItem(STORAGE_KEYS.LOGS, filteredLogs);
  }
};

// Initialisation des données par défaut
const initDefaultData = () => {
  const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    dbService.createUser({
      id: '1',
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: {
        documents: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, manage: true },
        dashboard: { view: true },
        logs: { view: true }
      }
    });
  }

  const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  if (categories.length === 0) {
    const defaultCategories = [
      { id: '1', name: 'administrative', createdAt: new Date().toISOString() },
      { id: '2', name: 'financial', createdAt: new Date().toISOString() },
      { id: '3', name: 'personal', createdAt: new Date().toISOString() },
      { id: '4', name: 'professional', createdAt: new Date().toISOString() },
      { id: '5', name: 'other', createdAt: new Date().toISOString() }
    ];
    defaultCategories.forEach(category => dbService.createCategory(category));
  }

  const documents = getStorageItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  if (documents.length === 0) {
    const mockDocuments = generateMockDocuments();
    mockDocuments.forEach(document => dbService.createDocument(document));
  }
};

initDefaultData();

export default dbService;