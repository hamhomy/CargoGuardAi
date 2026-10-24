export const SQL_SCHEMA_DDL = `-- ============================================================================
-- CargoGuard AI™ Production Database Schema Specification
-- Dialect: PostgreSQL 16 + TimescaleDB Extension (for Time-Series Telemetry)
-- Novel Sensor Support: Date-Palm Pit Derived Carbon + Graphene Flexible Strain
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. USERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- ----------------------------------------------------------------------------
CREATE TYPE user_role_enum AS ENUM (
  'fleet_manager',
  'driver',
  'quality_inspector',
  'warehouse_manager',
  'insurance_auditor',
  'system_admin'
);

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(30),
  role user_role_enum NOT NULL DEFAULT 'fleet_manager',
  organization VARCHAR(150) NOT NULL, -- e.g. "Bahri Logistics", "Tawuniya Insurance"
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SENSOR INVENTORY & NOVEL CARBON-GRAPHENE SPECIFICATION
-- ----------------------------------------------------------------------------
CREATE TYPE sensor_modality_enum AS ENUM (
  'date_palm_graphene_strain', -- Novel flexible piezoresistive strain sensor
  'pt100_temperature_probe',
  'capacitive_humidity',
  'triaxial_accelerometer_shock',
  'mems_inclinometer_tilt',
  'gps_gnss_positioning'
);

CREATE TABLE sensors (
  sensor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. "DPG-SA-8801"
  sensor_modality sensor_modality_enum NOT NULL,
  manufacturer VARCHAR(100) DEFAULT 'KAUST Nanotech / CargoGuard Bio-Sensors',
  batch_number VARCHAR(50), -- e.g. "KSA-KAUST-DPG-2026-X4"
  gauge_factor NUMERIC(6, 2) DEFAULT 142.50, -- Novel carbon-graphene piezoresistive GF
  base_resistance_ohms NUMERIC(10, 2) DEFAULT 12500.00, -- R0 baseline
  calibration_date DATE NOT NULL,
  battery_life_months INT DEFAULT 36,
  is_operational BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. CARGO PROFILES & SAFETY BOUNDARIES
-- ----------------------------------------------------------------------------
CREATE TABLE cargo_profiles (
  profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(80) NOT NULL, -- Cold Chain, Pharmaceuticals, Electronics, Fragile
  temp_min_c NUMERIC(5, 2) NOT NULL,
  temp_max_c NUMERIC(5, 2) NOT NULL,
  humidity_max_pct NUMERIC(5, 2) NOT NULL,
  shock_threshold_g NUMERIC(5, 2) NOT NULL,
  tilt_threshold_deg NUMERIC(5, 2) NOT NULL,
  strain_threshold_ue NUMERIC(8, 2) NOT NULL, -- Microstrain threshold (με)
  thermal_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.25,
  humidity_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.20,
  shock_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.25,
  tilt_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.15,
  strain_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.15,
  recommended_actions JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. SMART CONTAINERS
-- ----------------------------------------------------------------------------
CREATE TYPE container_status_enum AS ENUM (
  'available',
  'in_transit',
  'port_customs',
  'quarantine_inspection',
  'maintenance',
  'decommissioned'
);

CREATE TABLE containers (
  container_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  container_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. "CG-SA-9041" (ISO 6346)
  container_type VARCHAR(50) NOT NULL, -- "Reefer 40ft", "Standard Dry 40ft"
  tare_weight_kg NUMERIC(8, 2) NOT NULL,
  max_payload_kg NUMERIC(8, 2) NOT NULL,
  gateway_imei VARCHAR(30) UNIQUE,
  mesh_node_mac VARCHAR(30),
  status container_status_enum NOT NULL DEFAULT 'available',
  graphene_sensor_id UUID REFERENCES sensors(sensor_id),
  primary_driver_id UUID REFERENCES users(user_id),
  current_lat NUMERIC(9, 6),
  current_lng NUMERIC(9, 6),
  battery_level_pct INT CHECK (battery_level_pct BETWEEN 0 AND 100),
  firmware_version VARCHAR(30) DEFAULT 'v4.1.2-edge',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SHIPMENTS & VOYAGES
-- ----------------------------------------------------------------------------
CREATE TYPE shipment_status_enum AS ENUM (
  'booking_created',
  'origin_stuffed',
  'in_transit',
  'customs_hold',
  'delivered_compliant',
  'disputed_damage_claim'
);

CREATE TABLE shipments (
  shipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  container_id UUID NOT NULL REFERENCES containers(container_id),
  cargo_profile_id UUID NOT NULL REFERENCES cargo_profiles(profile_id),
  carrier_name VARCHAR(100) NOT NULL,
  origin_facility VARCHAR(150) NOT NULL, -- e.g. "Jeddah Islamic Port Gate 4"
  destination_facility VARCHAR(150) NOT NULL, -- e.g. "Riyadh Dry Port"
  declared_value_sar NUMERIC(14, 2) NOT NULL,
  insurance_policy_number VARCHAR(80),
  assigned_driver_id UUID REFERENCES users(user_id),
  departure_time TIMESTAMPTZ,
  actual_arrival_time TIMESTAMPTZ,
  status shipment_status_enum NOT NULL DEFAULT 'origin_stuffed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. HIGH-FREQUENCY TIME-SERIES TELEMETRY (TimescaleDB Hypertable)
-- ----------------------------------------------------------------------------
CREATE TABLE container_telemetry (
  recorded_at TIMESTAMPTZ NOT NULL,
  container_id UUID NOT NULL,
  shipment_id UUID,
  temperature_c NUMERIC(5, 2) NOT NULL,
  humidity_pct NUMERIC(5, 2) NOT NULL,
  shock_g NUMERIC(5, 3) NOT NULL,
  tilt_deg NUMERIC(5, 2) NOT NULL,
  strain_microstrain NUMERIC(8, 2) NOT NULL, -- Graphene sensor reading (με)
  graphene_resistance_ohms NUMERIC(10, 2), -- Raw sensor resistance
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  battery_pct SMALLINT NOT NULL,
  mesh_hops SMALLINT DEFAULT 0,
  is_offline_sync BOOLEAN DEFAULT false,
  raw_payload_hash CHAR(64) -- SHA-256 for integrity verification
);

-- Convert standard table into a TimescaleDB hypertable partitioned by recorded_at (1-day chunks)
SELECT create_hypertable('container_telemetry', 'recorded_at', chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);

-- Create compound indexing for fast lookups
CREATE INDEX idx_telemetry_container_time ON container_telemetry (container_id, recorded_at DESC);
CREATE INDEX idx_telemetry_shipment_time ON container_telemetry (shipment_id, recorded_at DESC);

-- ----------------------------------------------------------------------------
-- 7. REAL-TIME AI RISK ASSESSMENTS
-- Formula: R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
-- ----------------------------------------------------------------------------
CREATE TABLE risk_assessments (
  assessment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recorded_at TIMESTAMPTZ NOT NULL,
  container_id UUID NOT NULL REFERENCES containers(container_id),
  shipment_id UUID REFERENCES shipments(shipment_id),
  thermal_risk_t NUMERIC(5, 2) NOT NULL,
  humidity_risk_h NUMERIC(5, 2) NOT NULL,
  shock_risk_s NUMERIC(5, 2) NOT NULL,
  tilt_risk_l NUMERIC(5, 2) NOT NULL,
  strain_risk_d NUMERIC(5, 2) NOT NULL,
  total_risk_r NUMERIC(5, 2) NOT NULL,
  risk_classification VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high'
  primary_driver VARCHAR(50) NOT NULL,
  generated_recommendations TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_container ON risk_assessments (container_id, recorded_at DESC);

-- ----------------------------------------------------------------------------
-- 8. IMMUTABLE INCIDENT LOGS & DIGITAL EVIDENCE TRAIL
-- ----------------------------------------------------------------------------
CREATE TABLE incident_logs (
  incident_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  container_id UUID NOT NULL REFERENCES containers(container_id),
  shipment_id UUID NOT NULL REFERENCES shipments(shipment_id),
  triggered_at TIMESTAMPTZ NOT NULL,
  breached_parameter VARCHAR(50) NOT NULL, -- 'strain', 'shock', 'temp', 'tilt'
  measured_value NUMERIC(10, 3) NOT NULL,
  threshold_limit NUMERIC(10, 3) NOT NULL,
  calculated_risk_r NUMERIC(5, 2) NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  location_name VARCHAR(150),
  alert_channels_dispatched VARCHAR(50)[] NOT NULL, -- {'dashboard', 'sms', 'push'}
  driver_acknowledged BOOLEAN NOT NULL DEFAULT false,
  driver_ack_timestamp TIMESTAMPTZ,
  preventive_action_executed TEXT,
  -- Cryptographic tamper-evidence: SHA-256 (prev_hash + payload + timestamp)
  previous_block_hash CHAR(64) NOT NULL,
  tamper_evident_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incident_shipment ON incident_logs (shipment_id, triggered_at DESC);
`;

export const JSON_SCHEMA_TELEMETRY_INGEST = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CargoGuardIoTTelemetryPayload",
  "description": "High-frequency edge IoT telemetry payload with date-palm carbon-graphene sensor data",
  "type": "object",
  "required": [
    "container_id",
    "timestamp",
    "temperature",
    "humidity",
    "shock_g",
    "tilt_deg",
    "strain_microstrain",
    "latitude",
    "longitude",
    "battery_pct"
  ],
  "properties": {
    "container_id": {
      "type": "string",
      "format": "uuid",
      "example": "60d57bbf-cb35-4c08-80df-d0eacff15ee9"
    },
    "gateway_mac": {
      "type": "string",
      "pattern": "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
      "example": "E4:5F:01:9A:88:B2"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "example": "2026-10-23T15:20:10Z"
    },
    "temperature": {
      "type": "number",
      "minimum": -50.0,
      "maximum": 80.0,
      "description": "Internal container temperature in Celsius"
    },
    "humidity": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 100.0,
      "description": "Relative humidity percentage (% RH)"
    },
    "shock_g": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 25.0,
      "description": "Peak dynamic triaxial acceleration vector in G-force"
    },
    "tilt_deg": {
      "type": "number",
      "minimum": -90.0,
      "maximum": 90.0,
      "description": "Inclinometer pitch/roll deviation angle in degrees"
    },
    "strain_microstrain": {
      "type": "number",
      "minimum": -5000.0,
      "maximum": 15000.0,
      "description": "Mechanical microstrain (με) from date-palm pit carbon + graphene flexible patch"
    },
    "graphene_resistance_ohms": {
      "type": "number",
      "description": "Raw electrical resistance across the flexible date-palm carbon nanomaterial patch"
    },
    "latitude": {
      "type": "number",
      "minimum": -90.0,
      "maximum": 90.0
    },
    "longitude": {
      "type": "number",
      "minimum": -180.0,
      "maximum": 180.0
    },
    "battery_pct": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "mesh_hops": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10
    },
    "is_offline_sync": {
      "type": "boolean",
      "default": false
    }
  }
};
