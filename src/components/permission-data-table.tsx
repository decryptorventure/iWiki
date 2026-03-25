// Data permissions table for PermissionManagement
import React from 'react';
import { Users, Folder } from 'lucide-react';
import { Select } from '@frontend-team/ui-kit';

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
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm animate-slide-up stagger-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-900 w-1/3">Nguồn dữ liệu</th>
              {roles.map(role => (
                <th key={role.id} className="p-4 font-bold text-gray-900 text-center w-1/6">{role.name.split(' ')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataPermissions.map((data, dIdx) => (
              <tr key={data.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {data.type === 'department'
                      ? <Users size={18} className="text-blue-500" />
                      : <Folder size={18} className="text-orange-500" />}
                    <span className="text-sm font-medium text-gray-900">{data.name}</span>
                  </div>
                </td>
                {roles.map(role => (
                  <td key={role.id} className="p-4 text-center">
                    <Select
                      options={ACCESS_OPTIONS}
                      value={data.access[role.id]}
                      onValueChange={(v) => onAccessChange(dIdx, role.id, v as string)}
                      disabled={!isEditingMatrix || role.id === 'admin'}
                      size="xs"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
