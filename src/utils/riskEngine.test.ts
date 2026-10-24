import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateOverallRisk, 
  calculateThermalRisk, 
  calculateHumidityRisk, 
  calculateShockRisk, 
  calculateTiltRisk, 
  calculateStrainRisk,
  RISK_WEIGHTS 
} from './riskEngine';
import { CargoProfile, TelemetryReading } from '../types/cargoguard';

const samplePharmaProfile: CargoProfile = {
  id: 'profile-pharma',
  name: 'Pharmaceuticals & Vaccines',
  category: 'Pharmaceuticals',
  description: 'Strict cold-chain biologics and vaccine containers (2°C to 8°C)',
  temp_min: 2,
  temp_max: 8,
  humidity_max: 60,
  shock_threshold_g: 1.5,
  tilt_threshold_deg: 10,
  strain_threshold_ue: 500,
  recommended_actions: {
    temp_breach: 'Immediately inspect reefer genset and check temperature recorder.',
    humidity_breach: 'Activate container dehumidification or replace desiccants.',
    shock_breach: 'Inspect pallet tie-down straps and reduce speed on rough road.',
    tilt_breach: 'Halt vehicle safely and inspect cargo load stabilization.',
    strain_breach: 'Check container sidewall deflection and re-distribute pallet weight.',
  },
};

test('risk weights sum exactly to 1.00', () => {
  const sum = RISK_WEIGHTS.T + RISK_WEIGHTS.H + RISK_WEIGHTS.S + RISK_WEIGHTS.L + RISK_WEIGHTS.D;
  assert.equal(Math.round(sum * 100) / 100, 1.00);
});

test('calculateOverallRisk evaluates correctly for nominal conditions', () => {
  const normalTelemetry: TelemetryReading = {
    container_id: 'CG-SA-001',
    timestamp: '2026-10-23T15:00:00Z',
    temperature: 5.0, // exactly in range [2, 8]
    humidity: 40,     // below 60%
    shock_g: 0.4,     // low shock
    tilt_deg: 1.5,    // flat
    strain_microstrain: 120, // normal elastic flexure
    latitude: 24.7136,
    longitude: 46.6753,
    battery_pct: 95,
  };

  const evaluation = calculateOverallRisk(normalTelemetry, samplePharmaProfile);
  assert.ok(evaluation.total_risk < 25, `Expected low risk, got ${evaluation.total_risk}`);
  assert.equal(evaluation.risk_level, 'low');
  assert.equal(evaluation.active_alerts.length, 0);
});

test('calculateOverallRisk correctly calculates mathematical score R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)', () => {
  const testTelemetry: TelemetryReading = {
    container_id: 'CG-SA-TEST',
    timestamp: '2026-10-23T15:00:00Z',
    temperature: 12.0, // breached! (temp_max is 8)
    humidity: 78,      // breached! (max is 60)
    shock_g: 2.2,      // breached! (threshold is 1.5)
    tilt_deg: 14,      // breached! (threshold is 10)
    strain_microstrain: 750, // breached! (threshold is 500)
    latitude: 21.4858,
    longitude: 39.1925,
    battery_pct: 88,
  };

  const evaluation = calculateOverallRisk(testTelemetry, samplePharmaProfile);
  const { T, H, S, L, D } = evaluation.subscores;
  
  const expectedRaw = 0.25 * T + 0.20 * H + 0.25 * S + 0.15 * L + 0.15 * D;
  assert.equal(evaluation.total_risk, Number(expectedRaw.toFixed(1)));
  assert.ok(evaluation.total_risk >= 50, `Expected elevated risk, got ${evaluation.total_risk}`);
  assert.ok(evaluation.active_alerts.length > 0, 'Alerts should be triggered');
});

test('calculateThermalRisk produces higher scores outside safety bounds', () => {
  const safeRisk = calculateThermalRisk(5.0, samplePharmaProfile);
  const highRisk = calculateThermalRisk(15.0, samplePharmaProfile);
  const freezeRisk = calculateThermalRisk(-5.0, samplePharmaProfile);

  assert.ok(safeRisk <= 20, `Safe risk should be <= 20, got ${safeRisk}`);
  assert.ok(highRisk >= 70, `High temp risk should be >= 70, got ${highRisk}`);
  assert.ok(freezeRisk >= 70, `Sub-zero risk should be >= 70, got ${freezeRisk}`);
});

test('calculateStrainRisk handles date-palm graphene sensor measurements', () => {
  const lowStrainRisk = calculateStrainRisk(150, samplePharmaProfile);
  const highStrainRisk = calculateStrainRisk(900, samplePharmaProfile);

  assert.ok(lowStrainRisk <= 25, `Low strain risk should be <= 25, got ${lowStrainRisk}`);
  assert.ok(highStrainRisk >= 70, `High strain risk should be >= 70, got ${highStrainRisk}`);
});
