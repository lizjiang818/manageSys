import db from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 迁移 regulation_files 表以支持"管理办法"
 * SQLite 不支持直接修改 CHECK 约束，所以需要重新创建表
 */
function migrateRegulationFiles() {
  try {
    // 检查表是否存在
    const tableInfo = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='regulation_files'
    `).get() as { name: string } | undefined;

    if (!tableInfo) {
      console.log('regulation_files 表不存在，将在初始化时创建');
      return;
    }

    // 检查当前约束是否包含"管理办法"
    const tableSchema = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='regulation_files'
    `).get() as { sql: string } | undefined;

    if (tableSchema && tableSchema.sql.includes("'管理办法'")) {
      console.log('regulation_files 表已包含"管理办法"，无需迁移');
      return;
    }

    console.log('开始迁移 regulation_files 表...');

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

    // 恢复数据（只恢复部门在允许范围内的数据）
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
    console.error('迁移 regulation_files 表失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  migrateRegulationFiles();
  process.exit(0);
}

export { migrateRegulationFiles };

