-- Création de la base de données
CREATE DATABASE IF NOT EXISTS gdocs;
USE gdocs;

-- Table des utilisateurs
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  permissions JSON NOT NULL
);

-- Table des catégories
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents
CREATE TABLE documents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size BIGINT NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('document', 'user', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  user_id VARCHAR(36) NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des logs
CREATE TABLE logs (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('error', 'warning', 'info') NOT NULL,
  action VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created_by ON notifications(created_by);
CREATE INDEX idx_logs_type ON logs(type);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);

-- Insertion des catégories par défaut
INSERT INTO categories (id, name) VALUES
  (UUID(), 'administrative'),
  (UUID(), 'financial'),
  (UUID(), 'personal'),
  (UUID(), 'professional'),
  (UUID(), 'other');

-- Insertion de l'utilisateur admin par défaut
INSERT INTO users (id, username, password, email, role, permissions) VALUES (
  UUID(),
  'admin',
  'admin123', -- À remplacer par un hash en production
  'admin@example.com',
  'admin',
  '{
    "documents": {"view": true, "create": true, "edit": true, "delete": true},
    "users": {"view": true, "create": true, "edit": true, "delete": true},
    "settings": {"view": true, "manage": true},
    "dashboard": {"view": true},
    "logs": {"view": true}
  }'
);