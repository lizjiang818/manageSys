import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Briefcase } from 'lucide-react';

export function OfficialsInfoContent() {
  const officialsData = [
    { name: '释某某', position: '住持', department: '方丈室', responsibility: '全面负责寺院事务' },
    { name: '释某某', position: '维那', department: '禅堂', responsibility: '负责禅修事务' },
    { name: '释某某', position: '知客', department: '客堂', responsibility: '负责接待事务' },
    { name: '释某某', position: '典座', department: '斋堂', responsibility: '负责饮食事务' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            执事情况
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {officialsData.map((official, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-red-900 font-semibold">{official.name}</div>
                    <div className="text-amber-700 text-sm mt-1">职位: {official.position}</div>
                    <div className="text-amber-700 text-sm">部门: {official.department}</div>
                    <div className="text-amber-600 text-sm mt-2">{official.responsibility}</div>
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

