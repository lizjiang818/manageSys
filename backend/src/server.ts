import app from './app';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost'; // 开发环境默认 localhost，生产环境设置为 0.0.0.0

app.listen(PORT, HOST, () => {
  console.log(`🚀 服务器运行在 http://${HOST}:${PORT}`);
  console.log(`📊 健康检查: http://${HOST}:${PORT}/health`);
  console.log(`📁 API文档: http://${HOST}:${PORT}/api/organization/tree`);
});

