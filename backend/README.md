# 寺院管理平台 - 后端服务

## 项目简介

这是寺院管理平台的后端服务，主要负责组织架构数据的存储和管理。

## 技术栈

- **Node.js** + **TypeScript**
- **Express** - Web框架
- **SQLite** (better-sqlite3) - 数据库
- **xlsx** - Excel文件解析
- **multer** - 文件上传处理

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── models/          # 数据模型
│   │   └── OrganizationNode.ts
│   ├── services/        # 业务逻辑服务
│   │   ├── organization.service.ts
│   │   └── excelParser.service.ts
│   ├── controllers/     # 控制器
│   │   └── organization.controller.ts
│   ├── routes/          # 路由定义
│   │   └── organization.routes.ts
│   ├── middleware/      # 中间件
│   │   └── upload.middleware.ts
│   ├── app.ts           # Express应用
│   └── server.ts        # 服务器启动文件
├── database/
│   ├── init.sql         # 数据库初始化脚本
│   └── temple.db        # SQLite数据库文件（自动生成）
├── uploads/            # 上传文件临时目录
└── package.json
```

## 安装依赖

```bash
npm install
```

## 运行项目

### 开发模式（自动重启）

```bash
npm run dev
```

### 生产模式

```bash
# 先编译
npm run build

# 再运行
npm start
```

## API接口

### 1. 健康检查
```
GET /health
```

### 2. 上传Excel文件
```
POST /api/organization/upload
Content-Type: multipart/form-data

参数:
- file: Excel文件 (.xlsx, .xls)

响应:
{
  "success": true,
  "message": "组织架构更新成功",
  "data": {
    "totalNodes": 25,
    "nodes": 25
  }
}
```

### 3. 获取组织架构树
```
GET /api/organization/tree

响应:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "住持",
    "type": "position",
    "level": 0,
    "children": [...]
  }
}
```

### 4. 获取所有节点（扁平结构）
```
GET /api/organization/nodes
```

### 5. 获取单个节点详情
```
GET /api/organization/nodes/:id
```

## Excel文件格式

上传的Excel文件需要包含以下列：

| 层级 | 名称 | 类型 | 负责人 | 父节点 | 排序 | 人员 |
|------|------|------|--------|--------|------|------|
| 0 | 住持 | position | 释xxx | - | 1 | - |
| 1 | 维那 | position | 释xx法师 | 住持 | 1 | - |
| 2 | 禅堂 | department | - | 维那 | 1 | - |
| 3 | 人事培训 | 子部门 | - | 客堂 | 1 | 张三 |

**列说明：**
- **层级**: 数字，0表示根节点
- **名称**: 节点名称（必填）
- **类型**: committee/position/department/sub_department 或 委员会/职位/部门/子部门
- **负责人**: 负责人姓名（可选）
- **父节点**: 父节点名称（可选，根节点为空）
- **排序**: 同级排序序号（可选，默认为行号）
- **人员**: 部门人员信息（可选），支持以下格式：
  - 简单格式：`张三,李四,王五` - 多个人员用逗号分隔（支持中文逗号"，"和英文逗号","），职位为空
  - 带职位格式：`张三:组长,李四:法务,王五:法务` - 使用冒号分隔姓名和职位
  - 混合格式：`张三:组长,李四,王五` - 可以混合使用（有冒号的带职位，没有冒号的职位为空）
  - **注意**：如果Excel中没有写职位（没有冒号），则职位字段为空，前端只显示姓名

## 数据库

数据库文件位于 `database/temple.db`，首次运行时会自动创建。

### 表结构

**organization_nodes** - 组织架构节点表
- id: 主键
- name: 节点名称
- type: 节点类型
- parent_id: 父节点ID
- level: 层级深度
- order_index: 排序序号
- leader_name: 负责人姓名
- personnel: 人员信息（多个人员用逗号分隔）
- description: 描述信息
- created_at: 创建时间
- updated_at: 更新时间

## 注意事项

1. 上传的Excel文件大小限制为10MB
2. 只支持 .xlsx 和 .xls 格式
3. 上传的文件会在处理完成后自动删除
4. 数据库文件需要定期备份

## 开发说明

- 服务器默认运行在 `http://localhost:3001`
- 修改代码后，开发模式会自动重启
- 使用 TypeScript 编写，需要编译后运行

