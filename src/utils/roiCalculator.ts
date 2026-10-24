export interface RoiInputs {
  annualShipments: number; // e.g. 5,000 containers
  avgCargoValueSar: number; // e.g. 250,000 SAR
  baselineDamageRatePct: number; // e.g. 4.0%
  targetReductionPct: number; // e.g. 40.0%
  sensorDeviceCostPerTripSar: number; // e.g. 180 SAR
  insuranceDiscountPct: number; // e.g. 12.0%
  avgInsurancePremiumPerTripSar: number; // e.g. 1,200 SAR
}

export interface RoiResults {
  annualGrossCargoValueSar: number;
  baselineAnnualLossSar: number;
  projectedAnnualLossSar: number;
  cargoLossSavingsSar: number;
  annualInsuranceSavingsSar: number;
  totalAnnualGrossSavingsSar: number;
  totalPlatformCostSar: number;
  netAnnualSavingsSar: number;
  roiPercentage: number;
  roiMultiple: number;
  paybackPeriodMonths: number;
  currency: 'SAR';
  usdEquivalent: {
    netAnnualSavingsUsd: number;
    cargoLossSavingsUsd: number;
  };
}

export const SAR_TO_USD_RATE = 0.2667; // 1 SAR ≈ 0.267 USD (Fixed peg 3.75 SAR = 1 USD)

export function calculateRoiImpact(inputs: RoiInputs): RoiResults {
  const {
    annualShipments,
    avgCargoValueSar,
    baselineDamageRatePct,
    targetReductionPct,
    sensorDeviceCostPerTripSar,
    insuranceDiscountPct,
    avgInsurancePremiumPerTripSar,
  } = inputs;

  const annualGrossCargoValueSar = annualShipments * avgCargoValueSar;
  const baselineAnnualLossSar = annualGrossCargoValueSar * (baselineDamageRatePct / 100);
  
  // Cargo damage avoided by real-time prevention
  const cargoLossSavingsSar = baselineAnnualLossSar * (targetReductionPct / 100);
  const projectedAnnualLossSar = baselineAnnualLossSar - cargoLossSavingsSar;

  // Insurance premium discounts achieved via immutable audit logs & verified safe transit
  const annualInsuranceSavingsSar = 
    annualShipments * avgInsurancePremiumPerTripSar * (insuranceDiscountPct / 100);

  const totalAnnualGrossSavingsSar = cargoLossSavingsSar + annualInsuranceSavingsSar;
  const totalPlatformCostSar = annualShipments * sensorDeviceCostPerTripSar;
  const netAnnualSavingsSar = Math.max(0, totalAnnualGrossSavingsSar - totalPlatformCostSar);

  const roiPercentage = totalPlatformCostSar > 0 
    ? Number(((netAnnualSavingsSar / totalPlatformCostSar) * 100).toFixed(1)) 
    : 0;
  
  const roiMultiple = totalPlatformCostSar > 0
    ? Number((totalAnnualGrossSavingsSar / totalPlatformCostSar).toFixed(2))
    : 0;

  const paybackPeriodMonths = totalAnnualGrossSavingsSar > 0
    ? Number(((totalPlatformCostSar / totalAnnualGrossSavingsSar) * 12).toFixed(1))
    : 12;

  return {
    annualGrossCargoValueSar,
    baselineAnnualLossSar,
    projectedAnnualLossSar,
    cargoLossSavingsSar,
    annualInsuranceSavingsSar,
    totalAnnualGrossSavingsSar,
    totalPlatformCostSar,
    netAnnualSavingsSar,
    roiPercentage,
    roiMultiple,
    paybackPeriodMonths,
    currency: 'SAR',
    usdEquivalent: {
      netAnnualSavingsUsd: Math.round(netAnnualSavingsSar * SAR_TO_USD_RATE),
      cargoLossSavingsUsd: Math.round(cargoLossSavingsSar * SAR_TO_USD_RATE),
    },
  };
}
