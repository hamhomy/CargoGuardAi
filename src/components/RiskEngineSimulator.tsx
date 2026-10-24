import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Leaf, 
  Layers, 
  Gauge,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { CargoProfile } from '../types/cargoguard';
import { INITIAL_CARGO_PROFILES } from '../data/cargoProfiles';
import { RISK_WEIGHTS } from '../utils/riskEngine';

export const RiskEngineSimulator: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(INITIAL_CARGO_PROFILES[0].id);

  // Raw component inputs (0 - 100 normalized risk score simulation)
  const [T, setT] = useState<number>(35); // Thermal risk
  const [H, setH] = useState<number>(20); // Humidity risk
  const [S, setS] = useState<number>(55); // Shock risk
  const [L, setL] = useState<number>(15); // Tilt risk
  const [D, setD] = useState<number>(45); // Carbon-Graphene Strain risk

  const profile = INITIAL_CARGO_PROFILES.find(p => p.id === selectedProfileId) || INITIAL_CARGO_PROFILES[0];

  // Exact Mathematical Formula calculation
  // R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
  const weightedT = RISK_WEIGHTS.T * T;
  const weightedH = RISK_WEIGHTS.H * H;
  const weightedS = RISK_WEIGHTS.S * S;
  const weightedL = RISK_WEIGHTS.L * L;
  const weightedD = RISK_WEIGHTS.D * D;

  const totalR = Number((weightedT + weightedH + weightedS + weightedL + weightedD).toFixed(1));

  const resetToBaseline = () => {
    setT(15);
    setH(12);
    setS(10);
    setL(8);
    setD(14);
  };

  const getRiskStatus = (score: number) => {
    if (score >= 65) return { label: 'CRITICAL HAZARD', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' };
    if (score >= 35) return { label: 'ELEVATED WARNING', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    return { label: 'SAFE / NOMINAL', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
  };

  const status = getRiskStatus(totalR);

  return (
    <div className="space-y-8">
      {/* Overview & Novel Sensor Feature Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-900/40 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Leaf className="w-3.5 h-3.5" />
              <span>Novel Sensor: Date-Palm Pit Carbon + Graphene Flexible Strain Matrix</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              AI Damage Risk Engine & Mathematical Formulation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              CargoGuard AI™ integrates a novel sustainable nanomaterial sensor derived from Saudi date-palm pit biomass pyrolysis infused with functionalized graphene. The flexible piezoresistive skin detects microstrain on container sidewalls, predicting mechanical crushing and load shifts long before external structural failure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono space-y-1">
            <div className="text-[11px] text-slate-400">GRAPHENE SENSOR GAUGE FACTOR</div>
            <div className="text-2xl font-black text-purple-400">GF ≈ 142.5</div>
            <div className="text-[10px] text-emerald-400">3.8x Sensitivity vs Metal Foils</div>
          </div>
        </div>
      </div>

      {/* Simulator Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Sliders & Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Risk Parameters Simulator
              </h3>
            </div>

            <button
              type="button"
              onClick={resetToBaseline}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Target Profile Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Active Cargo Calibration Profile:
            </label>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {INITIAL_CARGO_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* 5 Sliders for T, H, S, L, D */}
          <div className="space-y-5">
            {/* T */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Thermal Exposure Risk (T) — 25% Weight
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {T} / 100 <span className="text-slate-400 text-[11px]">(+{(0.25 * T).toFixed(1)} pts)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={T}
                onChange={(e) => setT(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
                aria-label="Thermal exposure risk slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Cryo Safe)</span>
                <span>50 (Threshold Boundary)</span>
                <span>100 (Severe Heat Spoiling)</span>
              </div>
            </div>

            {/* H */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Humidity & Moisture Risk (H) — 20% Weight
                </span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {H} / 100 <span className="text-slate-400 text-[11px]">(+{(0.20 * H).toFixed(1)} pts)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={H}
                onChange={(e) => setH(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer"
                aria-label="Humidity risk slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Dry Desiccated)</span>
                <span>50 (Warning RH Limit)</span>
                <span>100 (Dewpoint Condensation)</span>
              </div>
            </div>

            {/* S */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Shock & Dynamic Vibration Risk (S) — 25% Weight
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {S} / 100 <span className="text-slate-400 text-[11px]">(+{(0.25 * S).toFixed(1)} pts)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={S}
                onChange={(e) => setS(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer"
                aria-label="Shock risk slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Smooth Highway)</span>
                <span>50 (Pothole &gt; 2.2G)</span>
                <span>100 (Violent Impact / Collision)</span>
              </div>
            </div>

            {/* L */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Tilt & Stability Angle Risk (L) — 15% Weight
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {L} / 100 <span className="text-slate-400 text-[11px]">(+{(0.15 * L).toFixed(1)} pts)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={L}
                onChange={(e) => setL(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
                aria-label="Tilt risk slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0° (Level Deck)</span>
                <span>50 (12° Bank Angle)</span>
                <span>100 (Rollover Incline &gt; 30°)</span>
              </div>
            </div>

            {/* D */}
            <div className="space-y-1.5 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  Date-Palm Graphene Strain (D) — 15% Weight
                </span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                  {D} / 100 <span className="text-slate-400 text-[11px]">(+{(0.15 * D).toFixed(1)} pts)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={D}
                onChange={(e) => setD(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer"
                aria-label="Date-palm graphene strain risk slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Elastic Baseline)</span>
                <span>50 (Load Wall Bulge &gt; 600 με)</span>
                <span>100 (Structural Wall Fracture)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Formula Outcome & Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Calculated Overall Risk (R)
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalR.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100.0</span>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {status.label}
            </div>

            {/* Formula Breakdown Math Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 pb-1.5">
                Exact Formula Evaluator:
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                R = 0.25({T}) + 0.20({H}) + 0.25({S}) + 0.15({L}) + 0.15({D})
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-bold">
                R = {weightedT.toFixed(2)} + {weightedH.toFixed(2)} + {weightedS.toFixed(2)} + {weightedL.toFixed(2)} + {weightedD.toFixed(2)}
              </div>
              <div className="text-slate-900 dark:text-white font-extrabold text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                Total Score = {totalR.toFixed(1)}
              </div>
            </div>

            {/* Recommendations preview */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Automated Preventive Recommendation:
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {totalR >= 65
                  ? 'CRITICAL ALERT: Immediately mandate driver safety halt. Inspect internal temperature setpoint and inspect cargo load strapping.'
                  : totalR >= 35
                  ? 'CAUTION: Elevated risk detected. Notify fleet supervisor to monitor driver road speed and verify reefer battery level.'
                  : 'STATUS NOMINAL: Continuous background sensor telemetry within profile specifications. No intervention needed.'}
              </p>
            </div>
          </div>

          {/* Technical Nanomaterial Spotlight Card */}
          <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Sensor Innovation Spotlight
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Why Date-Palm Biomass Carbon + Graphene?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Saudi Arabia generates over 250,000 tons of date-palm pits annually. CargoGuard upcycles this abundant biomass via single-step activation into highly mesoporous conductive carbon, blended with exfoliated graphene nanosheets onto a flexible polyimide substrate.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-mono pt-1">
              <div className="bg-white/60 dark:bg-purple-900/20 p-2 rounded border border-purple-500/20">
                <span className="text-slate-400 block text-[9px]">RESPONSE TIME</span>
                &lt; 28 ms (Instant)
              </div>
              <div className="bg-white/60 dark:bg-purple-900/20 p-2 rounded border border-purple-500/20">
                <span className="text-slate-400 block text-[9px]">DURABILITY</span>
                &gt; 50,000 Cycles
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
