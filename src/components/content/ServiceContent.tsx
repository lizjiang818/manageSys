import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Heart, GraduationCap, Home, TreePine } from 'lucide-react';

export function ServiceContent() {
  const services = [
    {
      title: '慈善救助',
      icon: Heart,
      description: '为困难群众提供物资和资金援助',
      stats: [
        { label: '年度救助金额', value: '156万元' },
        { label: '受助家庭', value: '320户' }
      ],
      activities: [
        '贫困家庭慰问',
        '重病患者救助',
        '孤寡老人关怀',
        '突发灾害援助'
      ]
    },
    {
      title: '教育支持',
      icon: GraduationCap,
      description: '资助贫困学生完成学业',
      stats: [
        { label: '助学金总额', value: '88万元' },
        { label: '资助学生', value: '156人' }
      ],
      activities: [
        '贫困生助学金',
        '优秀生奖学金',
        '留守儿童关爱',
        '图书捐赠活动'
      ]
    },
    {
      title: '养老服务',
      icon: Home,
      description: '为社区老人提供关怀和服务',
      stats: [
        { label: '服务老人', value: '280人' },
        { label: '志愿服务时长', value: '2400小时' }
      ],
      activities: [
        '免费斋饭供应',
        '健康义诊活动',
        '节日慰问探访',
        '精神文化服务'
      ]
    },
    {
      title: '环境保护',
      icon: TreePine,
      description: '倡导环保理念，保护生态环境',
      stats: [
        { label: '植树数量', value: '1200棵' },
        { label: '环保活动', value: '24场' }
      ],
      activities: [
        '植树造林活动',
        '河道清洁行动',
        '环保宣传讲座',
        '垃圾分类推广'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 服务社会概述 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">服务社会理念</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-amber-900 leading-relaxed">
            慈云禅寺秉承"慈悲济世、服务社会"的宗旨，积极参与社会公益事业。通过慈善救助、教育支持、养老服务、环境保护等多个方面，践行大乘佛教普度众生的精神，为构建和谐社会贡献力量。
          </p>
        </CardContent>
      </Card>

      {/* 服务项目 */}
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <Card key={service.title} className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
              <CardTitle className="text-red-900 flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-amber-900 mb-4">{service.description}</p>
              
              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {service.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-4 text-center"
                  >
                    <div className="text-yellow-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-yellow-200">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* 活动列表 */}
              <div className="grid grid-cols-2 gap-2">
                {service.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded border border-amber-200 px-3 py-2 text-sm text-amber-800"
                  >
                    • {activity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 年度总结 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">年度公益数据</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '公益投入', value: '380万元' },
              { label: '受益群众', value: '1200余人' },
              { label: '志愿者', value: '85人' },
              { label: '公益活动', value: '52场' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4 text-center"
              >
                <div className="text-red-800 mb-1">{item.value}</div>
                <div className="text-sm text-amber-700">{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
