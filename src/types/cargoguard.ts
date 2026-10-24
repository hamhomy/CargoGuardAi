export type RiskLevel = 'low' | 'medium' | 'high';

export type UserRole = 
  | 'fleet_manager' 
  | 'driver' 
  | 'quality_inspector' 
  | 'warehouse_manager' 
  | 'insurance_auditor';

export interface CargoProfile {
  id: string;
  name: string;
  category: 'Cold Chain' | 'Pharmaceuticals' | 'High-Tech Electronics' | 'Fragile Ceramics & Glass' | 'Industrial Chemicals';
  description: string;
  temp_min: number; // Celsius
  temp_max: number; // Celsius
  humidity_max: number; // % RH
  shock_threshold_g: number; // G-force
  tilt_threshold_deg: number; // Degrees
  strain_threshold_ue: number; // Microstrain (με) from date-palm carbon-graphene sensor
  recommended_actions: {
    temp_breach: string;
    humidity_breach: string;
    shock_breach: string;
    tilt_breach: string;
    strain_breach: string;
  };
}

export interface TelemetryReading {
  container_id: string;
  timestamp: string;
  temperature: number; // °C
  humidity: number; // %
  shock_g: number; // G
  tilt_deg: number; // °
  strain_microstrain: number; // με (microstrain from date-palm graphene sensor)
  latitude: number;
  longitude: number;
  battery_pct: number;
  mesh_hops?: number;
  offline_buffered?: boolean;
}

export interface RiskSubScores {
  T: number; // Thermal risk (0 - 100)
  H: number; // Humidity risk (0 - 100)
  S: number; // Shock risk (0 - 100)
  L: number; // Tilt / stability risk (0 - 100)
  D: number; // Mechanical strain risk (0 - 100)
}

export interface RiskEvaluation {
  container_id: string;
  timestamp: string;
  subscores: RiskSubScores;
  weights: {
    T: number; // 0.25
    H: number; // 0.20
    S: number; // 0.25
    L: number; // 0.15
    D: number; // 0.15
  };
  total_risk: number; // 0 - 100
  risk_level: RiskLevel;
  primary_driver: 'Thermal' | 'Humidity' | 'Shock' | 'Tilt' | 'Strain' | 'Optimal';
  recommendations: string[];
  active_alerts: AlertNotification[];
}

export interface AlertNotification {
  id: string;
  container_id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  parameter: 'temperature' | 'humidity' | 'shock' | 'tilt' | 'strain' | 'system';
  value: number | string;
  threshold: number | string;
  channels: ('dashboard' | 'sms' | 'push')[];
  acknowledged: boolean;
  action_recommended: string;
}

// ---------------------------------------------------------------------------
// Human-Centric UX Types (Actionable Alerts First & Single-Page Details)
// ---------------------------------------------------------------------------

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';

export interface ActionableAlertItem {
  id: string;
  shipmentId: string;
  containerCode: string;
  problem: string; // Specific concrete problem (e.g., "Temperature +2.8°C above threshold")
  severity: AlertSeverity;
  durationMinutes: number; // Duration of the issue (e.g., 14 min)
  recommendedNextSteps: string; // Concrete recommended next steps
  parameter: 'temperature' | 'humidity' | 'shock' | 'tilt' | 'strain';
  currentValue: string;
  safeLimit: string;
  timestamp: string;
  acknowledged: boolean;
  actionTaken?: string;
}

export interface TelemetryTrendPoint {
  time: string; // e.g. "14:00"
  temperature: number;
  humidity: number;
  shock: number;
  tilt: number;
  strain: number;
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'temperature' | 'shock' | 'strain' | 'tilt' | 'humidity';
  title: string;
  detail: string;
  duration: string;
  severity: AlertSeverity;
  status: 'active' | 'resolved' | 'acknowledged';
}

export interface RecordedAction {
  id: string;
  timestamp: string;
  actor: string; // e.g. "Fleet Mgr - Tariq", "Driver - Ahmed Al-Harbi"
  actionType: 'Driver Contacted' | 'Genset Restarted' | 'Speed Reduced' | 'Straps Tightened' | 'Checkpoint Verified' | 'Note Added';
  notes: string;
}

export type ShipmentFilterStatus = 'all' | 'needs_attention' | 'in_transit' | 'completed';

export interface ShipmentEntity {
  id: string; // e.g. "SHP-SA-9041"
  containerCode: string; // e.g. "CG-SA-9041"
  containerType: 'Reefer 40ft' | 'Standard Dry 40ft' | 'High-Cube 45ft' | 'Smart Insulated 20ft';
  cargoName: string;
  category: 'Cold Chain' | 'Pharmaceuticals' | 'High-Tech Electronics' | 'Fragile Ceramics & Glass' | 'Industrial Chemicals';
  cargoValueSar: number;
  carrier: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  status: 'Needs attention' | 'In transit' | 'Completed';
  concreteProblemSummary?: string; // Direct concrete state instead of abstract number
  hasActiveIssue: boolean;
  issueDurationMinutes?: number;
  lastUpdate: string;
  eta: string;
  currentConditions: {
    temperature: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    humidityMax: number;
    shock: number;
    shockLimit: number;
    tilt: number;
    tiltLimit: number;
    strain: number; // Date-palm graphene microstrain (με)
    strainLimit: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  incidents: IncidentEvent[];
  actionLogs: RecordedAction[];
  telemetryHistory: TelemetryTrendPoint[];
  tripAudit?: TripAuditRecord;
}

export interface ContainerEntity {
  id: string;
  container_code: string;
  container_type: 'Reefer 40ft' | 'Standard Dry 40ft' | 'High-Cube 45ft' | 'Smart Insulated 20ft';
  status: 'In Transit' | 'Port Customs' | 'Loading' | 'Delivered' | 'Quarantine Inspection';
  origin: string;
  destination: string;
  carrier: string;
  cargo_profile_id: string;
  cargo_name: string;
  cargo_value_sar: number;
  graphene_sensor_id: string;
  graphene_sensor_batch: string;
  current_location_name: string;
  latest_telemetry: TelemetryReading;
  latest_risk: RiskEvaluation;
}

export interface TripAuditRecord {
  id: string;
  trip_id: string;
  container_code: string;
  start_time: string;
  end_time?: string;
  origin: string;
  destination: string;
  cargo_name: string;
  total_km: number;
  max_shock_g: number;
  max_temp_c: number;
  min_temp_c: number;
  max_strain_ue: number;
  peak_risk_score: number;
  breach_count: number;
  cryptographic_hash: string;
  status: 'Compliant' | 'Flagged For Review' | 'Insurance Claim Dispatched';
  inspector_signoff?: string;
}
