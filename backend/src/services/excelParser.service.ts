import * as XLSX from 'xlsx';
import { OrganizationNode } from '../models/OrganizationNode';

export interface ExcelRow {
  层级?: number | string;
  名称?: string;
  类型?: string;
  负责人?: string;
  父节点?: string;
  排序?: number | string;
  人员?: string;
}

export class ExcelParserService {
  /**
   * 解析人员信息
   * 支持格式：
   * 1. "张三:组长,李四:法务" - 带职位的格式
   * 2. "张三,李四" - 只有姓名，职位为空
   * 3. "张三" - 单个姓名，职位为空
   * 
   * @param personnelStr 人员信息字符串
   * @returns 解析后的人员数组JSON字符串
   */
  private static parsePersonnel(
    personnelStr: string | null | undefined
  ): string | null {
    if (!personnelStr || personnelStr.trim() === '' || personnelStr === '-') {
      return null;
    }

    const personnel = personnelStr.trim();
    const members: Array<{ name: string; position: string | null }> = [];

    // 按逗号分割多个人员（支持中文逗号和英文逗号）
    // 先替换中文逗号为英文逗号，然后分割
    const normalizedPersonnel = personnel.replace(/，/g, ',');
    const personnelList = normalizedPersonnel.split(',').map(p => p.trim()).filter(p => p);

    personnelList.forEach((item) => {
      // 检查是否包含冒号（姓名:职位格式）
      if (item.includes(':')) {
        const [name, position] = item.split(':').map(s => s.trim());
        if (name) {
          members.push({
            name: name || '',
            position: position || null
          });
        }
      } else {
        // 只有姓名，职位为空
        members.push({
          name: item,
          position: null
        });
      }
    });

    return members.length > 0 ? JSON.stringify(members) : null;
  }

  /**
   * 解析Excel文件
   */
  static parseExcel(filePath: string): OrganizationNode[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON数组
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
    
    // 验证数据格式
    if (rows.length === 0) {
      throw new Error('Excel文件为空或格式不正确');
    }
    
    // 转换为组织节点数组
    const nodes: OrganizationNode[] = [];
    const nameToIdMap = new Map<string, number>(); // 用于建立父子关系
    
    rows.forEach((row, index) => {
      const level = Number(row.层级) ?? 0;
      const name = String(row.名称 || '').trim();
      const type = this.mapType(String(row.类型 || '').trim());
      const leaderName = row.负责人 ? String(row.负责人).trim() : null;
      const parentName = row.父节点 ? String(row.父节点).trim() : null;
      const orderIndex = Number(row.排序) || index + 1;
      const personnelStr = row.人员 ? String(row.人员).trim() : null;
      
      if (!name) {
        throw new Error(`第${index + 2}行：名称为空`);
      }
      
      // 解析人员信息为JSON格式
      const personnel = this.parsePersonnel(personnelStr);
      
      const node: OrganizationNode = {
        name,
        type,
        parent_id: null, // 稍后设置
        level,
        order_index: orderIndex,
        leader_name: leaderName || null,
        personnel: personnel || null,
        description: null,
      };
      
      nodes.push(node);
      nameToIdMap.set(name, index); // 临时使用索引，后续会更新为真实ID
    });
    
    // 建立父子关系
    nodes.forEach((node, index) => {
      const row = rows[index];
      let parentName = row.父节点 ? String(row.父节点).trim() : null;
      
      // 将 "-" 视为空值
      if (parentName === '-' || parentName === '') {
        parentName = null;
      }
      
      if (parentName) {
        const parentIndex = nameToIdMap.get(parentName);
        if (parentIndex !== undefined) {
          // 设置临时parent_index，后续在数据库中会转换为parent_id
          (node as any).temp_parent_name = parentName;
        } else {
          throw new Error(`节点"${node.name}"的父节点"${parentName}"不存在`);
        }
      }
    });
    
    return nodes;
  }
  
  /**
   * 映射类型字符串到枚举值
   */
  private static mapType(typeStr: string): OrganizationNode['type'] {
    const typeMap: Record<string, OrganizationNode['type']> = {
      '委员会': 'committee',
      '职位': 'position',
      '部门': 'department',
      '子部门': 'sub_department',
      'committee': 'committee',
      'position': 'position',
      'department': 'department',
      'sub_department': 'sub_department',
    };
    
    return typeMap[typeStr.toLowerCase()] || 'department';
  }
  
  /**
   * 验证节点数据的完整性
   */
  static validateNodes(nodes: OrganizationNode[]): void {
    // 检查是否有根节点（level=0）
    const rootNodes = nodes.filter(n => n.level === 0);
    if (rootNodes.length === 0) {
      throw new Error('缺少根节点（层级为0的节点）');
    }
    
    // 检查层级连续性
    const levels = new Set(nodes.map(n => n.level));
    const maxLevel = Math.max(...Array.from(levels));
    for (let i = 0; i <= maxLevel; i++) {
      if (!levels.has(i) && i > 0) {
        throw new Error(`层级不连续：缺少层级${i}`);
      }
    }
  }
}

