import React, { useState } from 'react';
import { 
  Sliders, 
  Thermometer, 
  Droplets, 
  Activity, 
  Compass, 
  Cpu, 
  Plus, 
  Save, 
  Check, 
  ShieldCheck, 
  AlertCircle,
  Pencil
} from 'lucide-react';
import { CargoProfile } from '../types/cargoguard';

interface CargoProfileManagerProps {
  profiles: CargoProfile[];
  onUpdateProfile: (updatedProfile: CargoProfile) => void;
  onCreateProfile?: (newProfile: CargoProfile) => void;
}

export const CargoProfileManager: React.FC<CargoProfileManagerProps> = ({
  profiles,
  onUpdateProfile,
}) => {
  const [selectedId, setSelectedId] = useState<string>(profiles[0]?.id || '');
  const [activeProfile, setActiveProfile] = useState<CargoProfile>(profiles[0]);
  const [saveToast, setSaveToast] = useState(false);

  const handleSelect = (profileId: string) => {
    setSelectedId(profileId);
    const found = profiles.find(p => p.id === profileId);
    if (found) {
      setActiveProfile({ ...found });
    }
  };

  const handleSave = () => {
    onUpdateProfile(activeProfile);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Dynamic Cargo Profile Management & Threshold Calibration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure tolerance envelopes and automated safety directives based on commodity perishability and fragile cargo limits.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-fade-in">
            <Check className="w-4 h-4" />
            Profile Thresholds Updated & Deployed to Fleet Edge Gateways
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Commodity Profiles ({profiles.length})
          </div>

          <div className="space-y-2">
            {profiles.map(p => {
              const isSelected = p.id === selectedId;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 ring-1 ring-blue-500 text-blue-900 dark:text-blue-100 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                    <span>{p.temp_min}°C to {p.temp_max}°C</span>
                    <span>•</span>
                    <span>&lt; {p.shock_threshold_g}G</span>
                    <span>•</span>
                    <span>&lt; {p.strain_threshold_ue} με</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Editor Card */}
        {activeProfile && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Calibrating Profile Limits
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeProfile.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeProfile.description}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                Apply to Edge
              </button>
            </div>

            {/* Threshold Sliders & Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Temperature Bounds */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  <span>Temperature Envelope (°C)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Min Temp (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={activeProfile.temp_min}
                      onChange={(e) => setActiveProfile({ ...activeProfile, temp_min: parseFloat(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Max Temp (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={activeProfile.temp_max}
                      onChange={(e) => setActiveProfile({ ...activeProfile, temp_max: parseFloat(e.target.value) })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity Max */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span>Max Relative Humidity (% RH)</span>
                  </div>
                  <span className="font-mono text-cyan-600">{activeProfile.humidity_max}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={activeProfile.humidity_max}
                  onChange={(e) => setActiveProfile({ ...activeProfile, humidity_max: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-500"
                />
                <div className="text-[10px] text-slate-400">
                  Prevents moisture condensation & cardboard carton weakening
                </div>
              </div>

              {/* Shock Threshold */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <span>Max Shock / Impact G-Force</span>
                  </div>
                  <span className="font-mono text-rose-600">{activeProfile.shock_threshold_g.toFixed(1)} G</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="4.0"
                  step="0.1"
                  value={activeProfile.shock_threshold_g}
                  onChange={(e) => setActiveProfile({ ...activeProfile, shock_threshold_g: parseFloat(e.target.value) })}
                  className="w-full accent-rose-500"
                />
                <div className="text-[10px] text-slate-400">
                  Triaxial impact accelerometer trip limit
                </div>
              </div>

              {/* Tilt Threshold */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <span>Max Tilt / Stability Angle</span>
                  </div>
                  <span className="font-mono text-indigo-600">{activeProfile.tilt_threshold_deg}°</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="25"
                  step="1"
                  value={activeProfile.tilt_threshold_deg}
                  onChange={(e) => setActiveProfile({ ...activeProfile, tilt_threshold_deg: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500"
                />
                <div className="text-[10px] text-slate-400">
                  Container listing / rollover limit angle
                </div>
              </div>

              {/* Date-Palm Graphene Strain Threshold */}
              <div className="md:col-span-2 space-y-3 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-300">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>Date-Palm Carbon Graphene Strain Limit (Microstrain με)</span>
                  </div>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-extrabold text-sm">
                    {activeProfile.strain_threshold_ue} με
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="25"
                  value={activeProfile.strain_threshold_ue}
                  onChange={(e) => setActiveProfile({ ...activeProfile, strain_threshold_ue: parseInt(e.target.value, 10) })}
                  className="w-full accent-purple-600"
                />
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Configures the critical microstrain boundary for the flexible piezoresistive skin patch. Strain exceeding this limit signals pallet tipping against container corrugations or floor frame torsion.
                </p>
              </div>
            </div>

            {/* Configured Preventive Directives */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Automated Preventive Action Templates
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                    On Temperature Breach Directive:
                  </label>
                  <input
                    type="text"
                    value={activeProfile.recommended_actions.temp_breach}
                    onChange={(e) => setActiveProfile({
                      ...activeProfile,
                      recommended_actions: { ...activeProfile.recommended_actions, temp_breach: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                    On Graphene Wall Strain Breach Directive:
                  </label>
                  <input
                    type="text"
                    value={activeProfile.recommended_actions.strain_breach}
                    onChange={(e) => setActiveProfile({
                      ...activeProfile,
                      recommended_actions: { ...activeProfile.recommended_actions, strain_breach: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
