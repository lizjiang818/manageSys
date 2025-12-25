# 部署到阿里云服务器指南

## 代码改动说明

所有代码已修改为支持环境变量配置，**不影响本地开发**：

### 前端改动
- 所有 API 调用使用 `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'`
- 开发环境默认使用 `http://localhost:3001/api`，无需配置
- 生产环境通过 `.env.production` 文件配置

### 后端改动
- 服务器监听地址支持 `HOST` 环境变量，默认 `localhost`（开发环境）
- CORS 配置支持 `FRONTEND_URL` 环境变量，开发环境默认允许所有来源
- 生产环境通过 `backend/.env` 文件配置

## 本地开发（无需任何配置）

```bash
# 1. 启动后端
cd backend
npm run dev
# 默认监听 localhost:3001

# 2. 启动前端
cd ..
npm run dev
# 默认使用 http://localhost:3001/api
```

**无需创建任何 `.env` 文件，代码会自动使用默认值。**

## 生产环境部署步骤

### 1. 服务器准备

```bash
# 安装 Node.js (推荐使用 nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 安装 PM2 (进程管理)
npm install -g pm2

# 安装 Nginx (可选，用于反向代理)
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. 上传代码到服务器

```bash
# 方式1: 使用 git
git clone your-repo-url
cd ManageSystem

# 方式2: 使用 scp
scp -r ./ManageSystem user@your-server-ip:/opt/temple-management/
```

### 3. 配置环境变量

#### 前端配置

创建 `.env.production` 文件（项目根目录）：

```env
# 如果使用 Nginx 反向代理，通常设置为相对路径或域名
VITE_API_BASE_URL=http://your-server-ip/api
# 或使用域名
# VITE_API_BASE_URL=http://your-domain.com/api
```

#### 后端配置

创建 `backend/.env` 文件：

```env
# 服务器配置
PORT=3001
HOST=0.0.0.0

# JWT配置（请使用强密码）
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d

# 前端URL（用于CORS）
FRONTEND_URL=http://your-server-ip
# 或使用域名
# FRONTEND_URL=http://your-domain.com
```

### 4. 构建和启动

#### 前端构建

```bash
cd /opt/temple-management
npm install
npm run build
# 构建产物在 build/ 目录
```

#### 后端构建和启动

```bash
cd /opt/temple-management/backend
npm install
npm run build

# 初始化数据库（如果需要）
npm run init-users

# 使用 PM2 启动
pm2 start dist/server.js --name temple-backend
pm2 save
pm2 startup
```

### 5. Nginx 配置（推荐）

创建 `/etc/nginx/sites-available/temple-management`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 或使用IP

    # 前端静态文件
    location / {
        root /opt/temple-management/build;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 文件上传大小限制
        client_max_body_size 50M;
    }

    # 文件上传访问
    location /uploads {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/temple-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp  # 如果直接访问后端
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### 7. 生成 JWT Secret

```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

将生成的密钥设置到 `backend/.env` 中的 `JWT_SECRET`。

## PM2 配置示例

创建 `backend/pm2.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'temple-backend',
    script: './dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOST: '0.0.0.0'
    }
  }]
};
```

使用：

```bash
pm2 start pm2.config.js
pm2 save
pm2 startup
```

## 环境变量总结

### 前端 `.env.production`:
```env
VITE_API_BASE_URL=http://your-server-ip/api
```

### 后端 `.env`:
```env
PORT=3001
HOST=0.0.0.0
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://your-server-ip
```

## 注意事项

1. **数据库备份**: 定期备份 `backend/database/temple.db`
2. **文件备份**: 定期备份 `backend/uploads/` 目录
3. **日志管理**: 配置 PM2 日志轮转
4. **SSL 证书**: 生产环境建议使用 HTTPS（Let's Encrypt）
5. **域名解析**: 如使用域名，需配置 DNS 解析
6. **安全**: 确保 `.env` 文件不被提交到 git，已包含在 `.gitignore` 中

## 验证部署

1. 检查后端服务: `curl http://localhost:3001/health`
2. 检查前端: 访问 `http://your-server-ip`
3. 检查 API: `curl http://your-server-ip/api/organization/tree` (需要认证)

## 回滚到本地开发

如果需要在本地开发，只需：

1. 删除或重命名 `.env.production` 和 `backend/.env`
2. 代码会自动使用默认值（`localhost:3001`）
3. 正常启动开发服务器即可

