import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Users, User, Building, RefreshCw, AlertCircle } from "lucide-react";
import { useOrganization } from "../../hooks/useOrganization";
import { transformOrganizationTree } from "../../utils/organizationTransform";
import { Button } from "../ui/button";
import { useOrganizationContext } from "../../contexts/OrganizationContext";

export function OrganizationContent() {
  const { refreshTrigger } = useOrganizationContext();
  const { tree, isLoading, error, refresh } = useOrganization(refreshTrigger);
  
  console.log('OrganizationContent - refreshTrigger:', refreshTrigger, 'isLoading:', isLoading, 'hasTree:', !!tree);

  // 转换数据格式
  const { departments, totalMembers, totalDepartments, totalLeaders } = transformOrganizationTree(tree);
  
  console.log('OrganizationContent - tree:', tree);
  if (tree) {
    console.log('OrganizationContent - tree.children:', tree.children);
    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child, idx) => {
        console.log(`OrganizationContent - child[${idx}]:`, child.name, 'type:', child.type, 'children:', child.children?.length || 0);
      });
    }
  }
  console.log('OrganizationContent - departments:', departments);
  console.log('OrganizationContent - totalMembers:', totalMembers, 'totalDepartments:', totalDepartments);

  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-4" />
              <p className="text-amber-700">加载组织架构数据中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                onClick={refresh}
                className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-yellow-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 空数据状态 - 只有当完全没有 tree 时才显示
  if (!tree) {
    console.log('OrganizationContent - Rendering empty state, no tree');
    return (
      <div className="space-y-6">
        <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <Building className="w-8 h-8 text-amber-600 mb-4" />
              <p className="text-amber-700 mb-4">暂无组织架构数据</p>
              <p className="text-sm text-amber-600">请管理员上传Excel文件更新组织架构</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 获取根节点信息（住持）
  const rootNode = tree;
  const rootName = rootNode.name || '住持';
  const rootLeader = rootNode.leader_name || '';

  console.log('OrganizationContent - Rendering content, rootName:', rootName, 'departments.length:', departments.length);

  return (
    <div className="space-y-6">
      {/* 组织架构树形图 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <Building className="w-5 h-5" />
              寺院组织架构
            </CardTitle>
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-x-auto">
          <div className="min-w-max">
            {/* 第一层：根节点（住持/方丈） */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-gradient-to-r from-red-700 to-red-800 text-yellow-50 px-8 py-4 rounded-lg shadow-lg border-2 border-amber-400 relative">
                <div className="tracking-widest text-center">
                  {rootName}
                </div>
                {rootLeader && rootLeader.trim() !== '' && (
                  <div className="text-sm mt-1 text-yellow-200 text-center">
                    {rootLeader}
                  </div>
                )}
                {/* 向下的连接线 */}
                {departments.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-8 bg-amber-400"></div>
                )}
              </div>
            </div>

            {/* 第二层：主要部门 */}
            {departments.length > 0 && (
              <div className="relative">
                {/* 横向连接线 */}
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-amber-400"></div>

                <div className="flex gap-4 pt-8 flex-nowrap overflow-x-auto">
                {departments.map((dept, deptIndex) => (
                  <div
                    key={deptIndex}
                    className="flex flex-col items-center"
                  >
                    {/* 向上的连接线到横线 */}
                    <div className="w-0.5 h-8 bg-amber-400 -mt-8"></div>

                    {/* 部门框 */}
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-400 rounded-lg px-4 py-3 shadow-md min-w-[140px] relative">
                      <div className="text-red-900 text-center">
                        {dept.name}
                      </div>
                      {dept.leader && dept.leader.trim() !== '' && (
                        <div className="text-xs text-amber-700 text-center mt-1">
                          {dept.leader}
                        </div>
                      )}
                      {/* 向下的连接线 */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-6 bg-amber-400"></div>
                    </div>

                    {/* 第三层：小组 */}
                    <div className="mt-6 relative w-full">
                      {dept.subDepartments.length > 1 && (
                        <div className="absolute left-0 right-0 top-0 h-0.5 bg-amber-300"></div>
                      )}

                      <div
                        className={`grid gap-3 pt-6 ${
                          dept.subDepartments.length === 1
                            ? "grid-cols-1"
                            : dept.subDepartments.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-1"
                        }`}
                      >
                        {dept.subDepartments.map(
                          (subDept, subIndex) => (
                            <div
                              key={subIndex}
                              className="flex flex-col items-center"
                            >
                              {dept.subDepartments.length >
                                1 && (
                                <div className="w-0.5 h-6 bg-amber-300 -mt-6"></div>
                              )}

                              {/* 小组框 */}
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-300 rounded px-3 py-2 shadow-sm text-center min-w-[120px] relative">
                                <div className="text-amber-900 text-sm">
                                  {subDept.name}
                                </div>
                                {subDept.members &&
                                  subDept.members.length >
                                    0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-4 bg-amber-300"></div>
                                  )}
                              </div>

                              {/* 第四层：人员 */}
                              {subDept.members &&
                                subDept.members.length > 0 && (
                                  <div className="mt-4 space-y-1.5 w-full">
                                    {subDept.members.map(
                                      (member, memberIndex) => {
                                        // 确保 member 是对象且有 name 属性
                                        if (!member || typeof member !== 'object') {
                                          return null;
                                        }
                                        
                                        const memberName = member.name;
                                        if (!memberName || typeof memberName !== 'string') {
                                          return null;
                                        }
                                        
                                        // name 字段应该已经包含了完整的显示文本（如"张三：组长"）
                                        // 直接使用，确保使用中文冒号
                                        const displayText = memberName.replace(/:/g, '：');
                                        
                                        // 只渲染一个卡片，包含姓名和职位（如果有）
                                        return (
                                          <div
                                            key={memberIndex}
                                            className="bg-white/70 border border-amber-200 rounded px-2 py-1.5 text-center"
                                          >
                                            <div className="flex items-center justify-center gap-1.5">
                                              <User className="w-3 h-3 text-amber-600" />
                                              <span className="text-amber-900 text-xs">
                                                {displayText}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur">
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 text-red-800 mx-auto mb-2" />
            <div className="text-red-900">僧众总数</div>
            <div className="text-red-800 mt-1">
              {totalMembers}人
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur">
          <CardContent className="p-6 text-center">
            <Building className="w-8 h-8 text-red-800 mx-auto mb-2" />
            <div className="text-red-900">部门数量</div>
            <div className="text-red-800 mt-1">
              {totalDepartments}个
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-red-800 mx-auto mb-2" />
            <div className="text-red-900">管理层</div>
            <div className="text-red-800 mt-1">
              {totalLeaders}人
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}