import db from '../config/database';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserWithoutPassword {
  id: number;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export class UserModel {
  /**
   * 根据用户名查找用户
   */
  static findByUsername(username: string): User | null {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    return user || null;
  }

  /**
   * 根据ID查找用户
   */
  static findById(id: number): User | null {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return user || null;
  }

  /**
   * 创建用户
   */
  static create(username: string, password: string, role: 'user' | 'admin'): User {
    const result = db.prepare(`
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `).run(username, password, role);

    const user = this.findById(result.lastInsertRowid as number);
    if (!user) {
      throw new Error('创建用户失败');
    }
    return user;
  }

  /**
   * 移除密码字段
   */
  static removePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

