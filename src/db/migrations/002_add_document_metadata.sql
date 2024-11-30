-- Up Migration
ALTER TABLE documents ADD COLUMN size INTEGER;
ALTER TABLE documents ADD COLUMN description TEXT;
ALTER TABLE documents ADD COLUMN tags TEXT;
ALTER TABLE documents ADD COLUMN last_modified TEXT;
ALTER TABLE documents ADD COLUMN version INTEGER DEFAULT 1;

CREATE INDEX idx_documents_tags ON documents(tags);
CREATE INDEX idx_documents_last_modified ON documents(last_modified);

-- Down Migration
DROP INDEX IF EXISTS idx_documents_tags;
DROP INDEX IF EXISTS idx_documents_last_modified;

ALTER TABLE documents DROP COLUMN size;
ALTER TABLE documents DROP COLUMN description;
ALTER TABLE documents DROP COLUMN tags;
ALTER TABLE documents DROP COLUMN last_modified;
ALTER TABLE documents DROP COLUMN version;