import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Upload, Trash2, Download, Building2, AlertCircle, Loader2, X, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getFilesByDepartment, 
  uploadFile, 
  deleteFile, 
  downloadFile,
  getFileViewUrl,
  formatFileSize,
  formatDate,
  type RegulationFile
} from '../../utils/regulationApi';

const departments = ['方丈办公室', '维那', '监院一', '监院二', '监院三'] as const;

export function RegulationContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [files, setFiles] = useState<Record<string, RegulationFile[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, { current: number; total: number }>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 加载所有部门的文件列表
  useEffect(() => {
    const loadFiles = async () => {
      const loadingState: Record<string, boolean> = {};
      const filesState: Record<string, RegulationFile[]> = {};

      for (const dept of departments) {
        loadingState[dept] = true;
        try {
          const response = await getFilesByDepartment(dept);
          if (response.success && response.data) {
            filesState[dept] = response.data;
          } else {
            filesState[dept] = [];
          }
        } catch (error: any) {
          console.error(`加载${dept}文件失败:`, error);
          filesState[dept] = [];
        } finally {
          loadingState[dept] = false;
        }
      }

      setFiles(filesState);
      setLoading(loadingState);
    };

    loadFiles();
  }, []);

  // 处理文件上传（支持批量）
  const handleFileUpload = async (department: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploading(prev => ({ ...prev, [department]: true }));
    setUploadError(prev => ({ ...prev, [department]: '' }));
    setUploadProgress(prev => ({ ...prev, [department]: { current: 0, total: fileArray.length } }));

    const errors: string[] = [];
    let successCount = 0;

    try {
      // 逐个上传文件
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        try {
          const response = await uploadFile(file, department);
          if (response.success) {
            successCount++;
          } else {
            errors.push(`${file.name}: ${response.message || '上传失败'}`);
          }
        } catch (error: any) {
          errors.push(`${file.name}: ${error.message || '上传失败'}`);
        }
        
        // 更新进度
        setUploadProgress(prev => ({
          ...prev,
          [department]: { current: i + 1, total: fileArray.length }
        }));
      }

      // 重新加载该部门的文件列表
      const filesResponse = await getFilesByDepartment(department);
      if (filesResponse.success && filesResponse.data) {
        setFiles(prev => ({ ...prev, [department]: filesResponse.data! }));
      }

      // 显示结果
      if (errors.length > 0) {
        const errorMsg = `成功上传 ${successCount}/${fileArray.length} 个文件。\n失败的文件：\n${errors.join('\n')}`;
        setUploadError(prev => ({ ...prev, [department]: errorMsg }));
      } else if (successCount > 0) {
        // 清空文件输入
        if (fileInputRefs.current[department]) {
          fileInputRefs.current[department]!.value = '';
        }
      }
    } catch (error: any) {
      setUploadError(prev => ({ ...prev, [department]: error.message || '批量上传失败' }));
    } finally {
      setUploading(prev => ({ ...prev, [department]: false }));
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[department];
        return newProgress;
      });
    }
  };

  // 处理文件删除
  const handleFileDelete = async (fileId: number, department: string) => {
    if (!confirm('确定要删除这个文件吗？')) {
      return;
    }

    try {
      const response = await deleteFile(fileId);
      if (response.success) {
        // 重新加载该部门的文件列表
        const filesResponse = await getFilesByDepartment(department);
        if (filesResponse.success && filesResponse.data) {
          setFiles(prev => ({ ...prev, [department]: filesResponse.data! }));
        }
      }
    } catch (error: any) {
      alert('删除失败: ' + (error.message || '未知错误'));
    }
  };

  // 处理文件在线查看（user模式）
  const handleFileView = async (file: RegulationFile, e?: React.MouseEvent) => {
    e?.preventDefault(); // 阻止默认行为
    try {
      const ext = file.original_name.toLowerCase().split('.').pop();
      
      if (ext === 'pdf') {
        // PDF文件可以在浏览器中直接查看，使用新窗口打开
        const url = getFileViewUrl(file.id);
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          alert('无法打开新窗口，请检查浏览器弹窗设置');
        }
      } else {
        // Word/Excel文件，浏览器通常无法直接在线查看
        // 对于这些文件类型，直接使用下载功能以确保文件名正确
        await handleFileDownload(file, e);
      }
    } catch (error: any) {
      alert('打开文件失败: ' + (error.message || '未知错误'));
    }
  };

  // 处理文件下载
  const handleFileDownload = async (file: RegulationFile, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); // 阻止默认行为
      e.stopPropagation(); // 阻止事件冒泡
    }
    try {
      // 确保使用正确的文件名，优先使用original_name
      // 如果original_name为空或undefined，尝试使用file_name，最后使用默认值
      const fileName = (file.original_name && file.original_name.trim()) 
        ? file.original_name.trim() 
        : (file.file_name && file.file_name.trim()) 
          ? file.file_name.trim() 
          : `file-${file.id}`;
      
      // 确保文件名不为空
      if (!fileName || fileName === '') {
        throw new Error('文件名无效');
      }
      
      await downloadFile(file.id, fileName);
    } catch (error: any) {
      alert('下载失败: ' + (error.message || '未知错误'));
    }
  };

  // 获取文件类型图标
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word') || fileType.includes('doc')) return 'Word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'Excel';
    return '文件';
  };

  return (
    <div className="space-y-6">
      {/* 规范管理说明 */}
      <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            规范管理说明
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-amber-900 leading-relaxed">
            本寺院严格遵守佛教戒律和国家宗教政策，建立健全各项规章制度。所有僧众应当自觉遵守寺院规定，共同维护清净庄严的修行环境。规范管理是保障寺院正常运行、提升修行质量的重要基础。
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-300">
            <FileText className="w-4 h-4" />
            <span>{isAdmin ? '点击文件名可下载文档。管理员可以上传和删除文件。' : '点击文件名可在线查看文档，点击下载按钮可下载到本地。'}</span>
          </div>
        </CardContent>
      </Card>

      {/* 部门文件卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department} className="border-2 border-amber-200 bg-white/90 backdrop-blur shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-200">
              <CardTitle className="text-red-900 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {department}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 管理员上传按钮 */}
              {isAdmin && (
                <div className="mb-4 space-y-2">
                  <input
                    ref={(el) => (fileInputRefs.current[department] = el)}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleFileUpload(department, files);
                      }
                    }}
                  />
                  <Button
                    onClick={() => fileInputRefs.current[department]?.click()}
                    disabled={uploading[department]}
                    className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-yellow-50"
                    size="sm"
                  >
                    {uploading[department] ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadProgress[department] ? (
                          `上传中 (${uploadProgress[department].current}/${uploadProgress[department].total})`
                        ) : (
                          '上传中...'
                        )}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        上传文件（可多选）
                      </>
                    )}
                  </Button>
                  {uploadProgress[department] && (
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div
                        className="bg-red-700 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(uploadProgress[department].current / uploadProgress[department].total) * 100}%`
                        }}
                      />
                    </div>
                  )}
                  {uploadError[department] && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <div className="flex items-start justify-between gap-2">
                        <span className="whitespace-pre-wrap flex-1">{uploadError[department]}</span>
                        <button
                          onClick={() => setUploadError(prev => ({ ...prev, [department]: '' }))}
                          className="text-red-600 hover:text-red-800 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 文件列表 */}
              <div className="space-y-2">
                {loading[department] ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                  </div>
                ) : files[department] && files[department].length > 0 ? (
                  files[department].map((file) => (
                    <div
                      key={file.id}
                      className="relative flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                    >
                      <FileText className="w-5 h-5 text-red-800 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={(e) => {
                            if (isAdmin) {
                              handleFileDownload(file, e);
                            } else {
                              handleFileView(file, e);
                            }
                          }}
                          className="text-amber-900 hover:text-red-900 transition-colors text-left w-full flex items-center gap-2 group/file"
                        >
                          <span className="truncate flex-1">{file.original_name}</span>
                          {isAdmin && (
                            <Download className="w-4 h-4 opacity-0 group-hover/file:opacity-100 transition-opacity flex-shrink-0" />
                          )}
                          {!isAdmin && (
                            <Eye className="w-4 h-4 opacity-0 group-hover/file:opacity-100 transition-opacity flex-shrink-0" />
                          )}
                        </button>
                        <div className="flex items-center gap-2 mt-1 text-xs text-amber-700">
                          <span className="bg-red-800 text-yellow-200 px-2 py-0.5 rounded">
                            {getFileTypeIcon(file.file_type)}
                          </span>
                          <span>{formatFileSize(file.file_size)}</span>
                          <span className="text-amber-600">{formatDate(file.created_at)}</span>
                        </div>
                      </div>
                      {/* 浮动下载按钮（user模式）或删除按钮（admin模式） */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!isAdmin && (
                          <button
                            onClick={(e) => handleFileDownload(file, e)}
                            className="text-amber-700 hover:text-red-800 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-amber-100"
                            title="下载到本地"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleFileDelete(file.id, department)}
                            className="text-red-600 hover:text-red-800 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50"
                            title="删除文件"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-amber-600 py-8 text-sm">
                    暂无文件
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
