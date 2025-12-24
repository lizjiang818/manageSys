import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building } from 'lucide-react';

export function DepartmentsInfoContent() {
  const departmentsData = [
    { name: '方丈室', leader: '释某某', members: 1, description: '寺院最高管理机构' },
    { name: '客堂', leader: '释某某', members: 8, description: '负责接待、挂单等事务' },
    { name: '斋堂', leader: '释某某', members: 12, description: '负责饮食、采购等事务' },
    { name: '禅堂', leader: '释某某', members: 15, description: '负责禅修、法务等事务' },
    { name: '财务处', leader: '释某某', members: 4, description: '负责财务管理' },
    { name: '总务处', leader: '释某某', members: 6, description: '负责工程维护、环境卫生' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Building className="w-5 h-5" />
            部门情况
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentsData.map((dept, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="text-red-900 font-semibold text-lg mb-2">{dept.name}</div>
                <div className="text-amber-700 text-sm mb-1">负责人: {dept.leader}</div>
                <div className="text-amber-700 text-sm mb-2">人员数量: {dept.members}人</div>
                <div className="text-amber-600 text-sm">{dept.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

