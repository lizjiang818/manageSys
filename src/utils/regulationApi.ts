const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface RegulationFile {
  id: number;
  department: '方丈办公室' | '维那' | '监院一' | '监院二' | '监院三' | '管理办法';
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * 获取认证token
 */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * 上传文件
 */
export async function uploadFile(
  file: File,
  department: string
): Promise<ApiResponse<RegulationFile>> {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('department', department);

  const response = await fetch(`${API_BASE_URL}/regulation/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '上传失败');
  }

  return data;
}

/**
 * 获取部门文件列表
 */
export async function getFilesByDepartment(
  department: string
): Promise<ApiResponse<RegulationFile[]>> {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_BASE_URL}/regulation/files/${encodeURIComponent(department)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '获取文件列表失败');
  }

  return data;
}

/**
 * 在线查看文件
 */
export function getFileViewUrl(fileId: number): string {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }
  return `${API_BASE_URL}/regulation/view/${fileId}?token=${encodeURIComponent(token)}`;
}

/**
 * 下载文件
 */
export async function downloadFile(fileId: number, originalName?: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  // 如果没有提供文件名，先获取文件信息
  let filename = originalName;
  if (!filename || !filename.trim()) {
    try {
      // 尝试从文件列表中找到这个文件
      // 注意：这需要知道文件属于哪个部门，所以这里先使用传入的originalName
      // 如果originalName为空，则从响应头解析
    } catch (e) {
      // 忽略错误，继续使用响应头解析
    }
  }

  const response = await fetch(`${API_BASE_URL}/regulation/download/${fileId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || '下载失败');
  }

  // 优先使用传入的原始文件名
  if (!filename || !filename.trim()) {
    // 如果没有提供原始文件名，尝试从响应头解析
    filename = `file-${fileId}`;
    const contentDisposition = response.headers.get('Content-Disposition');
    
    if (contentDisposition) {
      // 尝试匹配 filename*=UTF-8''encoded-name 格式（RFC 5987）
      const rfc5987Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
      if (rfc5987Match && rfc5987Match[1]) {
        try {
          const parsedName = decodeURIComponent(rfc5987Match[1]);
          if (parsedName && parsedName !== `file-${fileId}`) {
            filename = parsedName;
          }
        } catch (e) {
          // 如果解码失败，继续尝试其他方式
        }
      }
      
      // 如果没有找到RFC 5987格式，尝试匹配 filename="..." 格式
      if (filename === `file-${fileId}`) {
        const quotedMatch = /filename="([^"]+)"/.exec(contentDisposition);
        if (quotedMatch && quotedMatch[1]) {
          try {
            const parsedName = decodeURIComponent(quotedMatch[1]);
            if (parsedName) {
              filename = parsedName;
            }
          } catch (e) {
            filename = quotedMatch[1];
          }
        } else {
          // 尝试匹配 filename=value 格式（无引号）
          const unquotedMatch = /filename=([^;]+)/.exec(contentDisposition);
          if (unquotedMatch && unquotedMatch[1]) {
            try {
              const parsedName = decodeURIComponent(unquotedMatch[1].trim());
              if (parsedName) {
                filename = parsedName;
              }
            } catch (e) {
              filename = unquotedMatch[1].trim();
            }
          }
        }
      }
    }
  } else {
    // 使用传入的文件名
    filename = originalName!.trim();
  }

  // 确保文件名不为空
  if (!filename || filename.trim() === '') {
    filename = `file-${fileId}`;
  }

  // 清理文件名：移除可能的问题字符
  // 移除路径分隔符和其他可能的问题字符
  filename = filename
    .replace(/[\/\\:*?"<>|]/g, '_') // 替换Windows不允许的字符
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim();

  // 确保文件名不为空（清理后）
  if (!filename || filename === '') {
    filename = `file-${fileId}`;
  }

  // 创建blob并下载
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // 使用setAttribute确保文件名正确设置
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // 延迟移除，确保下载开始
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 删除文件
 */
export async function deleteFile(fileId: number): Promise<ApiResponse<void>> {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_BASE_URL}/regulation/file/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '删除失败');
  }

  return data;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

