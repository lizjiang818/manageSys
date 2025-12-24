import React, { useState } from 'react';
import { Building2, Info, BookOpen, GraduationCap, Scroll, Users, Trophy, Settings, LogOut, ChevronDown, ChevronRight, User, Briefcase, Building, UsersRound, FileText, Sparkles, BookMarked, BookOpenText, Library, Archive, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  name: string;
  icon: any;
  subItems?: { name: string; icon: any }[];
}

const allMenuItems: MenuItem[] = [
  { name: '组织架构', icon: Building2 },
  { 
    name: '基本信息', 
    icon: Info,
    subItems: [
      { name: '僧众情况', icon: User },
      { name: '执事情况', icon: Briefcase },
      { name: '职工情况', icon: Users },
      { name: '部门情况', icon: Building },
      { name: '民非组织机构', icon: FileText },
    ]
  },
  { 
    name: '规范管理', 
    icon: BookOpen,
    subItems: [
      { name: '管理制度', icon: FileText },
      { name: '管理办法', icon: FileText },
    ]
  },
  { name: '学修生活', icon: GraduationCap },
  { 
    name: '文化灵隐', 
    icon: Scroll,
    subItems: [
      { name: '历史文化研究', icon: BookMarked },
      { name: '传统文化浸润', icon: BookOpenText },
      { name: '灵隐文化出版', icon: FileText },
      { name: '云林图书馆', icon: Library },
      { name: '文物展示馆', icon: Archive },
      { name: '艺术展', icon: Palette },
    ]
  },
  { name: '服务社会', icon: Users },
  { name: '成果成效', icon: Trophy },
  { name: '灵隐1700', icon: Sparkles },
];

const adminMenuItems: MenuItem[] = [
  { name: '管理控制台', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['基本信息']));

  // 根据用户角色过滤菜单
  const getMenuItems = () => {
    if (user?.role === 'admin') {
      // admin显示所有菜单 + 管理控制台
      return [...allMenuItems, ...adminMenuItems];
    } else {
      // user显示除了管理功能以外其他的所有菜单
      return allMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (menuName: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuName)) {
      newExpanded.delete(menuName);
    } else {
      newExpanded.add(menuName);
    }
    setExpandedMenus(newExpanded);
  };

  const isMenuExpanded = (menuName: string) => expandedMenus.has(menuName);

  return (
    <aside className="relative w-64 bg-gradient-to-b from-red-900 via-red-800 to-red-900 shadow-2xl flex flex-col">
      {/* 顶部装饰 */}
      <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-6">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-red-900 border-4 border-yellow-400 flex items-center justify-center shadow-lg">
              <Scroll className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-center text-yellow-50 tracking-widest">灵隐寺</h1>
          {user && (
            <div className="text-center text-yellow-100 text-xs mt-2">
              {user.username} ({user.role === 'admin' ? '管理员' : '普通用户'})
            </div>
          )}
        </div>
      </div>

      {/* 装饰性边框 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = hasSubItems && isMenuExpanded(item.name);
          const isActive = activeSection === item.name || (hasSubItems && item.subItems?.some(sub => activeSection === sub.name));
          
          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleMenu(item.name);
                  } else {
                    onSectionChange(item.name);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-red-900 shadow-lg scale-105' 
                    : 'text-yellow-100 hover:bg-red-800 hover:text-yellow-300 hover:translate-x-1'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-900' : ''}`} />
                <span className="tracking-wide flex-1 text-left">{item.name}</span>
                {hasSubItems && (
                  isExpanded ? (
                    <ChevronDown className={`w-4 h-4 ${isActive ? 'text-red-900' : ''}`} />
                  ) : (
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-900' : ''}`} />
                  )
                )}
              </button>
              
              {/* 子菜单 */}
              {hasSubItems && isExpanded && (
                <div className="ml-4 space-y-1">
                  {item.subItems?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeSection === subItem.name;
                    
                    return (
                      <button
                        key={subItem.name}
                        onClick={() => onSectionChange(subItem.name)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 text-sm
                          ${isSubActive 
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-red-900 shadow-md' 
                            : 'text-yellow-200 hover:bg-red-800/50 hover:text-yellow-300 hover:translate-x-1'
                          }
                        `}
                      >
                        <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-red-900' : ''}`} />
                        <span className="tracking-wide">{subItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 底部装饰和登出按钮 */}
      <div className="p-4 bg-red-950 border-t border-yellow-700/30 space-y-3">
        <Button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-yellow-50 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          登出
        </Button>
        <div className="text-center text-yellow-600 text-xs tracking-widest">
          慈悲 · 包容 · 感恩
        </div>
      </div>
    </aside>
  );
}
