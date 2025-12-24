import { Router } from 'express';
import { RegulationController } from '../controllers/regulation.controller';
import { regulationUpload } from '../middleware/regulation-upload.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// 上传文件（需要管理员权限）
router.post(
  '/upload',
  authenticate,
  authorize('admin'),
  regulationUpload.single('file'),
  RegulationController.uploadFile
);

// 获取部门文件列表（需要登录）
router.get(
  '/files/:department',
  authenticate,
  RegulationController.getFilesByDepartment
);

// 在线查看文件（需要登录，支持从query参数获取token）
router.get(
  '/view/:id',
  (req, res, next) => {
    // 先尝试从header获取token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // 如果有header token，使用标准认证中间件
      return authenticate(req, res, next);
    }
    // 如果没有header token，尝试从query参数获取
    const token = req.query.token as string;
    if (token) {
      // 临时设置authorization header，让authenticate中间件处理
      req.headers.authorization = `Bearer ${token}`;
      return authenticate(req, res, next);
    }
    // 都没有则返回401
    return res.status(401).json({
      success: false,
      message: '未授权，请先登录'
    });
  },
  RegulationController.viewFile
);

// 下载文件（需要登录）
router.get(
  '/download/:id',
  authenticate,
  RegulationController.downloadFile
);

// 删除文件（需要管理员权限）
router.delete(
  '/file/:id',
  authenticate,
  authorize('admin'),
  RegulationController.deleteFile
);

export default router;

