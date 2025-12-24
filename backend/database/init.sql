-- 组织架构节点表
CREATE TABLE IF NOT EXISTS organization_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('committee', 'position', 'department', 'sub_department')),
    parent_id INTEGER NULL,
    level INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    leader_name TEXT NULL,
    personnel TEXT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES organization_nodes(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_parent_id ON organization_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_level ON organization_nodes(level);
CREATE INDEX IF NOT EXISTS idx_type ON organization_nodes(type);

-- 组织架构变更历史表（可选，用于审计）
CREATE TABLE IF NOT EXISTS organization_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    parent_id INTEGER NULL,
    action TEXT NOT NULL CHECK(action IN ('create', 'update', 'delete', 'move')),
    old_data TEXT NULL,  -- JSON格式存储
    new_data TEXT NULL,  -- JSON格式存储
    operator TEXT NOT NULL DEFAULT 'system',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES organization_nodes(id)
);

-- 创建触发器：自动更新 updated_at
CREATE TRIGGER IF NOT EXISTS update_organization_nodes_timestamp 
AFTER UPDATE ON organization_nodes
BEGIN
    UPDATE organization_nodes 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_role ON users(role);

-- 创建触发器：自动更新 users 表的 updated_at
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- 规范管理文件表
CREATE TABLE IF NOT EXISTS regulation_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL CHECK(department IN ('方丈办公室', '维那', '监院一', '监院二', '监院三', '管理办法')),
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_department ON regulation_files(department);
CREATE INDEX IF NOT EXISTS idx_uploaded_by ON regulation_files(uploaded_by);

-- 创建触发器：自动更新 regulation_files 表的 updated_at
CREATE TRIGGER IF NOT EXISTS update_regulation_files_timestamp 
AFTER UPDATE ON regulation_files
BEGIN
    UPDATE regulation_files 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

