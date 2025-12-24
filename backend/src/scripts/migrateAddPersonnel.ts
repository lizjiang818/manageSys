import db from '../config/database';

/**
 * 数据库迁移脚本：添加personnel字段
 * 如果数据库已经存在但没有personnel字段，运行此脚本添加
 */
function migrateAddPersonnel() {
  try {
    // 检查personnel字段是否已存在
    const tableInfo = db.prepare("PRAGMA table_info(organization_nodes)").all() as Array<{
      cid: number;
      name: string;
      type: string;
      notnull: number;
      dflt_value: any;
      pk: number;
    }>;
    
    const hasPersonnelField = tableInfo.some(col => col.name === 'personnel');
    
    if (hasPersonnelField) {
      console.log('✅ personnel字段已存在，无需迁移');
      return;
    }
    
    // 添加personnel字段
    db.exec('ALTER TABLE organization_nodes ADD COLUMN personnel TEXT NULL');
    console.log('✅ 成功添加personnel字段到organization_nodes表');
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    throw error;
  }
}

// 运行迁移
migrateAddPersonnel();

