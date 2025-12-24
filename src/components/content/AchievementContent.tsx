import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, Star, TrendingUp, Calendar } from 'lucide-react';

export function AchievementContent() {
  const awards = [
    {
      year: '2024',
      title: '全国和谐寺院',
      issuer: '中国佛教协会',
      level: '国家级'
    },
    {
      year: '2023',
      title: '省级文明单位',
      issuer: '浙江省文明办',
      level: '省级'
    },
    {
      year: '2023',
      title: '优秀宗教活动场所',
      issuer: '杭州市民族宗教局',
      level: '市级'
    },
    {
      year: '2022',
      title: '慈善公益先进单位',
      issuer: '浙江省慈善总会',
      level: '省级'
    }
  ];

  const achievements = [
    {
      category: '弘法成果',
      icon: Star,
      items: [
        { title: '举办佛学讲座', value: '48场', period: '年度' },
        { title: '接待参访信众', value: '12万人次', period: '年度' },
        { title: '出版佛学著作', value: '3部', period: '年度' },
        { title: '在线弘法', value: '200万观看', period: '年度' }
      ]
    },
    {
      category: '人才培养',
      icon: TrendingUp,
      items: [
        { title: '培养僧才', value: '15人', period: '年度' },
        { title: '外派进修', value: '8人', period: '年度' },
        { title: '学术研究', value: '12篇', period: '年度' },
        { title: '对外交流', value: '6次', period: '年度' }
      ]
    },
    {
      category: '文化传承',
      icon: Calendar,
      items: [
        { title: '传统法会', value: '24场', period: '年度' },
        { title: '文物修复', value: '6件', period: '年度' },
        { title: '文化展览', value: '4次', period: '年度' },
        { title: '非遗传承', value: '3项', period: '在进行' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 荣誉奖项 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Award className="w-5 h-5" />
            荣誉奖项
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {awards.map((award, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-red-900">{award.title}</h3>
                    <span className="text-xs bg-red-800 text-yellow-200 px-2 py-1 rounded">
                      {award.level}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-amber-700">
                    <span>颁发单位：{award.issuer}</span>
                    <span>获奖时间：{award.year}年</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 成果统计 */}
      {achievements.map((achievement) => {
        const Icon = achievement.icon;
        return (
          <Card key={achievement.category} className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
              <CardTitle className="text-red-900 flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {achievement.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievement.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-800">{item.title}</span>
                      <span className="text-xs bg-amber-700 text-yellow-100 px-2 py-1 rounded">
                        {item.period}
                      </span>
                    </div>
                    <div className="text-red-800">{item.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 社会影响力 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">社会影响力</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: '媒体报道', value: '36次', description: '各级媒体正面报道' },
              { label: '社会满意度', value: '98%', description: '信众和社区满意度' },
              { label: '网络影响力', value: '500万+', description: '各平台总关注量' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-5 text-center"
              >
                <div className="text-yellow-400 mb-2">{item.value}</div>
                <div className="text-yellow-200 mb-1">{item.label}</div>
                <div className="text-xs text-yellow-300/70">{item.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
