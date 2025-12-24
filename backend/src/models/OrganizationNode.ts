export interface OrganizationNode {
  id?: number;
  name: string;
  type: 'committee' | 'position' | 'department' | 'sub_department';
  parent_id: number | null;
  level: number;
  order_index: number;
  leader_name: string | null;
  personnel: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationNodeWithChildren extends OrganizationNode {
  children?: OrganizationNodeWithChildren[];
}

