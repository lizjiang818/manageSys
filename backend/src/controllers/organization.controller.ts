import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { ExcelParserService } from '../services/excelParser.service';
import * as fs from 'fs';
import * as path from 'path';

export class OrganizationController {
  /**
   * 上传并解析Excel文件
   */
  static async uploadExcel(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请上传Excel文件'
        });
      }
      
      const filePath = req.file.path;
      
      try {
        // 解析Excel
        const nodes = ExcelParserService.parseExcel(filePath);
        
        // 验证数据
        ExcelParserService.validateNodes(nodes);
        
        // 更新数据库
        const count = OrganizationService.updateFromNodes(nodes);
        
        // 删除临时文件
        fs.unlinkSync(filePath);
        
        res.json({
          success: true,
          message: '组织架构更新成功',
          data: {
            totalNodes: count,
            nodes: nodes.length
          }
        });
      } catch (error: any) {
        // 删除临时文件
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw error;
      }
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '文件解析失败'
      });
    }
  }
  
  /**
   * 获取组织架构树
   */
  static async getTree(req: Request, res: Response) {
    try {
      const tree = OrganizationService.getTree();
      
      if (!tree) {
        return res.json({
          success: true,
          message: '暂无组织架构数据',
          data: null
        });
      }
      
      res.json({
        success: true,
        data: tree
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取组织架构失败'
      });
    }
  }
  
  /**
   * 获取所有节点（扁平结构）
   */
  static async getAllNodes(req: Request, res: Response) {
    try {
      const nodes = OrganizationService.getAllNodes();
      res.json({
        success: true,
        data: nodes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取节点列表失败'
      });
    }
  }
  
  /**
   * 获取单个节点详情
   */
  static async getNodeById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const node = OrganizationService.getNodeById(id);
      
      if (!node) {
        return res.status(404).json({
          success: false,
          message: '节点不存在'
        });
      }
      
      res.json({
        success: true,
        data: node
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取节点详情失败'
      });
    }
  }
}

