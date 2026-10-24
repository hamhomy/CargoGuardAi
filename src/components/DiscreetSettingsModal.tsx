import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sliders, 
  Cpu, 
  Bell, 
  Users, 
  Database, 
  Calculator, 
  Server, 
  Save, 
  Check, 
  Leaf
} from 'lucide-react';
import { CargoProfile, UserRole } from '../types/cargoguard';
import { INITIAL_CARGO_PROFILES } from '../data/cargoProfiles';
import { CargoProfileManager } from './CargoProfileManager';
import { FinancialRoiCalculator } from './FinancialRoiCalculator';
import { ArchitectureExplorer } from './ArchitectureExplorer';
import { DatabaseSchemaViewer } from './DatabaseSchemaViewer';

interface DiscreetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  cargoProfiles: CargoProfile[];
  onUpdateCargoProfile: (profile: CargoProfile) => void;
}

export const DiscreetSettingsModal: React.FC<DiscreetSettingsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  cargoProfiles,
  onUpdateCargoProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'devices' | 'notifications' | 'users' | 'roi' | 'architecture' | 'database'>('profiles');
  const [smsPhone, setSmsPhone] = useState('+966 50 123 4567');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Configuration & Administration
              </h3>
              <p className="text-xs text-slate-500">
                Manage cargo profiles, date-palm graphene sensors, notification rules, and role permissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSettings && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cargo Profiles & Limits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Date-Palm Graphene Devices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notification Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Roles & RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'roi'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-500" />
            <span>ROI Calculator (SAR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Architecture & Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Schema</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Cargo Profiles */}
          {activeTab === 'profiles' && (
            <CargoProfileManager
              profiles={cargoProfiles}
              onUpdateProfile={onUpdateCargoProfile}
            />
          )}

          {/* Tab 2: Devices & Graphene Calibration */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase">
                  <Leaf className="w-4 h-4" />
                  Date-Palm Pit Carbon + Graphene Sensor Calibration
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Novel flexible piezoresistive skin produced from sustainable Saudi date-palm pit biomass. Calibrated gauge factor GF = 142.5 allows microstrain precision for ISO container side-wall deformation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">PIEZORESISTIVE GAUGE FACTOR</span>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">GF ≈ 142.5</div>
                  <span className="text-[11px] text-emerald-600">3.8x sensitivity vs metallic foil</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">NOMINAL BASELINE RESISTANCE</span>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">12,500 Ω</div>
                  <span className="text-[11px] text-slate-500">R0 baseline zero-strain</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold">ACTIVE BATCH ID</span>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">KSA-KAUST-DPG-26</div>
                  <span className="text-[11px] text-slate-500">Saudi Nanotech Certified</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Notification Rules */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Multi-Channel Dispatch Thresholds
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Immediate SMS Driver Broadcast (Unifonic / Twilio)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dispatched when thermal or shock exceed critical threshold for &gt; 5 min
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Mobile App Push Notifications (Firebase FCM)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Real-time alert notifications to driver and warehouse receiving dock
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Escalation Mobile Dispatch Number (KSA)
                  </label>
                  <input
                    type="text"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Notification Rules
              </button>
            </div>
          )}

          {/* Tab 4: Roles & RBAC */}
          {activeTab === 'users' && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active User Persona & Role Permissions
              </h4>

              <div className="space-y-2">
                {[
                  { id: 'fleet_manager' as UserRole, name: 'Fleet Manager', desc: 'Full dispatch control, threshold configuration, live override.' },
                  { id: 'driver' as UserRole, name: 'Driver / Operator', desc: 'In-cab turn-by-turn guidance, immediate stop alerts, single-tap acknowledge.' },
                  { id: 'quality_inspector' as UserRole, name: 'Quality Inspector', desc: 'Cold-chain thermal curves, dewpoint condensation, cargo compliance signoff.' },
                  { id: 'warehouse_manager' as UserRole, name: 'Warehouse Manager', desc: 'Inbound container pre-screening, graphene sidewall load check, dock staging.' },
                  { id: 'insurance_auditor' as UserRole, name: 'Insurance Auditor', desc: 'Immutable SHA-256 evidence chain verification, claim loss mitigation.' },
                ].map((r) => {
                  const isSelected = r.id === currentRole;
                  return (
                    <div
                      key={r.id}
                      onClick={() => onRoleChange(r.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</span>
                        {isSelected && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">ACTIVE</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 5: ROI Calculator */}
          {activeTab === 'roi' && (
            <FinancialRoiCalculator />
          )}

          {/* Tab 6: Architecture & Code */}
          {activeTab === 'architecture' && (
            <ArchitectureExplorer />
          )}

          {/* Tab 7: Database Schema */}
          {activeTab === 'database' && (
            <DatabaseSchemaViewer />
          )}
        </div>
      </div>
    </div>
  );
};
