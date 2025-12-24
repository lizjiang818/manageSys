import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// 扩展Request类型以包含userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: 'user' | 'admin';
    }
  }
}

/**
 * 认证中间件 - 验证用户是否登录
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未授权，请先登录',
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    // 验证token
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token无效或已过期',
      });
    }

    // 将用户信息添加到请求对象
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '认证失败',
    });
  }
};

/**
 * 授权中间件 - 验证用户角色权限
 */
export const authorize = (...allowedRoles: ('user' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: '未授权',
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      });
    }

    next();
  };
};

