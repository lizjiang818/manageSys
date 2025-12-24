import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserModel, User, UserWithoutPassword } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'temple-management-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface LoginResult {
  user: UserWithoutPassword;
  token: string;
}

export class AuthService {
  /**
   * 密码加密
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 验证密码
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * 生成JWT Token
   */
  static generateToken(user: UserWithoutPassword): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  /**
   * 验证JWT Token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * 用户登录
   */
  static async login(username: string, password: string): Promise<LoginResult> {
    // 查找用户
    const user = UserModel.findByUsername(username);
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误');
    }

    // 生成Token
    const userWithoutPassword = UserModel.removePassword(user);
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * 注册用户（可选功能）
   */
  static async register(username: string, password: string, role: 'user' | 'admin' = 'user'): Promise<UserWithoutPassword> {
    // 检查用户名是否已存在
    const existingUser = UserModel.findByUsername(username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await this.hashPassword(password);

    // 创建用户
    const user = UserModel.create(username, hashedPassword, role);
    return UserModel.removePassword(user);
  }
}

