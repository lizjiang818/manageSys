import { ExcelParserService } from '../services/excelParser.service';
import * as path from 'path';

const excelPath = path.join(__dirname, '../../organization_structure.xlsx');

try {
  console.log('📖 开始解析Excel文件...');
  console.log(`📁 文件路径: ${excelPath}`);
  
  const nodes = ExcelParserService.parseExcel(excelPath);
  
  console.log(`✅ 解析成功！共 ${nodes.length} 个节点`);
  console.log('\n📊 节点统计：');
  
  // 按层级统计
  const levelCount: Record<number, number> = {};
  nodes.forEach(node => {
    levelCount[node.level] = (levelCount[node.level] || 0) + 1;
  });
  
  Object.keys(levelCount).sort().forEach(level => {
    console.log(`  层级 ${level}: ${levelCount[Number(level)]} 个节点`);
  });
  
  // 按类型统计
  const typeCount: Record<string, number> = {};
  nodes.forEach(node => {
    typeCount[node.type] = (typeCount[node.type] || 0) + 1;
  });
  
  console.log('\n📋 类型统计：');
  Object.keys(typeCount).forEach(type => {
    console.log(`  ${type}: ${typeCount[type]} 个`);
  });
  
  // 验证数据
  console.log('\n🔍 验证数据完整性...');
  ExcelParserService.validateNodes(nodes);
  console.log('✅ 数据验证通过！');
  
  // 显示前5个节点作为示例
  console.log('\n📝 前5个节点示例：');
  nodes.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. [层级${node.level}] ${node.name} (${node.type}) - 父节点: ${node.parent_id !== null ? '有' : '无'}`);
  });
  
  // 显示有人员信息的节点
  console.log('\n👥 人员信息解析示例：');
  const nodesWithPersonnel = nodes.filter(n => n.personnel);
  if (nodesWithPersonnel.length > 0) {
    console.log(`  共找到 ${nodesWithPersonnel.length} 个有人员信息的节点\n`);
    nodesWithPersonnel.forEach((node, index) => {
      try {
        const members = JSON.parse(node.personnel!);
        console.log(`  ${index + 1}. [${node.type}] ${node.name} (层级${node.level}):`);
        members.forEach((member: any, mIndex: number) => {
          console.log(`     ${mIndex + 1}. ${member.name}${member.position ? ` - ${member.position}` : ''}`);
        });
        console.log('');
      } catch (e) {
        console.log(`  ${index + 1}. ${node.name}: ${node.personnel} (原始格式，解析失败)`);
      }
    });
  } else {
    console.log('  (暂无人员信息)');
  }
  
} catch (error: any) {
  console.error('❌ 解析失败:', error.message);
  process.exit(1);
}

