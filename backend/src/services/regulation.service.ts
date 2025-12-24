import { RegulationFileModel, RegulationFile, RegulationFileInput } from '../models/RegulationFile';
import * as fs from 'fs';
import * as path from 'path';

export class RegulationService {
  /**
   * 保存文件信息
   */
  static saveFile(input: RegulationFileInput): RegulationFile {
    return RegulationFileModel.create(input);
  }

  /**
   * 获取部门文件列表
   */
  static getFilesByDepartment(department: string): RegulationFile[] {
    return RegulationFileModel.findByDepartment(department);
  }

  /**
   * 根据ID获取文件
   */
  static getFileById(id: number): RegulationFile | null {
    return RegulationFileModel.findById(id);
  }

  /**
   * 删除文件
   */
  static deleteFile(id: number): boolean {
    const file = RegulationFileModel.findById(id);
    if (!file) {
      return false;
    }

    // 删除物理文件
    try {
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }
    } catch (error) {
      console.error('删除物理文件失败:', error);
    }

    // 删除数据库记录
    return RegulationFileModel.deleteById(id);
  }

  /**
   * 验证部门名称
   */
  static isValidDepartment(department: string): boolean {
    const validDepartments = ['方丈办公室', '维那', '监院一', '监院二', '监院三', '管理办法'];
    return validDepartments.includes(department);
  }
}

