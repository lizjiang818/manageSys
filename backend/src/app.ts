import express from 'express';
import cors from 'cors';
import * as path from 'path';
import organizationRoutes from './routes/organization.routes';
import authRoutes from './routes/auth.routes';
import regulationRoutes from './routes/regulation.routes';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供上传的文件访问
const uploadsPath = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// 路由
app.use('/api/organization', organizationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/regulation', regulationRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

export default app;

