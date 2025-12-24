import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User } from 'lucide-react';

export function MonksInfoContent() {
  const monksData = [
    { name: '释某某', position: '住持', age: 65, years: 40 },
    { name: '释某某', position: '维那', age: 52, years: 30 },
    { name: '释某某', position: '知客', age: 48, years: 25 },
    { name: '释某某', position: '典座', age: 45, years: 22 },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            僧众情况
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {monksData.map((monk, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-red-900 font-semibold">{monk.name}</div>
                    <div className="text-amber-700 text-sm mt-1">{monk.position}</div>
                  </div>
                  <div className="text-right text-sm text-amber-600">
                    <div>年龄: {monk.age}岁</div>
                    <div>出家年限: {monk.years}年</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

