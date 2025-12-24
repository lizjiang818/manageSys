import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';

export function StaffInfoContent() {
  const staffData = [
    { name: '张三', position: '会计', department: '财务处', phone: '138****1234' },
    { name: '李四', position: '出纳', department: '财务处', phone: '139****5678' },
    { name: '王五', position: '维修工', department: '总务处', phone: '137****9012' },
    { name: '赵六', position: '清洁工', department: '总务处', phone: '136****3456' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            职工情况
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {staffData.map((staff, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-red-900 font-semibold">{staff.name}</div>
                    <div className="text-amber-700 text-sm mt-1">职位: {staff.position}</div>
                    <div className="text-amber-700 text-sm">部门: {staff.department}</div>
                  </div>
                  <div className="text-right text-sm text-amber-600">
                    <div>联系电话</div>
                    <div>{staff.phone}</div>
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

