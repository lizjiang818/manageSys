import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(__dirname, '../../database/temple.db');
const initSqlPath = path.join(__dirname, '../../database/init.sql');

// 确保数据库目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
const db: Database.Database = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 初始化数据库表
if (fs.existsSync(initSqlPath)) {
  const initSql = fs.readFileSync(initSqlPath, 'utf-8');
  db.exec(initSql);
  console.log('数据库初始化完成');
}

// 执行迁移（如果需要）
// 使用立即执行函数避免循环依赖
(function() {
  try {
    // 直接执行迁移逻辑，避免循环依赖
    const tableInfo = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='regulation_files'
    `).get() as { name: string } | undefined;

    if (!tableInfo) {
      return; // 表不存在，将在初始化时创建
    }

    // 检查当前约束是否包含"管理办法"
    const tableSchema = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='regulation_files'
    `).get() as { sql: string } | undefined;

    if (tableSchema && tableSchema.sql.includes("'管理办法'")) {
      return; // 已包含"管理办法"，无需迁移
    }

    console.log('开始迁移 regulation_files 表以支持"管理办法"...');

    // 创建临时表保存数据
    db.exec(`
      CREATE TABLE IF NOT EXISTS regulation_files_backup AS 
      SELECT * FROM regulation_files;
    `);

    // 删除旧表
    db.exec('DROP TABLE IF EXISTS regulation_files;');

    // 重新创建表（包含新的约束）
    db.exec(`
      CREATE TABLE regulation_files (
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
    `);

    // 恢复数据
    db.exec(`
      INSERT INTO regulation_files 
      SELECT * FROM regulation_files_backup 
      WHERE department IN ('方丈办公室', '维那', '监院一', '监院二', '监院三', '管理办法');
    `);

    // 删除备份表
    db.exec('DROP TABLE IF EXISTS regulation_files_backup;');

    // 重新创建索引
    db.exec('CREATE INDEX IF NOT EXISTS idx_department ON regulation_files(department);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_uploaded_by ON regulation_files(uploaded_by);');

    // 重新创建触发器
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_regulation_files_timestamp 
      AFTER UPDATE ON regulation_files
      BEGIN
        UPDATE regulation_files 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = NEW.id;
      END;
    `);

    console.log('regulation_files 表迁移完成');
  } catch (error: any) {
    // 迁移失败不影响启动，只记录日志
    console.warn('数据库迁移执行失败:', error.message || error);
  }
})();

export default db;

