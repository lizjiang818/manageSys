import db from '../config/database';
import { OrganizationNode, OrganizationNodeWithChildren } from '../models/OrganizationNode';

export class OrganizationService {
  /**
   * 获取完整的组织架构树
   */
  static getTree(): OrganizationNodeWithChildren | null {
    const nodes = db.prepare('SELECT * FROM organization_nodes ORDER BY level, order_index').all() as OrganizationNode[];
    
    if (nodes.length === 0) {
      return null;
    }
    
    // 构建树形结构
    const nodeMap = new Map<number, OrganizationNodeWithChildren>();
    let rootNode: OrganizationNodeWithChildren | null = null;
    
    // 第一遍：创建所有节点
    nodes.forEach(node => {
      const nodeWithChildren: OrganizationNodeWithChildren = { ...node, children: [] };
      nodeMap.set(node.id!, nodeWithChildren);
      
      if (node.level === 0) {
        rootNode = nodeWithChildren;
      }
    });
    
    // 第二遍：建立父子关系
    nodes.forEach(node => {
      if (node.parent_id !== null) {
        const parent = nodeMap.get(node.parent_id);
        const child = nodeMap.get(node.id!);
        if (parent && child) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      }
    });
    
    // 对每个节点的children按order_index排序
    const sortChildren = (node: OrganizationNodeWithChildren) => {
      if (node.children) {
        node.children.sort((a, b) => a.order_index - b.order_index);
        node.children.forEach(sortChildren);
      }
    };
    
    if (rootNode) {
      sortChildren(rootNode);
    }
    
    return rootNode;
  }
  
  /**
   * 批量插入/更新组织架构节点
   */
  static async updateFromNodes(nodes: OrganizationNode[]): Promise<number> {
    const transaction = db.transaction(() => {
      // 1. 清空现有数据
      db.prepare('DELETE FROM organization_nodes').run();
      
      // 2. 插入新数据（需要先插入父节点，再插入子节点）
      const sortedNodes = [...nodes].sort((a, b) => {
        // 先按层级排序，再按order_index排序
        if (a.level !== b.level) {
          return a.level - b.level;
        }
        return a.order_index - b.order_index;
      });
      
      const insertStmt = db.prepare(`
        INSERT INTO organization_nodes (name, type, parent_id, level, order_index, leader_name, personnel, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const nameToIdMap = new Map<string, number>();
      
      sortedNodes.forEach(node => {
        let parentId: number | null = null;
        
        // 如果有临时父节点名称，查找父节点ID
        if ((node as any).temp_parent_name) {
          const parentName = (node as any).temp_parent_name;
          parentId = nameToIdMap.get(parentName) || null;
        }
        
        const result = insertStmt.run(
          node.name,
          node.type,
          parentId,
          node.level,
          node.order_index,
          node.leader_name,
          node.personnel,
          node.description
        );
        
        const newId = result.lastInsertRowid as number;
        nameToIdMap.set(node.name, newId);
      });
      
      return sortedNodes.length;
    });
    
    return transaction();
  }
  
  /**
   * 获取单个节点
   */
  static getNodeById(id: number): OrganizationNode | null {
    return db.prepare('SELECT * FROM organization_nodes WHERE id = ?').get(id) as OrganizationNode | null;
  }
  
  /**
   * 获取所有节点（扁平结构）
   */
  static getAllNodes(): OrganizationNode[] {
    return db.prepare('SELECT * FROM organization_nodes ORDER BY level, order_index').all() as OrganizationNode[];
  }
}

