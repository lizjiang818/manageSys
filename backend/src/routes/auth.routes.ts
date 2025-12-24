import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// 登录
router.post('/login', AuthController.login);

// 获取当前用户信息（需要认证）
router.get('/me', authenticate, AuthController.getMe);

// 注册（可选，生产环境建议关闭或添加管理员权限）
router.post('/register', AuthController.register);

export default router;

