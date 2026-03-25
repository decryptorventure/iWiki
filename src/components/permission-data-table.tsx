// Data permissions table for PermissionManagement
import React from 'react';
import { Users, Folder } from 'lucide-react';
import { Select, DataTable } from '@frontend-team/ui-kit';

interface DataPermission {
  id: string;
  name: string;
  type: 'department' | 'folder';
  access: Record<string, string>;
}

interface Role { id: string; name: string; }

interface PermissionDataTableProps {
  roles: Role[];
  dataPermissions: DataPermission[];
  isEditingMatrix: boolean;
  onAccessChange: (dataIndex: number, roleId: string, value: string) => void;
}

const ACCESS_OPTIONS = [
  { value: 'full', label: 'Toàn quyền' },
  { value: 'write', label: 'Chỉnh sửa' },
  { value: 'read', label: 'Chỉ xem' },
  { value: 'none', label: 'Không có quyền' },
];

export function PermissionDataTable({ roles, dataPermissions, isEditingMatrix, onAccessChange }: PermissionDataTableProps) {
  return (
      <DataTable<DataPermission>
        data={dataPermissions}
        getRowKey={(row) => row.id}
        columns={[
          {
            id: 'source',
            header: 'Nguồn dữ liệu',
            width: 300,
            cell: (data) => (
              <div className="flex items-center gap-3">
                {data.type === 'department'
                  ? <Users size={18} className="text-blue-500" />
                  : <Folder size={18} className="text-orange-500" />}
                <span className="text-sm font-medium text-gray-900">{data.name}</span>
              </div>
            )
          },
          ...roles.map(role => ({
            id: role.id,
            header: () => <div className="text-center">{role.name.split(' ')[0]}</div>,
            width: 120,
            align: 'center' as const,
            cell: (data: DataPermission) => (
              <Select
                options={ACCESS_OPTIONS}
                value={data.access[role.id]}
                onValueChange={(v) => onAccessChange(dataPermissions.indexOf(data), role.id, v as string)}
                disabled={!isEditingMatrix || role.id === 'admin'}
                size="xs"
              />
            )
          }))
        ]}
        className="border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm"
      />
  );
}
