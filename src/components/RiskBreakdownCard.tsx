import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Activity, 
  Compass, 
  Cpu, 
  HelpCircle,
  Sliders,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ContainerEntity, CargoProfile } from '../types/cargoguard';
import { RISK_WEIGHTS, calculateOverallRisk } from '../utils/riskEngine';

interface RiskBreakdownCardProps {
  container: ContainerEntity;
  profile: CargoProfile;
  onUpdateTelemetry?: (updatedTelemetry: Partial<ContainerEntity['latest_telemetry']>) => void;
}

export const RiskBreakdownCard: React.FC<RiskBreakdownCardProps> = ({
  container,
  profile,
  onUpdateTelemetry,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);

  const evaluation = container.latest_risk;
  const { subscores, total_risk, risk_level, primary_driver, recommendations } = evaluation;

  // Color schemes based on total risk score
  const getBadgeStyle = () => {
    if (total_risk >= 65) {
      return {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        ring: 'text-rose-500',
        indicator: 'bg-rose-500',
        label: 'CRITICAL DAMAGE RISK',
      };
    }
    if (total_risk >= 35) {
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        ring: 'text-amber-500',
        indicator: 'bg-amber-500',
        label: 'ELEVATED / WARNING',
      };
    }
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      ring: 'text-emerald-500',
      indicator: 'bg-emerald-500',
      label: 'NOMINAL / SAFE',
    };
  };

  const style = getBadgeStyle();

  // Helper for progress bar color
  const getSubscoreColor = (score: number) => {
    if (score >= 65) return 'bg-rose-500';
    if (score >= 35) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI Damage Risk Engine (Mathematical Model)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              ISO {container.container_code}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Real-Time Cargo Risk Breakdown
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            aria-label="Toggle formula breakdown explanation"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Formula Spec</span>
          </button>
          
          <button
            type="button"
            onClick={() => setInteractiveMode(!interactiveMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              interactiveMode 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            aria-label="Toggle live simulation sliders"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{interactiveMode ? 'Active Tuning' : 'Tune Values'}</span>
          </button>
        </div>
      </div>

      {/* Main Score Display Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Score Ring / Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="relative flex items-center justify-center">
            {/* Circular Gauge Visual */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * Math.min(100, total_risk)) / 100}
                strokeLinecap="round"
                className={`${style.ring} transition-all duration-700 ease-out`}
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {total_risk.toFixed(1)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                / 100 SCORE
              </span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${style.bg}`}>
            <span className={`w-2 h-2 rounded-full ${style.indicator} animate-pulse`} />
            {style.label}
          </div>

          <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Primary Risk Driver:{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {primary_driver}
            </span>
          </div>
        </div>

        {/* Detailed 5 Component Progress Bars */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Formula Line */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-2.5 rounded-lg text-xs font-mono text-slate-700 dark:text-blue-200 flex flex-wrap items-center justify-between gap-1">
            <span className="font-semibold text-blue-700 dark:text-blue-300">R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)</span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-sans font-medium">
              = {(0.25 * subscores.T).toFixed(1)} + {(0.20 * subscores.H).toFixed(1)} + {(0.25 * subscores.S).toFixed(1)} + {(0.15 * subscores.L).toFixed(1)} + {(0.15 * subscores.D).toFixed(1)}
            </span>
          </div>

          {/* Component 1: T - Thermal Exposure */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span>Thermal Exposure Risk (T)</span>
                <span className="text-[10px] text-slate-400">(W: 25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {container.latest_telemetry.temperature.toFixed(1)}°C (Limit: {profile.temp_min} to {profile.temp_max}°C)
                </span>
                <span className="font-bold text-slate-900 dark:text-white w-8 text-right">
                  {subscores.T}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSubscoreColor(subscores.T)} transition-all duration-500 rounded-full`}
                style={{ width: `${subscores.T}%` }}
              />
            </div>
            {interactiveMode && onUpdateTelemetry && (
              <input
                type="range"
                min="-10"
                max="45"
                step="0.5"
                value={container.latest_telemetry.temperature}
                onChange={(e) => onUpdateTelemetry({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 h-1 mt-1 cursor-pointer"
                aria-label="Adjust container temperature"
              />
            )}
          </div>

          {/* Component 2: H - Humidity Risk */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                <span>Humidity Risk (H)</span>
                <span className="text-[10px] text-slate-400">(W: 20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {container.latest_telemetry.humidity.toFixed(0)}% RH (Max: {profile.humidity_max}%)
                </span>
                <span className="font-bold text-slate-900 dark:text-white w-8 text-right">
                  {subscores.H}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSubscoreColor(subscores.H)} transition-all duration-500 rounded-full`}
                style={{ width: `${subscores.H}%` }}
              />
            </div>
            {interactiveMode && onUpdateTelemetry && (
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={container.latest_telemetry.humidity}
                onChange={(e) => onUpdateTelemetry({ humidity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 h-1 mt-1 cursor-pointer"
                aria-label="Adjust humidity percentage"
              />
            )}
          </div>

          {/* Component 3: S - Shock & Vibration */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>Shock & Dynamic Impact (S)</span>
                <span className="text-[10px] text-slate-400">(W: 25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {container.latest_telemetry.shock_g.toFixed(2)}G (Max: {profile.shock_threshold_g}G)
                </span>
                <span className="font-bold text-slate-900 dark:text-white w-8 text-right">
                  {subscores.S}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSubscoreColor(subscores.S)} transition-all duration-500 rounded-full`}
                style={{ width: `${subscores.S}%` }}
              />
            </div>
            {interactiveMode && onUpdateTelemetry && (
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={container.latest_telemetry.shock_g}
                onChange={(e) => onUpdateTelemetry({ shock_g: parseFloat(e.target.value) })}
                className="w-full accent-rose-500 h-1 mt-1 cursor-pointer"
                aria-label="Adjust shock G-force"
              />
            )}
          </div>

          {/* Component 4: L - Tilt / Stability */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tilt & Stability Angle (L)</span>
                <span className="text-[10px] text-slate-400">(W: 15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {Math.abs(container.latest_telemetry.tilt_deg).toFixed(1)}° (Max: {profile.tilt_threshold_deg}°)
                </span>
                <span className="font-bold text-slate-900 dark:text-white w-8 text-right">
                  {subscores.L}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSubscoreColor(subscores.L)} transition-all duration-500 rounded-full`}
                style={{ width: `${subscores.L}%` }}
              />
            </div>
            {interactiveMode && onUpdateTelemetry && (
              <input
                type="range"
                min="0"
                max="35"
                step="0.5"
                value={Math.abs(container.latest_telemetry.tilt_deg)}
                onChange={(e) => onUpdateTelemetry({ tilt_deg: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1 mt-1 cursor-pointer"
                aria-label="Adjust container tilt angle"
              />
            )}
          </div>

          {/* Component 5: D - Novel Carbon-Graphene Mechanical Strain */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-900 dark:text-purple-300 font-semibold">Date-Palm Graphene Strain (D)</span>
                <span className="text-[10px] text-slate-400">(W: 15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {container.latest_telemetry.strain_microstrain} με (Limit: {profile.strain_threshold_ue} με)
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-300 w-8 text-right">
                  {subscores.D}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSubscoreColor(subscores.D)} transition-all duration-500 rounded-full`}
                style={{ width: `${subscores.D}%` }}
              />
            </div>
            {interactiveMode && onUpdateTelemetry && (
              <input
                type="range"
                min="50"
                max="1200"
                step="10"
                value={container.latest_telemetry.strain_microstrain}
                onChange={(e) => onUpdateTelemetry({ strain_microstrain: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 h-1 mt-1 cursor-pointer"
                aria-label="Adjust graphene strain sensor microstrain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Formula Explanation Disclosure (if toggled) */}
      {showFormulaDetails && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Mathematical Definition & Weight Allocation
          </div>
          <p className="leading-relaxed">
            The CargoGuard AI™ damage risk model calculates composite vulnerability <span className="font-mono font-semibold">R</span> by weighting real-time sensor streams normalized into <span className="font-mono">0–100</span> threat index spaces:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
            <li><strong className="text-slate-800 dark:text-slate-200">0.25(T):</strong> Thermal exposure severity calculated against profile baseline [T_min, T_max].</li>
            <li><strong className="text-slate-800 dark:text-slate-200">0.20(H):</strong> Atmospheric humidity & condensation risk beyond safe threshold.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">0.25(S):</strong> Dynamic 3-axis G-force impact vector & road surface shock.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">0.15(L):</strong> Angular tilt & list exceeding structural stability threshold.</li>
            <li><strong className="text-slate-800 dark:text-slate-200">0.15(D):</strong> Mechanical microstrain (με) captured by the novel date-palm pit carbon + graphene flexible patch, reflecting cargo load shifts and sidewall pressure before visible puncture or buckling occurs.</li>
          </ul>
        </div>
      )}

      {/* Automated Preventive Recommendations Banner */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            {total_risk >= 65 ? (
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            ) : total_risk >= 35 ? (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            )}
            Automated Preventive Directives (Driver & Fleet Manager)
          </div>
          <span className="text-[11px] text-slate-400">
            {recommendations.length} Active Directives
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
