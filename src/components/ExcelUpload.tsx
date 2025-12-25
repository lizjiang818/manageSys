import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ExcelUploadProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ExcelUpload({ onSuccess, onError }: ExcelUploadProps) {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

    if (
      !allowedTypes.includes(selectedFile.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      setErrorMessage('只支持Excel文件格式 (.xlsx, .xls)');
      setUploadStatus('error');
      return;
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setErrorMessage('文件大小不能超过10MB');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setErrorMessage('');
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!file || !token) {
      setErrorMessage('请选择文件或先登录');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/organization/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '上传失败');
      }

      setUploadStatus('success');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 调用成功回调
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setUploadStatus('idle');
        }, 2000);
      } else {
        setTimeout(() => {
          setUploadStatus('idle');
        }, 2000);
      }
    } catch (error: any) {
      setErrorMessage(error.message || '上传失败，请稍后重试');
      setUploadStatus('error');
      if (onError) {
        onError(error.message || '上传失败');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setErrorMessage('');
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
        {/* 文件选择区域 */}
        <div className="space-y-6">
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="excel-upload"
              disabled={isUploading}
            />
            <label htmlFor="excel-upload" className="block">
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer max-w-xs mx-auto">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <File className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-amber-700 font-medium">点击选择文件</span>
                    <p className="text-xs text-amber-600 mt-0.5">支持 .xlsx, .xls 格式</p>
                  </div>
                </div>
              </div>
            </label>
            {file && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-xs mx-auto">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <File className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-amber-900 truncate">{file.name}</div>
                    <div className="text-xs text-amber-600 mt-0.5">{formatFileSize(file.size)}</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                    className="h-8 w-8 p-0 hover:bg-amber-100 text-amber-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 状态提示 */}
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>上传成功！组织架构已更新</span>
            </div>
          )}

          {uploadStatus === 'error' && errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 上传按钮 */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-yellow-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                上传文件
              </>
            )}
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="text-xs text-amber-600 space-y-1 pt-2 border-t border-amber-200">
          <p>• 支持格式：.xlsx, .xls</p>
          <p>• 文件大小：不超过10MB</p>
          <p>• Excel文件需包含：层级、名称、类型、负责人、父节点、排序、人员等列</p>
        </div>
    </div>
  );
}

