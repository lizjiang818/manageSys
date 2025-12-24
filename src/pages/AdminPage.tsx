import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ContentArea } from '../components/ContentArea';
import { AdminDashboard } from './AdminDashboard';

export function AdminPage() {
  const [activeSection, setActiveSection] = useState('管理控制台');

  // 如果是管理控制台，显示AdminDashboard，否则使用ContentArea
  const isAdminDashboard = activeSection === '管理控制台';

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
      
      {isAdminDashboard ? (
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
              <AdminDashboard />
            </div>
          </div>
        </main>
      ) : (
        <ContentArea activeSection={activeSection} />
      )}
    </div>
  );
}

