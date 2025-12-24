import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ContentArea } from '../components/ContentArea';

export function OrganizationPage() {
  const [activeSection, setActiveSection] = useState('组织架构');

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* 装饰性背景图案 */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 15h15l-12 9 5 15-13-10-13 10 5-15-12-9h15z' fill='%23b45309' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <ContentArea activeSection={activeSection} />
    </div>
  );
}

