import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Scroll, Book, Library, Landmark } from 'lucide-react';

export function CultureContent() {
  const culturalAssets = [
    {
      name: '唐代贝叶经',
      category: '经文典籍',
      year: '公元645年',
      description: '玄奘法师从印度带回的珍贵贝叶经，保存完好',
      icon: Scroll
    },
    {
      name: '明代铜铸观音像',
      category: '佛教造像',
      year: '明永乐年间',
      description: '高2.8米，工艺精湛，是寺院镇寺之宝',
      icon: Landmark
    },
    {
      name: '《华严经》手抄本',
      category: '经文典籍',
      year: '清康熙年间',
      description: '由本寺高僧历时18年手抄完成',
      icon: Book
    },
    {
      name: '历代祖师语录',
      category: '文献资料',
      year: '唐至清代',
      description: '记录本寺历代祖师开示和修行心得',
      icon: Library
    }
  ];

  const traditions = [
    {
      title: '水陆法会',
      description: '每年农历七月十五日举办，超度亡灵，普利群生',
      frequency: '每年一次'
    },
    {
      title: '观音诞法会',
      description: '农历二月十九、六月十九、九月十九观音菩萨诞辰日举行',
      frequency: '每年三次'
    },
    {
      title: '禅七法会',
      description: '冬季举行，为期七天的密集禅修',
      frequency: '每年冬季'
    },
    {
      title: '浴佛法会',
      description: '农历四月初八佛诞日举行，纪念释迦牟尼佛诞辰',
      frequency: '每年一次'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 文化遗产 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">文化遗产</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {culturalAssets.map((asset) => {
              const Icon = asset.icon;
              return (
                <div
                  key={asset.name}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-900 mb-1">{asset.name}</h3>
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-red-800 text-yellow-200 px-2 py-1 rounded">
                          {asset.category}
                        </span>
                        <span className="text-xs bg-amber-700 text-yellow-100 px-2 py-1 rounded">
                          {asset.year}
                        </span>
                      </div>
                      <p className="text-sm text-amber-800">{asset.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 传统法会 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">传统法会</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {traditions.map((tradition, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="w-10 h-10 bg-red-800 text-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-red-900">{tradition.title}</h3>
                    <span className="text-xs bg-amber-700 text-yellow-100 px-3 py-1 rounded">
                      {tradition.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-amber-800">{tradition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 文化保护 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">文化保护工作</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="text-red-900 mb-3">文物保护</h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• 建立文物档案系统</li>
                <li>• 定期检查维护文物状态</li>
                <li>• 控制藏经楼温湿度</li>
                <li>• 数字化保存珍贵经文</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="text-red-900 mb-3">传承发展</h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• 培养青年僧才</li>
                <li>• 开展佛教文化讲座</li>
                <li>• 举办传统法会活动</li>
                <li>• 出版佛学研究专著</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
