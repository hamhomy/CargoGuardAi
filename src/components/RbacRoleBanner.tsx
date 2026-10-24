import React from 'react';
import { 
  Users, 
  Shield, 
  Truck, 
  CheckCircle2, 
  Warehouse, 
  Scale, 
  Lock
} from 'lucide-react';
import { UserRole } from '../types/cargoguard';

interface RbacRoleBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RbacRoleBanner: React.FC<RbacRoleBannerProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const roles: { id: UserRole; name: string; icon: React.ReactNode; desc: string; badge: string }[] = [
    {
      id: 'fleet_manager',
      name: 'Fleet Manager',
      icon: <Shield className="w-3.5 h-3.5 text-blue-500" />,
      desc: 'Global fleet visibility, threshold configuration, multi-channel dispatch',
      badge: 'All Permissions',
    },
    {
      id: 'driver',
      name: 'Driver / Operator',
      icon: <Truck className="w-3.5 h-3.5 text-emerald-500" />,
      desc: 'In-cab turn-by-turn guidance, urgent preventive directives, quick acknowledge',
      badge: 'Operator View',
    },
    {
      id: 'quality_inspector',
      name: 'Quality Inspector',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />,
      desc: 'Cold-chain thermal curves, dewpoint condensation, cargo compliance certification',
      badge: 'Compliance & QA',
    },
    {
      id: 'warehouse_manager',
      name: 'Warehouse Manager',
      icon: <Warehouse className="w-3.5 h-3.5 text-amber-500" />,
      desc: 'Inbound container pre-screening, graphene sidewall load check, dock staging',
      badge: 'Dock Logistics',
    },
    {
      id: 'insurance_auditor',
      name: 'Insurance Auditor',
      icon: <Scale className="w-3.5 h-3.5 text-purple-500" />,
      desc: 'Immutable SHA-256 evidence chain verification, claim loss mitigation',
      badge: 'Audit & Claims',
    },
  ];

  const active = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
          <Users className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active RBAC Persona:
            </span>
            <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1">
              {active.name}
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {active.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {active.desc}
          </p>
        </div>
      </div>

      {/* Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        {roles.map(r => {
          const isSelected = r.id === currentRole;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoleChange(r.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r.icon}
              <span className="hidden sm:inline">{r.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
