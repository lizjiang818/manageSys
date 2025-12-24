import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText } from 'lucide-react';

export function NonProfitOrgContent() {
  const orgInfo = {
    name: 'xx禅寺',
    registrationNumber: '123456789012345',
    legalRepresentative: '释某某',
    establishmentDate: '2020年1月1日',
    address: '中国浙江省杭州市108号',
    businessScope: '宗教活动、慈善公益、文化传承',
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            民非组织机构
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">机构名称</div>
                <div className="text-red-900 font-semibold">{orgInfo.name}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">统一社会信用代码</div>
                <div className="text-red-900 font-semibold">{orgInfo.registrationNumber}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">法定代表人</div>
                <div className="text-red-900 font-semibold">{orgInfo.legalRepresentative}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">成立日期</div>
                <div className="text-red-900 font-semibold">{orgInfo.establishmentDate}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 md:col-span-2">
                <div className="text-sm text-amber-700 mb-1">注册地址</div>
                <div className="text-red-900 font-semibold">{orgInfo.address}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 md:col-span-2">
                <div className="text-sm text-amber-700 mb-1">业务范围</div>
                <div className="text-red-900 font-semibold">{orgInfo.businessScope}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

