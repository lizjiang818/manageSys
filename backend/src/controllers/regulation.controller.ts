import { Request, Response } from 'express';
import { RegulationService } from '../services/regulation.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 修复文件名编码问题
 * 处理 multipart/form-data 中可能出现的编码问题
 * 当 UTF-8 编码的文件名被错误地解释为 Latin1 时，会出现乱码
 * 
 * 修复原理：如果 UTF-8 字符串被当作 Latin1 读取，可以通过以下方式修复：
 * 1. 将字符串按 Latin1 编码成 Buffer
 * 2. 将 Buffer 按 UTF-8 解码
 */
function fixFileNameEncoding(fileName: string): string {
  try {
    // 如果文件名只包含 ASCII 字符，不需要修复
    if (/^[\x00-\x7F]*$/.test(fileName)) {
      return fileName;
    }
    
    // 检查是否包含常见的乱码字符模式（UTF-8 被错误解释为 Latin1 时的典型特征）
    const garbledPatterns = [
      /æ|ä|å|ç|®|¡|º|¦|Ã|©|§|¨|«|¬|¯|°|±|²|³|´|µ|¶|·|¸|¹|»|¼|½|¾|¿|–|‡|»|¶|¡|ç|†|å|Š|ž|³/g,
    ];
    
    const hasGarbledChars = garbledPatterns.some(pattern => pattern.test(fileName));
    
    // 如果文件名包含中文字符但看起来正常，不需要修复
    const hasValidChinese = /[\u4e00-\u9fa5]/.test(fileName) && !hasGarbledChars;
    if (hasValidChinese) {
      return fileName;
    }
    
    if (hasGarbledChars) {
      // 尝试修复：将字符串按 Latin1 编码转换为 Buffer，然后按 UTF-8 解码
      try {
        // 将当前字符串（可能是被错误解释的）按 Latin1 编码成 Buffer
        // 然后按 UTF-8 解码，这样就能恢复原始的 UTF-8 字符串
        const buffer = Buffer.from(fileName, 'latin1');
        const fixed = buffer.toString('utf8');
        
        // 验证修复结果：检查是否包含有效的中文字符，或者不再包含乱码字符
        const hasChinese = /[\u4e00-\u9fa5]/.test(fixed);
        const stillGarbled = garbledPatterns.some(p => p.test(fixed));
        
        if (hasChinese || (!stillGarbled && fixed.length > 0)) {
          console.log('文件名编码已修复:', { original: fileName, fixed });
          return fixed;
        }
      } catch (e) {
        // 修复失败，返回原文件名
        console.warn('文件名编码修复失败:', e);
      }
    }
    
    // 如果文件名看起来正常（包含中文字符且没有乱码），直接返回
    const hasChinese = /[\u4e00-\u9fa5]/.test(fileName);
    if (hasChinese && !hasGarbledChars) {
      return fileName;
    }
    
    // 其他情况返回原文件名
    return fileName;
  } catch (error) {
    // 如果处理失败，返回原文件名
    console.warn('文件名编码处理出错:', error);
    return fileName;
  }
}

export class RegulationController {
  /**
   * 上传文件
   */
  static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请上传文件'
        });
      }

      const { department } = req.body;
      
      if (!department) {
        // 删除已上传的文件
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: '请指定部门'
        });
      }

      if (!RegulationService.isValidDepartment(department)) {
        // 删除已上传的文件
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: '无效的部门名称'
        });
      }

      if (!req.userId) {
        // 删除已上传的文件
        fs.unlinkSync(req.file.path);
        return res.status(401).json({
          success: false,
          message: '未授权'
        });
      }

      // 创建部门目录
      const departmentDir = path.join(path.dirname(req.file.path), 'regulations', department);
      if (!fs.existsSync(departmentDir)) {
        fs.mkdirSync(departmentDir, { recursive: true });
      }

      // 修复文件名编码问题
      const fixedOriginalName = fixFileNameEncoding(req.file.originalname);
      
      // 调试日志（生产环境可以移除）
      if (req.file.originalname !== fixedOriginalName) {
        console.log('文件名编码已修复:', {
          original: req.file.originalname,
          fixed: fixedOriginalName
        });
      }
      
      // 移动文件到部门目录
      // 使用修复后的文件名，文件系统应该支持 UTF-8 文件名
      const newFileName = `${Date.now()}-${fixedOriginalName}`;
      const newFilePath = path.join(departmentDir, newFileName);
      fs.renameSync(req.file.path, newFilePath);

      // 保存文件信息到数据库
      const fileRecord = RegulationService.saveFile({
        department: department as any,
        file_name: newFileName,
        original_name: fixedOriginalName,
        file_path: newFilePath,
        file_size: req.file.size,
        file_type: req.file.mimetype || path.extname(fixedOriginalName),
        uploaded_by: req.userId
      });

      res.json({
        success: true,
        message: '文件上传成功',
        data: fileRecord
      });
    } catch (error: any) {
      // 如果文件已上传，删除它
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          console.error('删除文件失败:', e);
        }
      }

      res.status(400).json({
        success: false,
        message: error.message || '文件上传失败'
      });
    }
  }

  /**
   * 获取部门文件列表
   */
  static async getFilesByDepartment(req: Request, res: Response) {
    try {
      const { department } = req.params;

      if (!RegulationService.isValidDepartment(department)) {
        return res.status(400).json({
          success: false,
          message: '无效的部门名称'
        });
      }

      const files = RegulationService.getFilesByDepartment(department);

      res.json({
        success: true,
        data: files
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '获取文件列表失败'
      });
    }
  }

  /**
   * 在线查看文件
   */
  static async viewFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileId = parseInt(id, 10);

      if (isNaN(fileId)) {
        return res.status(400).json({
          success: false,
          message: '无效的文件ID'
        });
      }

      const file = RegulationService.getFileById(fileId);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: '文件不存在'
        });
      }

      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({
          success: false,
          message: '文件不存在'
        });
      }

      // 根据文件类型设置Content-Type
      let contentType = 'application/octet-stream';
      const ext = path.extname(file.original_name).toLowerCase();
      if (ext === '.pdf') {
        contentType = 'application/pdf';
      } else if (ext === '.doc') {
        contentType = 'application/msword';
      } else if (ext === '.docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === '.xls') {
        contentType = 'application/vnd.ms-excel';
      } else if (ext === '.xlsx') {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      // 设置响应头 - 使用inline让浏览器尝试在线打开
      // 对于PDF，浏览器通常可以内嵌显示
      // 对于Word/Excel，浏览器可能会下载，但至少会尝试打开
      res.setHeader('Content-Type', contentType);
      
      // 只设置inline，不设置filename，让浏览器直接打开而不是下载
      res.setHeader('Content-Disposition', 'inline');
      
      // 添加缓存控制，避免浏览器缓存问题
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // 添加X-Content-Type-Options，防止浏览器MIME类型嗅探
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // 发送文件
      res.sendFile(path.resolve(file.file_path));
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '查看文件失败'
      });
    }
  }

  /**
   * 下载文件
   */
  static async downloadFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileId = parseInt(id, 10);

      if (isNaN(fileId)) {
        return res.status(400).json({
          success: false,
          message: '无效的文件ID'
        });
      }

      const file = RegulationService.getFileById(fileId);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: '文件不存在'
        });
      }

      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({
          success: false,
          message: '文件不存在'
        });
      }

      // 设置响应头
      // 使用 RFC 5987 格式支持中文文件名
      // 同时提供两种格式以确保兼容性
      const encodedFilename = encodeURIComponent(file.original_name);
      // 对于ASCII字符，直接使用；对于非ASCII字符，使用RFC 5987格式
      const asciiFilename = file.original_name.replace(/[^\x00-\x7F]/g, ''); // 移除非ASCII字符
      const hasNonAscii = /[^\x00-\x7F]/.test(file.original_name);
      
      if (hasNonAscii) {
        // 包含非ASCII字符，使用RFC 5987格式
        res.setHeader('Content-Disposition', `attachment; filename="${asciiFilename || 'file'}"; filename*=UTF-8''${encodedFilename}`);
      } else {
        // 纯ASCII字符，直接使用
        res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
      }
      res.setHeader('Content-Type', 'application/octet-stream');

      // 发送文件
      res.sendFile(path.resolve(file.file_path));
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '下载文件失败'
      });
    }
  }

  /**
   * 删除文件
   */
  static async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileId = parseInt(id, 10);

      if (isNaN(fileId)) {
        return res.status(400).json({
          success: false,
          message: '无效的文件ID'
        });
      }

      const success = RegulationService.deleteFile(fileId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: '文件不存在'
        });
      }

      res.json({
        success: true,
        message: '文件删除成功'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '删除文件失败'
      });
    }
  }
}

