// Roles grid display for PermissionManagement
import React from 'react';
import { Shield, Users, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';

interface Role {
  id: string;
  name: string;
  users: number;
  description: string;
}

interface PermissionRolesGridProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
}

const roleColors: Record<string, { icon: string; bg: string }> = {
  admin: { icon: 'text-[var(--ds-fg-info)]', bg: 'bg-[var(--ds-bg-info-subtle)]' },
  manager: { icon: 'text-[var(--ds-fg-info)]', bg: 'bg-[var(--ds-bg-info-subtle)]' },
  editor: { icon: 'text-[var(--ds-fg-success)]', bg: 'bg-[var(--ds-bg-success-subtle)]' },
  viewer: { icon: 'text-[var(--ds-text-tertiary)]', bg: 'bg-[var(--ds-bg-secondary)]' },
};

export function PermissionRolesGrid({ roles, onEditRole }: PermissionRolesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up stagger-2">
      {roles.map((role) => {
        const colors = roleColors[role.id] || roleColors.viewer;
        return (
          <div key={role.id} className="card-premium p-6 relative group">
            <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="subtle" size="icon-s" onClick={() => onEditRole(role)}>
                <Edit2 size={16} />
              </Button>
              {role.id !== 'admin' && (
                <Button variant="subtle" size="icon-s" className="hover:text-[var(--ds-fg-danger)] hover:bg-[var(--ds-bg-danger-subtle)]">
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 ${colors.bg} ${colors.icon} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--ds-text-primary)]">{role.name}</h3>
                <div className="text-sm text-[var(--ds-text-tertiary)] flex items-center gap-1 mt-0.5">
                  <Users size={14} /> {role.users} người dùng
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">{role.description}</p>
          </div>
        );
      })}
    </div>
  );
}
