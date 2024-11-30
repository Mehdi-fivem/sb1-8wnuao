-- Initial schema for SQLite database
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  profile_photo TEXT,
  created_at TEXT NOT NULL,
  last_login TEXT NOT NULL,
  permissions TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  category_id TEXT NOT NULL,
  subcategory_id TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  upload_date TEXT NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  user_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  message TEXT NOT NULL,
  details TEXT,
  timestamp TEXT NOT NULL,
  user_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_subcategory ON documents(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_by ON notifications(created_by);
CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name, created_at) VALUES
  ('1', 'administrative', datetime('now')),
  ('2', 'financial', datetime('now')),
  ('3', 'personal', datetime('now')),
  ('4', 'professional', datetime('now')),
  ('5', 'other', datetime('now'));

-- Insert default admin user
INSERT OR IGNORE INTO users (
  id, 
  username, 
  password, 
  email, 
  role, 
  created_at, 
  last_login, 
  permissions
) VALUES (
  '1',
  'admin',
  '$2a$10$XKkOVL6jT3DQTJjg4YRX2O5p1XK1Q5p5Q5Q5Q5Q5Q5Q5Q5Q5Q5',
  'admin@example.com',
  'admin',
  datetime('now'),
  datetime('now'),
  '{
    "documents": {"view": true, "create": true, "edit": true, "delete": true},
    "users": {"view": true, "create": true, "edit": true, "delete": true},
    "settings": {"view": true, "manage": true},
    "dashboard": {"view": true},
    "logs": {"view": true}
  }'
);