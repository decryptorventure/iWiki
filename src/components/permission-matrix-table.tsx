// Feature permission matrix table for PermissionManagement
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';

interface Permission {
  id: string;
  name: string;
  [roleId: string]: boolean | string;
}

interface Module {
  name: string;
  permissions: Permission[];
}

interface Role { id: string; name: string; }

interface PermissionMatrixTableProps {
  roles: Role[];
  modules: Module[];
  isEditingMatrix: boolean;
  onToggle: (moduleIndex: number, permIndex: number, roleId: string) => void;
}

export function PermissionMatrixTable({ roles, modules, isEditingMatrix, onToggle }: PermissionMatrixTableProps) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm animate-slide-up stagger-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-900 w-1/3">Quyền hạn / Module</th>
              {roles.map(role => (
                <th key={role.id} className="p-4 font-bold text-gray-900 text-center w-1/6">{role.name.split(' ')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map((module, mIdx) => (
              <React.Fragment key={mIdx}>
                <tr className="bg-gray-50/50">
                  <td colSpan={roles.length + 1} className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">
                    {module.name}
                  </td>
                </tr>
                {module.permissions.map((perm, pIdx) => (
                  <tr key={perm.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-sm text-gray-700 font-medium pl-8">{perm.name}</td>
                    {roles.map(role => (
                      <td key={role.id} className="p-4 text-center">
                        <Button
                          variant="subtle"
                          size="icon-s"
                          disabled={!isEditingMatrix || role.id === 'admin'}
                          onClick={() => onToggle(mIdx, pIdx, role.id)}
                          className={`${(perm as any)[role.id] ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-300 hover:bg-gray-100'} ${(!isEditingMatrix || role.id === 'admin') ? 'opacity-70' : ''}`}
                        >
                          {(perm as any)[role.id] ? <Check size={20} /> : <X size={20} />}
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
