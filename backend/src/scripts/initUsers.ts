import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/User';

/**
 * 初始化默认用户
 * 如果用户不存在，则创建默认的admin和user账户
 */
async function initUsers() {
  console.log('开始初始化用户...');

  // 默认管理员账户
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  // 默认普通用户账户
  const userUsername = 'user';
  const userPassword = 'user123';

  try {
    // 检查并创建管理员账户
    let admin = UserModel.findByUsername(adminUsername);
    if (!admin) {
      const hashedPassword = await AuthService.hashPassword(adminPassword);
      admin = UserModel.create(adminUsername, hashedPassword, 'admin');
      console.log(`✅ 创建管理员账户: ${adminUsername} / ${adminPassword}`);
    } else {
      console.log(`ℹ️  管理员账户已存在: ${adminUsername}`);
    }

    // 检查并创建普通用户账户
    let user = UserModel.findByUsername(userUsername);
    if (!user) {
      const hashedPassword = await AuthService.hashPassword(userPassword);
      user = UserModel.create(userUsername, hashedPassword, 'user');
      console.log(`✅ 创建普通用户账户: ${userUsername} / ${userPassword}`);
    } else {
      console.log(`ℹ️  普通用户账户已存在: ${userUsername}`);
    }

    console.log('用户初始化完成！');
    console.log('\n默认账户信息：');
    console.log(`管理员: ${adminUsername} / ${adminPassword}`);
    console.log(`普通用户: ${userUsername} / ${userPassword}`);
    console.log('\n⚠️  请在生产环境中修改默认密码！');
  } catch (error: any) {
    console.error('初始化用户失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initUsers()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default initUsers;

