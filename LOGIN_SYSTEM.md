# 双角色登录系统使用说明

## 功能概述

系统已实现双角色登录功能：
- **普通用户 (user)**: 登录后跳转到组织架构页面，可查看除管理功能外的所有菜单
- **管理员 (admin)**: 登录后跳转到管理界面，可访问所有功能包括管理控制台

## 初始化步骤

### 1. 初始化数据库和用户

```bash
cd backend
npm run init-users
```

这将创建两个默认账户：
- **管理员**: `admin` / `admin123`
- **普通用户**: `user` / `user123`

⚠️ **重要**: 生产环境请务必修改默认密码！

### 2. 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:3001` 启动

### 3. 启动前端服务

```bash
npm run dev
```

前端服务将在 `http://localhost:5173` 启动（或Vite默认端口）

## 使用流程

1. 访问前端应用，自动跳转到登录页面
2. 使用默认账户登录：
   - 管理员: `admin` / `admin123` → 跳转到 `/admin` 管理界面
   - 普通用户: `user` / `user123` → 跳转到 `/organization` 组织架构页面
3. 登录后，根据角色显示不同的菜单：
   - **user**: 显示所有普通菜单（组织架构、基本信息、规范管理、学修生活、文化传承、服务社会、成果成效）
   - **admin**: 显示所有菜单 + 管理控制台
4. 点击侧边栏底部的"登出"按钮可退出登录

## API接口

### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

响应:
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### 获取当前用户信息
```
GET /api/auth/me
Headers: Authorization: Bearer <token>

响应:
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## 路由说明

- `/login` - 登录页面（未登录用户自动跳转）
- `/organization` - 组织架构页面（user角色）
- `/admin` - 管理界面（admin角色）
- `/` - 根据登录状态和角色自动跳转

## 安全说明

1. JWT Token存储在localStorage中
2. 密码使用bcrypt加密存储
3. 所有受保护的路由都需要有效的JWT Token
4. 角色权限在路由层面进行验证

## 文件结构

### 后端新增文件
- `backend/src/models/User.ts` - 用户模型
- `backend/src/services/auth.service.ts` - 认证服务
- `backend/src/controllers/auth.controller.ts` - 认证控制器
- `backend/src/middleware/auth.middleware.ts` - 认证中间件
- `backend/src/routes/auth.routes.ts` - 认证路由
- `backend/src/scripts/initUsers.ts` - 初始化用户脚本

### 前端新增文件
- `src/contexts/AuthContext.tsx` - 认证上下文
- `src/pages/Login.tsx` - 登录页面
- `src/pages/AdminDashboard.tsx` - 管理控制台组件
- `src/pages/AdminPage.tsx` - 管理员页面
- `src/pages/OrganizationPage.tsx` - 组织架构页面
- `src/components/ProtectedRoute.tsx` - 路由保护组件

## 注意事项

1. 首次运行需要执行 `npm run init-users` 创建默认用户
2. 生产环境请修改JWT_SECRET环境变量
3. 生产环境请修改默认用户密码
4. 建议在生产环境中禁用注册接口或添加管理员权限验证

