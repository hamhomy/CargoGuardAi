import { CargoProfile, RiskEvaluation, RiskLevel, RiskSubScores, TelemetryReading, AlertNotification } from '../types/cargoguard';

export const RISK_WEIGHTS = {
  T: 0.25, // Thermal risk weight
  H: 0.20, // Humidity risk weight
  S: 0.25, // Shock / vibration risk weight
  L: 0.15, // Tilt / stability risk weight
  D: 0.15, // Carbon-graphene mechanical strain risk weight
} as const;

/**
 * Calculates Thermal Exposure Risk (T: 0 - 100)
 */
export function calculateThermalRisk(temperature: number, profile: CargoProfile): number {
  const { temp_min, temp_max } = profile;
  
  if (temperature >= temp_min && temperature <= temp_max) {
    // Within optimal range: minimal baseline risk based on proximity to edges
    const range = temp_max - temp_min;
    if (range <= 0) return 10;
    const center = (temp_min + temp_max) / 2;
    const devRatio = Math.abs(temperature - center) / (range / 2);
    return Math.round(5 + devRatio * 15); // 5 - 20
  }
  
  if (temperature > temp_max) {
    const breach = temperature - temp_max;
    // Every 1°C over target adds severe thermal degradation penalty
    const risk = 20 + Math.min(80, (breach / 6) * 80);
    return Math.min(100, Math.round(risk));
  } else {
    const breach = temp_min - temperature;
    const risk = 20 + Math.min(80, (breach / 5) * 80);
    return Math.min(100, Math.round(risk));
  }
}

/**
 * Calculates Humidity Risk (H: 0 - 100)
 */
export function calculateHumidityRisk(humidity: number, profile: CargoProfile): number {
  const { humidity_max } = profile;
  
  if (humidity <= humidity_max * 0.75) {
    return Math.round(Math.max(5, (humidity / (humidity_max * 0.75)) * 20));
  }
  
  if (humidity <= humidity_max) {
    const breachRatio = (humidity - humidity_max * 0.75) / (humidity_max * 0.25);
    return Math.round(20 + breachRatio * 25); // 20 - 45
  }
  
  // Exceeds maximum relative humidity: mold, moisture condensation & box collapse risk
  const excess = humidity - humidity_max;
  const remainingBand = 100 - humidity_max;
  const excessRatio = remainingBand > 0 ? excess / remainingBand : 1;
  const risk = 45 + excessRatio * 55;
  return Math.min(100, Math.round(risk));
}

/**
 * Calculates Shock & Vibration Risk (S: 0 - 100)
 */
export function calculateShockRisk(shockG: number, profile: CargoProfile): number {
  const threshold = profile.shock_threshold_g;
  
  if (shockG <= 0.8) {
    return Math.round(shockG * 12); // 0 - 10
  }
  
  if (shockG <= threshold) {
    const ratio = (shockG - 0.8) / (threshold - 0.8);
    return Math.round(10 + ratio * 35); // 10 - 45
  }
  
  // Shock exceeds threshold
  const excess = shockG - threshold;
  // If excess is double threshold, risk reaches 100
  const severeScale = excess / (threshold * 1.2);
  const risk = 45 + Math.min(55, severeScale * 55);
  return Math.min(100, Math.round(risk));
}

/**
 * Calculates Tilt / Stability Risk (L: 0 - 100)
 */
export function calculateTiltRisk(tiltDeg: number, profile: CargoProfile): number {
  const threshold = profile.tilt_threshold_deg;
  const absTilt = Math.abs(tiltDeg);
  
  if (absTilt <= 3) {
    return Math.round((absTilt / 3) * 10); // 0 - 10
  }
  
  if (absTilt <= threshold) {
    const ratio = (absTilt - 3) / (threshold - 3);
    return Math.round(10 + ratio * 35); // 10 - 45
  }
  
  // Exceeds tilt limit: risk of cargo shifting, stacking collapse or vehicle rollover
  const excess = absTilt - threshold;
  const maxTiltLimit = 35; // at 35 degrees severe rollover danger
  const excessRatio = Math.min(1, excess / (maxTiltLimit - threshold));
  const risk = 45 + excessRatio * 55;
  return Math.min(100, Math.round(risk));
}

/**
 * Calculates Mechanical Strain Risk (D: 0 - 100)
 * Uses Date-Palm Pit Carbon + Graphene Flexible Strain Sensor telemetry
 * Normalized accounting for microstrain (με), sustained mechanical stress, and cargo wall displacement
 */
export function calculateStrainRisk(
  strainMicrostrain: number, 
  profile: CargoProfile,
  durationMultiplier: number = 1.0
): number {
  const threshold = profile.strain_threshold_ue;
  const absStrain = Math.abs(strainMicrostrain);
  
  if (absStrain <= threshold * 0.4) {
    // Normal elastic flexure of ISO container wall
    return Math.round((absStrain / (threshold * 0.4)) * 18);
  }
  
  if (absStrain <= threshold) {
    const ratio = (absStrain - threshold * 0.4) / (threshold * 0.6);
    return Math.round(18 + ratio * 30); // 18 - 48
  }
  
  // Exceeds safe elastic strain threshold: indicates cargo shifting, uneven load distribution or container deformation
  const excess = absStrain - threshold;
  const criticalMargin = threshold * 0.8;
  const ratio = Math.min(1, excess / criticalMargin);
  const baseRisk = 48 + ratio * 52;
  
  // Factor in duration of exposure if prolonged
  const finalRisk = Math.min(100, baseRisk * Math.min(1.25, durationMultiplier));
  return Math.round(finalRisk);
}

/**
 * Master AI Damage Risk Score Engine Formula:
 * R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
 */
export function calculateOverallRisk(
  telemetry: TelemetryReading,
  profile: CargoProfile,
  durationMultiplier: number = 1.0
): RiskEvaluation {
  const T = calculateThermalRisk(telemetry.temperature, profile);
  const H = calculateHumidityRisk(telemetry.humidity, profile);
  const S = calculateShockRisk(telemetry.shock_g, profile);
  const L = calculateTiltRisk(telemetry.tilt_deg, profile);
  const D = calculateStrainRisk(telemetry.strain_microstrain, profile, durationMultiplier);

  // Apply strict mathematical formula
  const rawR = (
    RISK_WEIGHTS.T * T +
    RISK_WEIGHTS.H * H +
    RISK_WEIGHTS.S * S +
    RISK_WEIGHTS.L * L +
    RISK_WEIGHTS.D * D
  );
  
  const total_risk = Number(rawR.toFixed(1));

  let risk_level: RiskLevel = 'low';
  if (total_risk >= 65) {
    risk_level = 'high';
  } else if (total_risk >= 35) {
    risk_level = 'medium';
  }

  // Determine primary risk driver
  const components = [
    { name: 'Thermal' as const, weighted: RISK_WEIGHTS.T * T, raw: T },
    { name: 'Humidity' as const, weighted: RISK_WEIGHTS.H * H, raw: H },
    { name: 'Shock' as const, weighted: RISK_WEIGHTS.S * S, raw: S },
    { name: 'Tilt' as const, weighted: RISK_WEIGHTS.L * L, raw: L },
    { name: 'Strain' as const, weighted: RISK_WEIGHTS.D * D, raw: D },
  ];
  components.sort((a, b) => b.weighted - a.weighted);
  const primary_driver = total_risk < 20 ? 'Optimal' : components[0].name;

  // Automated preventive recommendations generator
  const recommendations: string[] = [];
  const active_alerts: AlertNotification[] = [];

  if (T >= 50) {
    recommendations.push(profile.recommended_actions.temp_breach);
    active_alerts.push({
      id: `alert-t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      container_id: telemetry.container_id,
      timestamp: telemetry.timestamp,
      severity: T >= 75 ? 'critical' : 'warning',
      title: 'Thermal Boundary Excursion',
      message: `Container internal temperature at ${telemetry.temperature}°C (Optimal: ${profile.temp_min}°C to ${profile.temp_max}°C).`,
      parameter: 'temperature',
      value: `${telemetry.temperature}°C`,
      threshold: `${profile.temp_min} - ${profile.temp_max}°C`,
      channels: T >= 75 ? ['dashboard', 'sms', 'push'] : ['dashboard', 'push'],
      acknowledged: false,
      action_recommended: profile.recommended_actions.temp_breach,
    });
  }

  if (H >= 50) {
    recommendations.push(profile.recommended_actions.humidity_breach);
    active_alerts.push({
      id: `alert-h-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      container_id: telemetry.container_id,
      timestamp: telemetry.timestamp,
      severity: H >= 75 ? 'critical' : 'warning',
      title: 'Relative Humidity Limit Exceeded',
      message: `Relative humidity at ${telemetry.humidity}% RH exceeds maximum allowed ${profile.humidity_max}%. Dew point condensation risk.`,
      parameter: 'humidity',
      value: `${telemetry.humidity}%`,
      threshold: `< ${profile.humidity_max}%`,
      channels: ['dashboard', 'push'],
      acknowledged: false,
      action_recommended: profile.recommended_actions.humidity_breach,
    });
  }

  if (S >= 50) {
    recommendations.push(profile.recommended_actions.shock_breach);
    active_alerts.push({
      id: `alert-s-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      container_id: telemetry.container_id,
      timestamp: telemetry.timestamp,
      severity: S >= 75 ? 'critical' : 'warning',
      title: 'High Dynamic Impact / G-Force Spike',
      message: `Impact force of ${telemetry.shock_g.toFixed(2)}G detected, exceeding safety threshold ${profile.shock_threshold_g}G.`,
      parameter: 'shock',
      value: `${telemetry.shock_g.toFixed(2)}G`,
      threshold: `< ${profile.shock_threshold_g}G`,
      channels: S >= 75 ? ['dashboard', 'sms', 'push'] : ['dashboard', 'push'],
      acknowledged: false,
      action_recommended: profile.recommended_actions.shock_breach,
    });
  }

  if (L >= 50) {
    recommendations.push(profile.recommended_actions.tilt_breach);
    active_alerts.push({
      id: `alert-l-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      container_id: telemetry.container_id,
      timestamp: telemetry.timestamp,
      severity: L >= 75 ? 'critical' : 'warning',
      title: 'Dangerous Incline / Tilt Deviation',
      message: `Container tilt angle recorded at ${Math.abs(telemetry.tilt_deg).toFixed(1)}° (Threshold: ${profile.tilt_threshold_deg}°). Cargo shift imminent.`,
      parameter: 'tilt',
      value: `${telemetry.tilt_deg.toFixed(1)}°`,
      threshold: `< ${profile.tilt_threshold_deg}°`,
      channels: ['dashboard', 'sms', 'push'],
      acknowledged: false,
      action_recommended: profile.recommended_actions.tilt_breach,
    });
  }

  if (D >= 50) {
    recommendations.push(profile.recommended_actions.strain_breach);
    active_alerts.push({
      id: `alert-d-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      container_id: telemetry.container_id,
      timestamp: telemetry.timestamp,
      severity: D >= 75 ? 'critical' : 'warning',
      title: 'Date-Palm Graphene Sensor: High Wall Strain',
      message: `Mechanical strain reading of ${telemetry.strain_microstrain} με indicates structural load compression or severe wall outward bulging.`,
      parameter: 'strain',
      value: `${telemetry.strain_microstrain} με`,
      threshold: `< ${profile.strain_threshold_ue} με`,
      channels: D >= 75 ? ['dashboard', 'sms', 'push'] : ['dashboard', 'push'],
      acknowledged: false,
      action_recommended: profile.recommended_actions.strain_breach,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain nominal operating parameters and cruise speed.');
    recommendations.push('Container telemetry and date-palm graphene strain sensor readings within optimal baseline.');
  }

  return {
    container_id: telemetry.container_id,
    timestamp: telemetry.timestamp,
    subscores: { T, H, S, L, D },
    weights: { ...RISK_WEIGHTS },
    total_risk,
    risk_level,
    primary_driver,
    recommendations,
    active_alerts,
  };
}
