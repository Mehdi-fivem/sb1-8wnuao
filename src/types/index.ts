export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  email: string;
  createdAt: string;
  lastLogin: string;
  profilePhoto?: string;
  permissions: UserPermissions;
}

export interface UserPermissions {
  documents: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  settings: {
    view: boolean;
    manage: boolean;
  };
  dashboard: {
    view: boolean;
  };
  logs: {
    view: boolean;
  };
}

export interface Document {
  id: string;
  name: string;
  date: string;
  categoryId: string;
  subcategoryId?: string;
  file: File | null;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'document' | 'user' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  createdBy: string;
}

export interface NotificationSettings {
  documents: boolean;
  userActivity: boolean;
  systemUpdates: boolean;
}

export interface Log {
  id: string;
  type: 'error' | 'warning' | 'info';
  action: string;
  message: string;
  timestamp: string;
  userId: string;
  details?: string;
}