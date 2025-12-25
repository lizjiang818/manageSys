import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface OrganizationNode {
  id: number;
  name: string;
  type: string;
  parent_id: number | null;
  level: number;
  order_index: number;
  leader_name: string | null;
  personnel: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  children?: OrganizationNode[];
}

interface OrganizationTreeResponse {
  success: boolean;
  data: OrganizationNode | null;
  message?: string;
}

export function useOrganization(refreshTrigger?: number) {
  const { token } = useAuth();
  const [tree, setTree] = useState<OrganizationNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationTree = useCallback(async () => {
    if (!token) {
      setError('未登录');
      setIsLoading(false);
      return;
    }

    console.log('fetchOrganizationTree - Starting fetch...');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/organization/tree`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('fetchOrganizationTree - Response status:', response.status);

      if (!response.ok) {
        throw new Error('获取组织架构失败');
      }

      const data: OrganizationTreeResponse = await response.json();
      console.log('fetchOrganizationTree - Response data:', data);

      if (data.success) {
        console.log('fetchOrganizationTree - Setting tree data:', data.data);
        setTree(data.data);
      } else {
        console.error('fetchOrganizationTree - API returned error:', data.message);
        setError(data.message || '获取组织架构失败');
        setTree(null);
      }
    } catch (err: any) {
      console.error('fetchOrganizationTree - Error:', err);
      setError(err.message || '网络错误，请稍后重试');
      setTree(null);
    } finally {
      setIsLoading(false);
      console.log('fetchOrganizationTree - Finished');
    }
  }, [token]);

  useEffect(() => {
    console.log('useOrganization - refreshTrigger changed:', refreshTrigger, 'token:', token ? 'present' : 'missing');
    fetchOrganizationTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  return {
    tree,
    isLoading,
    error,
    refresh: fetchOrganizationTree,
  };
}

