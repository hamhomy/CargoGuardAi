import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  ArrowRight,
  PieChart,
  Percent,
  Check
} from 'lucide-react';
import { calculateRoiImpact, RoiInputs } from '../utils/roiCalculator';

export const FinancialRoiCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<RoiInputs>({
    annualShipments: 5000,
    avgCargoValueSar: 250000, // 250k SAR per container
    baselineDamageRatePct: 4.0, // Default 4% damage
    targetReductionPct: 40.0,   // Target 40% reduction
    sensorDeviceCostPerTripSar: 180, // Platform & hardware service fee
    insuranceDiscountPct: 12.0, // 12% premium discount from underwriters
    avgInsurancePremiumPerTripSar: 1200, // 1,200 SAR per container insurance
  });

  const results = calculateRoiImpact(inputs);

  // Formatter for SAR currency
  const formatSar = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(val) + ' SAR';
  };

  const formatUsd = (val: number) => {
    return '$' + new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Operational Economics & Investment ROI
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Financial & Damage Reduction Impact Calculator (Saudi Riyals - SAR)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quantify direct loss reduction, lower insurance premiums, and projected net return on investment across your container fleet.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
          <Coins className="w-4 h-4" />
          <span>Pegged Conversion: 1 SAR = 0.267 USD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fleet Operational Parameters
            </h3>
          </div>

          <div className="space-y-4">
            {/* Annual Shipments */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Annual Container Shipments</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {inputs.annualShipments.toLocaleString()} Containers
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={inputs.annualShipments}
                onChange={(e) => setInputs({ ...inputs, annualShipments: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>500</span>
                <span>25,000</span>
                <span>50,000</span>
              </div>
            </div>

            {/* Average Cargo Value */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Average Cargo Value per Container (SAR)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatSar(inputs.avgCargoValueSar)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="25000"
                value={inputs.avgCargoValueSar}
                onChange={(e) => setInputs({ ...inputs, avgCargoValueSar: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-700 dark:accent-slate-300"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50,000 SAR</span>
                <span>500,000 SAR</span>
                <span>1,000,000 SAR</span>
              </div>
            </div>

            {/* Baseline Damage Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Industry Baseline Cargo Damage Rate</span>
                <span className="font-mono font-bold text-rose-600">
                  {inputs.baselineDamageRatePct.toFixed(1)}% (Default 4.0%)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.2"
                value={inputs.baselineDamageRatePct}
                onChange={(e) => setInputs({ ...inputs, baselineDamageRatePct: parseFloat(e.target.value) })}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.0%</span>
                <span>4.0% (Average)</span>
                <span>12.0% (Fragile/Reefer)</span>
              </div>
            </div>

            {/* CargoGuard AI Damage Reduction Target */}
            <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  CargoGuard AI™ Target Damage Reduction %
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {inputs.targetReductionPct.toFixed(1)}% (Target 40%)
                </span>
              </div>
              <input
                type="range"
                min="15.0"
                max="75.0"
                step="1.0"
                value={inputs.targetReductionPct}
                onChange={(e) => setInputs({ ...inputs, targetReductionPct: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                Preventive alerts & date-palm graphene strain detection intercept cargo shift & thermal runaway.
              </div>
            </div>

            {/* Insurance Premium Discount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Underwriter Insurance Premium Discount</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {inputs.insuranceDiscountPct.toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={inputs.insuranceDiscountPct}
                onChange={(e) => setInputs({ ...inputs, insuranceDiscountPct: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-[10px] text-slate-400">
                Achieved via cryptographically verified immutable trip audit logs
              </div>
            </div>
          </div>
        </div>

        {/* Right Financial ROI Results */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Net Savings Hero Card */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Net Annual Value Created
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-white">
                {results.roiMultiple}x ROI
              </span>
            </div>

            <div>
              <div className="text-4xl font-black tracking-tight">
                {formatSar(results.netAnnualSavingsSar)}
              </div>
              <div className="text-xs text-emerald-200 mt-1 font-mono">
                Equivalent to {formatUsd(results.usdEquivalent.netAnnualSavingsUsd)} USD
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs font-mono">
              <div>
                <span className="text-emerald-200 text-[10px] block font-sans">CARGO DAMAGE SAVINGS</span>
                <span className="text-sm font-bold">{formatSar(results.cargoLossSavingsSar)}</span>
              </div>
              <div>
                <span className="text-emerald-200 text-[10px] block font-sans">INSURANCE SAVINGS</span>
                <span className="text-sm font-bold">{formatSar(results.annualInsuranceSavingsSar)}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Comparison Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Loss Profile Breakdown (Annualized)
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div>
                  <span className="text-rose-700 dark:text-rose-300 font-sans font-bold block">
                    Baseline Unmitigated Annual Loss (4% rate)
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">
                    Without continuous IoT & graphene strain monitoring
                  </span>
                </div>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                  {formatSar(results.baselineAnnualLossSar)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-900 dark:text-white font-sans font-bold block">
                    CargoGuard AI™ Avoided Damage Loss
                  </span>
                  <span className="text-[10px] text-emerald-600 font-sans">
                    {inputs.targetReductionPct}% intercepted before damage occurs
                  </span>
                </div>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  - {formatSar(results.cargoLossSavingsSar)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-900 dark:text-white font-sans font-bold block">
                    Estimated Platform & Sensor Hardware Cost
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {inputs.annualShipments} trips × {inputs.sensorDeviceCostPerTripSar} SAR
                  </span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {formatSar(results.totalPlatformCostSar)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              Estimated Payback Period: <span className="font-bold text-slate-800 dark:text-slate-200">{results.paybackPeriodMonths} Months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
