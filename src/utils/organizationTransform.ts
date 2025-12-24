import { OrganizationNode } from '../hooks/useOrganization';

interface Person {
  name: string;
  position?: string;
}

interface SubDepartment {
  name: string;
  members?: Person[];
}

interface Department {
  name: string;
  leader: string;
  subDepartments: SubDepartment[];
}

/**
 * 解析人员信息字符串
 * 支持格式:
 * 1. JSON 数组格式: '[{"name":"张三:组长","position":null},{"name":"李四:组员","position":null}]'
 * 2. 简单格式: "张三:组长,李四:法务,王五" 或 "张三,李四,王五"
 */
function parsePersonnel(personnel: string | null): Person[] {
  if (!personnel) return [];

  const trimmed = personnel.trim();
  
  // 检查是否是 JSON 格式（以 [ 开头）
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      // 如果是数组
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === 'object' && item !== null) {
            const name = item.name || '';
            // 如果 name 中已经包含冒号和职位（如"张三:组长"），直接使用
            if (name.includes(':') || name.includes('：')) {
              return {
                name: name.replace(/:/g, '：'), // 统一使用中文冒号
              };
            }
            // 否则，如果有 position，组合显示
            if (item.position && item.position !== 'null' && item.position !== null) {
              return {
                name: `${name}：${item.position}`,
              };
            }
            return {
              name: name,
            };
          }
          return null;
        }).filter((p): p is Person => p !== null);
      }
      // 如果是单个对象
      if (typeof parsed === 'object' && parsed !== null) {
        const name = parsed.name || '';
        if (name.includes(':') || name.includes('：')) {
          return [{
            name: name.replace(/:/g, '：'),
          }];
        }
        if (parsed.position && parsed.position !== 'null' && parsed.position !== null) {
          return [{
            name: `${name}：${parsed.position}`,
          }];
        }
        return name ? [{ name }] : [];
      }
    } catch (e) {
      // JSON 解析失败，继续使用简单格式解析
      console.warn('Failed to parse personnel as JSON, using simple format:', e);
    }
  }

  // 简单格式解析：用逗号分隔
  return trimmed.split(/[,，]/).map((item) => {
    const itemTrimmed = item.trim();
    if (!itemTrimmed) return null;

    // 检查是否有职位（包含冒号）
    const colonIndex = itemTrimmed.indexOf('：') >= 0 ? itemTrimmed.indexOf('：') : itemTrimmed.indexOf(':');
    if (colonIndex > 0) {
      return {
        name: itemTrimmed.substring(0, colonIndex).trim() + '：' + itemTrimmed.substring(colonIndex + 1).trim(),
      };
    } else {
      return {
        name: itemTrimmed,
      };
    }
  }).filter((p): p is Person => p !== null);
}

/**
 * 将后端树形数据转换为前端展示格式
 */
export function transformOrganizationTree(tree: OrganizationNode | null): {
  departments: Department[];
  totalMembers: number;
  totalDepartments: number;
  totalLeaders: number;
} {
  if (!tree) {
    return {
      departments: [],
      totalMembers: 0,
      totalDepartments: 0,
      totalLeaders: 0,
    };
  }

  const departments: Department[] = [];
  let totalMembers = 0;
  let totalLeaders = 0;

  // 遍历第二层节点（第一层是根节点，如"住持"、"监管会"等）
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child) => {
      // 第二层可以是部门、职位、委员会等
      // 支持的类型：department, position, committee, organization 等
      const subDepartments: SubDepartment[] = [];

      // 遍历第三层（子部门或子节点）
      if (child.children && child.children.length > 0) {
        child.children.forEach((subChild) => {
          // 支持多种子节点类型
          const members = parsePersonnel(subChild.personnel);
          totalMembers += members.length;

          subDepartments.push({
            name: subChild.name,
            members: members.length > 0 ? members : undefined,
          });
        });
      }

      // 如果当前节点有人员信息，也添加到成员数中
      const childMembers = parsePersonnel(child.personnel);
      totalMembers += childMembers.length;

      departments.push({
        name: child.name,
        leader: child.leader_name || '',
        subDepartments,
      });

      if (child.leader_name) {
        totalLeaders++;
      }
    });
  }

  // 计算总数（包括根节点）
  totalMembers += 1; // 根节点（住持）
  totalLeaders += 1; // 根节点（住持）

  return {
    departments,
    totalMembers,
    totalDepartments: departments.length,
    totalLeaders,
  };
}

