import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Users, Settings, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { ExcelUpload } from '../components/ExcelUpload';
import { useOrganizationContext } from '../contexts/OrganizationContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

export function AdminDashboard() {
  const { user } = useAuth();
  const { triggerRefresh } = useOrganizationContext();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const isOpeningRef = useRef(false);

  const handleUploadSuccess = () => {
    console.log('Upload success, triggering refresh...');
    // 触发组织架构数据刷新
    triggerRefresh();
    console.log('Refresh triggered');
    // 延迟关闭对话框，让用户看到成功提示
    setTimeout(() => {
      setIsUploadDialogOpen(false);
      isOpeningRef.current = false;
    }, 1500);
  };

  const handleOpenUploadDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked, current state:', isUploadDialogOpen);
    if (isUploadDialogOpen) {
      return;
    }
    // 先设置标志
    isOpeningRef.current = true;
    // 然后设置状态
    setIsUploadDialogOpen(true);
    console.log('Dialog state set to true');
  };

  // 调试：监听状态变化
  useEffect(() => {
    console.log('isUploadDialogOpen changed to:', isUploadDialogOpen);
    // 当 Dialog 成功打开后，延迟重置标志
    if (isUploadDialogOpen) {
      // 检查 Dialog 是否正确渲染
      setTimeout(() => {
        const dialogElement = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;
        if (dialogElement) {
          console.log('Dialog found in DOM');
          const computedStyle = window.getComputedStyle(dialogElement);
          console.log('Dialog transform:', computedStyle.transform);
          console.log('Dialog z-index:', computedStyle.zIndex);
          console.log('Dialog display:', computedStyle.display);
          console.log('Dialog visibility:', computedStyle.visibility);
          console.log('Dialog opacity:', computedStyle.opacity);
          
          // 确保 transform 正确应用
          if (computedStyle.transform === 'none' || !computedStyle.transform.includes('translate')) {
            console.log('Fixing transform');
            dialogElement.style.top = '50%';
            dialogElement.style.left = '50%';
            dialogElement.style.transform = 'translate(-50%, -50%)';
          }
          
          // 确保 z-index 正确
          if (computedStyle.zIndex === 'auto' || parseInt(computedStyle.zIndex) < 100) {
            console.log('Fixing z-index');
            dialogElement.style.zIndex = '100';
          }
        } else {
          console.log('Dialog NOT found in DOM');
        }
        isOpeningRef.current = false;
      }, 100);
      return () => clearTimeout;
    }
  }, [isUploadDialogOpen]);

  const adminFeatures = [
    {
      title: '组织架构管理',
      description: '管理寺院组织架构，上传Excel文件更新数据',
      icon: Building2,
      color: 'from-red-700 to-red-800',
    },
    {
      title: '用户管理',
      description: '管理系统用户，添加、编辑、删除用户账户',
      icon: Users,
      color: 'from-amber-600 to-amber-700',
    },
    {
      title: '数据管理',
      description: '查看和管理系统数据，备份和恢复数据',
      icon: FileText,
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      title: '系统设置',
      description: '配置系统参数，管理权限和角色',
      icon: Settings,
      color: 'from-orange-600 to-orange-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-red-50 to-amber-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            管理控制台
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800">
            欢迎，<span className="font-semibold text-red-900">{user?.username}</span> 管理员
          </p>
          <p className="text-sm text-amber-700 mt-2">
            您可以在这里管理系统设置、用户权限和组织架构数据
          </p>
        </CardContent>
      </Card>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const isOrganizationManagement = feature.title === '组织架构管理';
          
          return (
            <Card
              key={index}
              className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} text-yellow-50`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-amber-800 mb-4">{feature.description}</p>
                {isOrganizationManagement ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      console.log('Upload button clicked');
                      handleOpenUploadDialog(e);
                    }}
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-yellow-50 px-4 py-2 rounded-md font-medium transition-all`}
                  >
                    上传文件
                  </button>
                ) : (
                  <Button
                    className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-yellow-50`}
                  >
                    进入管理
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 上传Excel对话框 */}
      <Dialog 
        open={isUploadDialogOpen}
        onOpenChange={(open) => {
          setIsUploadDialogOpen(open);
          if (!open) {
            isOpeningRef.current = false;
          }
        }}
      >
        <DialogContent 
          className="max-w-md w-[90%] sm:w-[500px] bg-white border-2 border-amber-200"
          style={{ zIndex: 100, backgroundColor: '#ffffff' }}
        >
          <DialogHeader>
            <DialogTitle className="text-red-900">上传组织架构Excel文件</DialogTitle>
            <DialogDescription className="text-amber-700">
              请选择Excel文件上传，文件格式需符合要求
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ExcelUpload onSuccess={handleUploadSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 调试信息 - 开发环境显示 */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-[9999]">
          Dialog状态: {isUploadDialogOpen ? '打开' : '关闭'}
        </div>
      )}

      {/* 快速操作 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            快速操作
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-yellow-50">
              用户管理
            </Button>
            <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-yellow-50">
              数据备份
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

