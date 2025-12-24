import db from '../config/database';

export interface RegulationFile {
  id: number;
  department: '方丈办公室' | '维那' | '监院一' | '监院二' | '监院三' | '管理办法';
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface RegulationFileInput {
  department: '方丈办公室' | '维那' | '监院一' | '监院二' | '监院三' | '管理办法';
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
}

export class RegulationFileModel {
  /**
   * 创建文件记录
   */
  static create(input: RegulationFileInput): RegulationFile {
    const result = db.prepare(`
      INSERT INTO regulation_files (department, file_name, original_name, file_path, file_size, file_type, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      input.department,
      input.file_name,
      input.original_name,
      input.file_path,
      input.file_size,
      input.file_type,
      input.uploaded_by
    );

    const file = this.findById(result.lastInsertRowid as number);
    if (!file) {
      throw new Error('创建文件记录失败');
    }
    return file;
  }

  /**
   * 根据ID查找文件
   */
  static findById(id: number): RegulationFile | null {
    const file = db.prepare('SELECT * FROM regulation_files WHERE id = ?').get(id) as RegulationFile | undefined;
    return file || null;
  }

  /**
   * 根据部门查找文件列表
   */
  static findByDepartment(department: string): RegulationFile[] {
    const files = db.prepare(`
      SELECT * FROM regulation_files 
      WHERE department = ? 
      ORDER BY created_at DESC
    `).all(department) as RegulationFile[];
    return files;
  }

  /**
   * 删除文件记录
   */
  static deleteById(id: number): boolean {
    const result = db.prepare('DELETE FROM regulation_files WHERE id = ?').run(id);
    return result.changes > 0;
  }

  /**
   * 获取所有文件
   */
  static findAll(): RegulationFile[] {
    const files = db.prepare('SELECT * FROM regulation_files ORDER BY created_at DESC').all() as RegulationFile[];
    return files;
  }
}

