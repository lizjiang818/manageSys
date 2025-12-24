import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/User';

export class AuthController {
  /**
   * 用户登录
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
        });
      }

      const result = await AuthService.login(username, password);

      res.json({
        success: true,
        message: '登录成功',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || '登录失败',
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  static async getMe(req: Request, res: Response) {
    try {
      // 从中间件中获取用户ID
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '未授权',
        });
      }

      const user = UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在',
        });
      }

      const userWithoutPassword = UserModel.removePassword(user);

      res.json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取用户信息失败',
      });
    }
  }

  /**
   * 用户注册（可选功能）
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
        });
      }

      const userRole = role === 'admin' ? 'admin' : 'user';
      const user = await AuthService.register(username, password, userRole);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '注册失败',
      });
    }
  }
}

