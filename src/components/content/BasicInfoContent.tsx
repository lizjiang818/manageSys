import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Calendar, Phone, Globe } from 'lucide-react';

export function BasicInfoContent() {
  const basicInfo = [
    { label: '寺院名称', value: 'xx禅寺', icon: Globe },
    { label: '成立时间', value: '唐朝贞观年间（公元627年）', icon: Calendar },
    { label: '所在地址', value: '中国浙江省杭州市108号', icon: MapPin },
    { label: '联系电话', value: '+86 512-6789-0000', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">寺院基本信息</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basicInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-amber-700 mb-1">{info.label}</div>
                    <div className="text-red-900">{info.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 寺院简介 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900">寺院简介</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-amber max-w-none">
            <p className="text-amber-900 leading-relaxed">
              慈云禅寺始建于唐朝贞观年间，距今已有1400余年历史。寺院坐落于江南水乡苏州，占地面积约50亩，建筑面积15000平方米。寺内古木参天，殿宇巍峨，香火鼎盛，是江南地区重要的佛教圣地之一。
            </p>
            <p className="text-amber-900 leading-relaxed mt-4">
              寺院历经沧桑，多次修缮，现存建筑主要为明清时期所建。主要建筑包括山门、天王殿、大雄宝殿、藏经楼、方丈室、禅堂等。寺内珍藏有唐代经文、明清佛像等珍贵文物，具有极高的历史文化价值。
            </p>
            <p className="text-amber-900 leading-relaxed mt-4">
              慈云禅寺秉承"慈悲为怀，普度众生"的宗旨，致力于弘扬佛法，服务社会。寺院常年开展各类佛事活动、禅修课程和慈善公益活动，深受信众和社会各界的尊敬与爱戴。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 寺院规模 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '占地面积', value: '50亩' },
          { label: '建筑面积', value: '15000㎡' },
          { label: '主要殿堂', value: '8座' },
          { label: '文物数量', value: '120余件' },
        ].map((item) => (
          <Card key={item.label} className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur">
            <CardContent className="p-6 text-center">
              <div className="text-red-900">{item.label}</div>
              <div className="text-red-800 mt-2">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
