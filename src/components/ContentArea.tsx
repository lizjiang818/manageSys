import { OrganizationContent } from './content/OrganizationContent';
import { BasicInfoContent } from './content/BasicInfoContent';
import { RegulationContent } from './content/RegulationContent';
import { ManagementMethodContent } from './content/ManagementMethodContent';
import { StudyLifeContent } from './content/StudyLifeContent';
import { CultureContent } from './content/CultureContent';
import { ServiceContent } from './content/ServiceContent';
import { AchievementContent } from './content/AchievementContent';
import { MonksInfoContent } from './content/MonksInfoContent';
import { OfficialsInfoContent } from './content/OfficialsInfoContent';
import { StaffInfoContent } from './content/StaffInfoContent';
import { DepartmentsInfoContent } from './content/DepartmentsInfoContent';
import { NonProfitOrgContent } from './content/NonProfitOrgContent';
import { Card, CardContent } from './ui/card';

interface ContentAreaProps {
  activeSection: string;
}

export function ContentArea({ activeSection }: ContentAreaProps) {
  const renderContent = () => {
    switch (activeSection) {
      case '组织架构':
        return <OrganizationContent />;
      case '基本信息':
        return <BasicInfoContent />;
      case '僧众情况':
        return <MonksInfoContent />;
      case '执事情况':
        return <OfficialsInfoContent />;
      case '职工情况':
        return <StaffInfoContent />;
      case '部门情况':
        return <DepartmentsInfoContent />;
      case '民非组织机构':
        return <NonProfitOrgContent />;
      case '规范管理':
      case '管理制度':
        return <RegulationContent />;
      case '管理办法':
        return <ManagementMethodContent />;
      case '学修生活':
        return <StudyLifeContent />;
      case '文化灵隐':
        return <CultureContent />;
      case '历史文化研究':
      case '传统文化浸润':
      case '灵隐文化出版':
      case '云林图书馆':
      case '文物展示馆':
      case '艺术展':
        return (
          <div className="space-y-6">
            <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
              <CardContent className="p-6">
                <div className="text-center text-amber-600 py-12">
                  <p className="text-lg">内容待完善</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case '服务社会':
        return <ServiceContent />;
      case '成果成效':
        return <AchievementContent />;
      case '灵隐1700':
        return (
          <div className="space-y-6">
            <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
              <CardContent className="p-6">
                <div className="text-center text-amber-600 py-12">
                  <p className="text-lg">内容待完善</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <OrganizationContent />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto relative">
      {/* 装饰性顶部边框 */}
      <div className="sticky top-0 z-10 h-2 bg-gradient-to-r from-red-700 via-yellow-500 to-red-700 shadow-md"></div>
      
      <div className="p-8">
        {/* 标题区域 */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-700 to-yellow-600"></div>
          <h2 className="text-red-900 tracking-widest relative inline-block">
            {activeSection}
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-700 via-yellow-500 to-transparent"></div>
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="relative">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
