import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoiImpact, RoiInputs } from './roiCalculator';

test('calculateRoiImpact computes expected SAR savings for 5000 containers at 4% damage & 40% reduction', () => {
  const inputs: RoiInputs = {
    annualShipments: 5000,
    avgCargoValueSar: 200000,
    baselineDamageRatePct: 4.0, // 40,000,000 SAR loss baseline
    targetReductionPct: 40.0,   // 16,000,000 SAR avoided loss
    sensorDeviceCostPerTripSar: 200, // 1,000,000 SAR platform cost
    insuranceDiscountPct: 10.0,
    avgInsurancePremiumPerTripSar: 1000, // 500,000 SAR insurance savings
  };

  const results = calculateRoiImpact(inputs);

  assert.equal(results.baselineAnnualLossSar, 40000000);
  assert.equal(results.cargoLossSavingsSar, 16000000);
  assert.equal(results.annualInsuranceSavingsSar, 500000);
  assert.equal(results.totalPlatformCostSar, 1000000);
  assert.equal(results.netAnnualSavingsSar, 15500000);
  assert.ok(results.roiMultiple > 15);
  assert.equal(results.currency, 'SAR');
});
