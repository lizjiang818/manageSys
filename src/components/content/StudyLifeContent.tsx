import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Flower2, Heart, Users } from 'lucide-react';

export function StudyLifeContent() {
  const activities = [
    {
      title: '早晚课诵',
      icon: BookOpen,
      description: '每日早晚两次共修，诵经礼佛，培养定力',
      time: '每日 05:00 & 17:30',
      participants: 70
    },
    {
      title: '禅修静坐',
      icon: Flower2,
      description: '上午和下午各有禅修时段，修习止观',
      time: '每日 08:00 & 14:00',
      participants: 65
    },
    {
      title: '佛学讲座',
      icon: Users,
      description: '每周三次佛学课程，深入经典',
      time: '每周一、三、五 15:00',
      participants: 60
    },
    {
      title: '慈善义工',
      icon: Heart,
      description: '参与寺院慈善活动，实践菩萨行',
      time: '每周六 09:00',
      participants: 40
    }
  ];

  const courses = [
    { name: '《金刚经》研读', teacher: '释智慧法师', schedule: '每周一 15:00-17:00' },
    { name: '《楞严经》讲解', teacher: '释道明方丈', schedule: '每周三 15:00-17:00' },
    { name: '禅修指导', teacher: '释禅定法师', schedule: '每周五 15:00-17:00' },
    { name: '戒律学习', teacher: '释持戒法师', schedule: '每月第一周日 14:00-16:00' }
  ];

  return (
    <div className="space-y-6">
      {/* 学修活动 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">日常修行活动</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.title}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-900 mb-2">{activity.title}</h3>
                      <p className="text-sm text-amber-800 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-xs text-amber-700">
                        <span>{activity.time}</span>
                        <span className="bg-red-800 text-yellow-200 px-2 py-1 rounded">
                          {activity.participants}人参加
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 课程安排 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">佛学课程</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="w-10 h-10 bg-red-800 text-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-red-900 mb-1">{course.name}</h3>
                  <div className="flex gap-4 text-sm text-amber-700">
                    <span>授课法师：{course.teacher}</span>
                    <span>时间：{course.schedule}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 生活管理 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">生活管理</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="text-red-900 mb-3">饮食管理</h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• 素食为主，营养均衡</li>
                <li>• 过午不食，遵守戒律</li>
                <li>• 珍惜粮食，不得浪费</li>
                <li>• 统一斋堂用餐，保持安静</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="text-red-900 mb-3">起居管理</h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• 统一住宿安排，保持整洁</li>
                <li>• 按时作息，不得晚睡</li>
                <li>• 个人物品妥善保管</li>
                <li>• 定期打扫寮房卫生</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
