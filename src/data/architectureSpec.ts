export const ASCII_SYSTEM_ARCHITECTURE = `
=======================================================================================================
                         CARGOGUARD AI™ END-TO-END SYSTEM ARCHITECTURE
=======================================================================================================

 +---------------------------------------------------------------------------------------------------+
 | 1. EDGE SENSING & IOT GATEWAY LAYER (Inside ISO Container / Reefer)                               |
 |                                                                                                   |
 |  [ Novel Carbon-Graphene ]      [ PT100 Temp ]     [ Capacitive ]     [ 3-Axis Accel ]   [ Tilt ] |
 |  [ Flexible Strain Patch ]      [ Probe (T)  ]     [ Humidity (H) ]   [ Shock Vector ]   [ Inclin]|
 |  * Date-Palm Pit Biomass C                                                                        |
 |  * Piezoresistive GF=142.5                                                                        |
 |         │                              │                  │                  │               │    |
 |         └──────────────┬───────────────┴──────────────────┴──────────────────┴───────────────┘    |
 |                        │  SPI / I2C / BLE 5.3 Mesh Bus                                            |
 |                        ▼                                                                          |
 |         ┌─────────────────────────────────────────────────────────────┐                           |
 |         │               SMART CONTAINER EDGE GATEWAY                  │                           |
 |         │  - ESP32-S3 / ARM Cortex-M4 Microcontroller                 │                           |
 |         │  - GNSS/GPS Module (L1/L5 Dual Band Positioning)            │                           |
 |         │  - Edge Pre-filtering & Peak Impact Detector (>100Hz)        │                           |
 |         │  - Local Circular Flash Storage (SQLite / LittleFS)         │                           |
 |         │  - Offline Data Buffer Manager (Stores up to 30 days data)  │                           |
 |         └──────────────────────────────┬──────────────────────────────┘                           |
 +────────────────────────────────────────┼──────────────────────────────────────────────────────────+
                                          │ 4G/LTE-M / NB-IoT / Satellite (Iridium)
                                          │ Protocol: MQTT over TLS (Port 8883) or HTTPS REST fallback
                                          ▼
 +---------------------------------------------------------------------------------------------------+
 | 2. INGESTION & REAL-TIME STREAMING LAYER (Cloud / VPC)                                            |
 |                                                                                                   |
 |         ┌─────────────────────────────────────────────────────────────┐                           |
 |         │           EMQX / AWS IoT Core MQTT Broker Cluster           │                           |
 |         │  - Mutual TLS Authentication (X.509 Device Certificates)    │                           |
 |         │  - QoS 1 (At-least-once delivery)                           │                           |
 |         └──────────────────────────────┬──────────────────────────────┘                           |
 |                                        ▼                                                          |
 |         ┌─────────────────────────────────────────────────────────────┐                           |
 |         │              APACHE KAFKA / REDIS STREAM QUEUE              │                           |
 |         │  Topic: "cargoguard.telemetry.raw"                          │                           |
 |         │  Topic: "cargoguard.offline.bulk_sync"                      │                           |
 |         └──────────────┬──────────────────────────────┬───────────────┘                           |
 +────────────────────────┼──────────────────────────────┼───────────────────────────────────────────+
                          ▼                              ▼
 +-----------------------------------+  +------------------------------------------------------------+
 | 3. STORAGE LAYER                  |  | 4. AI DAMAGE RISK ENGINE & WORKER                          |
 |                                   |  |                                                            |
 |  ┌─────────────────────────────┐  |  |  ┌──────────────────────────────────────────────────────┐  |
 |  │ TimescaleDB (Time-Series)   │  |  |  │ INGESTION & PREDICTION WORKER SERVICE                │  |
 |  │ - Hypertable: telemetry     │  |  |  │ Formula:                                             │  |
 |  │ - Partitioned by 1 day      │  |  |  │ R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)   │  |
 |  │ - Compressed hyperchunks    │  |  |  │                                                      │  |
 |  └─────────────────────────────┘  |  |  │ Normalizes strain D from date-palm graphene sensor    │  |
 |                                   |  |  │ Evaluates excursion duration & threshold delta       │  |
 |  ┌─────────────────────────────┐  |  |  └──────────────────────────┬───────────────────────────┘  |
 |  │ PostgreSQL 16 (Relational)  │  |  +─────────────────────────────┼──────────────────────────────+
 |  │ - Shipments & Containers    │  |                                │
 |  │ - Cargo Profiles (Limits)   │◄─┘                                ▼
 |  │ - Users & RBAC Permissions  │     +------------------------------------------------------------+
 |  │ - Immutable Incident Logs   │     | 5. ALERT & DISPATCH BROKER                                 |
 |  │ - Cryptographic Audit Hashes│     |  - Threshold Breached? Dispatch:                           |
 |  └─────────────────────────────┘     |    * WebSockets / SSE -> Dashboard UI Live Notification    |
 |                                      |    * SMS Gateway (Twilio / Unifonic KSA) -> Driver Phone   |
 |                                      |    * Push Notification (Firebase Cloud Messaging) -> App   |
 |                                      |  - Automated Preventive Action Generator                   |
 |                                      +─────────────────────────────┬──────────────────────────────+
                                                                      │
                                                                      ▼
 +---------------------------------------------------------------------------------------------------+
 | 6. API, WEBHOOK & CLIENT PRESENTATION LAYER                                                       |
 |                                                                                                   |
 |  ┌────────────────────────────────┐   ┌──────────────────────────────┐   ┌─────────────────────┐  |
 |  │ RESTful API & Webhooks Engine  │   │ Fleet Dashboard (Web App)    │   │ Insurance & Audit   |  |
 |  │ - OpenAPI 3.1 Spec             │   │ - Live Risk Heatmap          │   │ Compliance Portal   |  |
 |  │ - SAP / Oracle ERP Connector   │   │ - Graphene Strain Telemetry  │   │ - Tamper-proof logs │  |
 |  │ - Warehouse WMS Handover Hook  │   │ - SAR ROI Impact Calculator  │   │ - PDF/JSON exports  |  |
 |  └────────────────────────────────┘   └──────────────────────────────┘   └─────────────────────┘  |
 +---------------------------------------------------------------------------------------------------+
`;

export const NODEJS_BACKEND_SERVICE_CODE = `/**
 * CargoGuard AI™ - IoT Ingestion & AI Risk Engine Microservice
 * Production-ready Node.js / TypeScript Implementation
 */

import { Router, Request, Response } from 'express';
import { createHash } from 'crypto';

interface TelemetryPayload {
  container_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  shock_g: number;
  tilt_deg: number;
  strain_microstrain: number; // Novel Date-Palm Carbon Graphene Sensor (με)
  latitude: number;
  longitude: number;
  battery_pct: number;
  is_offline_sync?: boolean;
}

interface CargoProfile {
  temp_min: number;
  temp_max: number;
  humidity_max: number;
  shock_threshold_g: number;
  tilt_threshold_deg: number;
  strain_threshold_ue: number;
  actions: Record<string, string>;
}

// ---------------------------------------------------------------------------
// AI Damage Risk Score Engine (Mathematical Model)
// Formula: R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
// ---------------------------------------------------------------------------
export function calculateRiskEngine(telemetry: TelemetryPayload, profile: CargoProfile) {
  // 1. Thermal Exposure Risk (T: 0 - 100)
  let T = 10;
  if (telemetry.temperature < profile.temp_min) {
    T = Math.min(100, Math.round(20 + ((profile.temp_min - telemetry.temperature) / 5) * 80));
  } else if (telemetry.temperature > profile.temp_max) {
    T = Math.min(100, Math.round(20 + ((telemetry.temperature - profile.temp_max) / 6) * 80));
  }

  // 2. Humidity Risk (H: 0 - 100)
  let H = 10;
  if (telemetry.humidity > profile.humidity_max) {
    const excess = telemetry.humidity - profile.humidity_max;
    H = Math.min(100, Math.round(45 + (excess / (100 - profile.humidity_max)) * 55));
  } else if (telemetry.humidity > profile.humidity_max * 0.75) {
    H = Math.round(20 + ((telemetry.humidity - profile.humidity_max * 0.75) / (profile.humidity_max * 0.25)) * 25);
  }

  // 3. Shock & Vibration Risk (S: 0 - 100)
  let S = 5;
  if (telemetry.shock_g > profile.shock_threshold_g) {
    const excess = telemetry.shock_g - profile.shock_threshold_g;
    S = Math.min(100, Math.round(45 + (excess / (profile.shock_threshold_g * 1.2)) * 55));
  } else if (telemetry.shock_g > 0.8) {
    S = Math.round(10 + ((telemetry.shock_g - 0.8) / (profile.shock_threshold_g - 0.8)) * 35);
  }

  // 4. Tilt / Stability Risk (L: 0 - 100)
  const absTilt = Math.abs(telemetry.tilt_deg);
  let L = 5;
  if (absTilt > profile.tilt_threshold_deg) {
    const excess = absTilt - profile.tilt_threshold_deg;
    L = Math.min(100, Math.round(45 + (excess / (35 - profile.tilt_threshold_deg)) * 55));
  } else if (absTilt > 3) {
    L = Math.round(10 + ((absTilt - 3) / (profile.tilt_threshold_deg - 3)) * 35);
  }

  // 5. Mechanical Strain Risk from Date-Palm Carbon Graphene Sensor (D: 0 - 100)
  const absStrain = Math.abs(telemetry.strain_microstrain);
  let D = 10;
  if (absStrain > profile.strain_threshold_ue) {
    const excess = absStrain - profile.strain_threshold_ue;
    D = Math.min(100, Math.round(48 + (excess / (profile.strain_threshold_ue * 0.8)) * 52));
  } else if (absStrain > profile.strain_threshold_ue * 0.4) {
    D = Math.round(18 + ((absStrain - profile.strain_threshold_ue * 0.4) / (profile.strain_threshold_ue * 0.6)) * 30);
  }

  // EXACT FORMULA: R = 0.25*T + 0.20*H + 0.25*S + 0.15*L + 0.15*D
  const total_risk = Number((0.25 * T + 0.20 * H + 0.25 * S + 0.15 * L + 0.15 * D).toFixed(1));
  const risk_level = total_risk >= 65 ? 'high' : total_risk >= 35 ? 'medium' : 'low';

  return { T, H, S, L, D, total_risk, risk_level };
}

// ---------------------------------------------------------------------------
// Telemetry Ingest & Offline Sync Handler
// ---------------------------------------------------------------------------
export async function handleTelemetryIngestion(payload: TelemetryPayload, dbPool: any, messageBroker: any) {
  // 1. Compute cryptographic hash of incoming payload for digital evidence chain
  const rawHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');

  // 2. Fetch container & active cargo profile
  const containerRes = await dbPool.query(
    'SELECT c.*, p.* FROM containers c JOIN cargo_profiles p ON c.active_profile_id = p.profile_id WHERE c.container_id = $1',
    [payload.container_id]
  );
  if (containerRes.rows.length === 0) {
    throw new Error(\`Container \${payload.container_id} not registered in fleet database.\`);
  }
  const profile: CargoProfile = containerRes.rows[0];

  // 3. Calculate Risk Engine Score
  const risk = calculateRiskEngine(payload, profile);

  // 4. Insert into TimescaleDB Hypertable
  await dbPool.query(
    \`INSERT INTO container_telemetry (
      recorded_at, container_id, temperature_c, humidity_pct, shock_g,
      tilt_deg, strain_microstrain, latitude, longitude, battery_pct,
      is_offline_sync, raw_payload_hash
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)\`,
    [
      payload.timestamp, payload.container_id, payload.temperature, payload.humidity,
      payload.shock_g, payload.tilt_deg, payload.strain_microstrain, payload.latitude,
      payload.longitude, payload.battery_pct, payload.is_offline_sync ?? false, rawHash
    ]
  );

  // 5. Check if thresholds breached -> Dispatch Multi-channel Alerts
  if (risk.total_risk >= 35) {
    const alertRecord = {
      container_id: payload.container_id,
      timestamp: payload.timestamp,
      risk_score: risk.total_risk,
      severity: risk.risk_level,
      subscores: risk,
      channels: risk.total_risk >= 65 ? ['dashboard', 'sms', 'push'] : ['dashboard', 'push'],
    };

    // Publish to Alert Broker (Redis/Kafka) for immediate dispatch
    await messageBroker.publish('cargoguard.alerts', JSON.stringify(alertRecord));
  }

  return { success: true, risk, payload_hash: rawHash };
}
`;

export const PYTHON_BACKEND_SERVICE_CODE = `"""
CargoGuard AI™ - IoT Ingestion & AI Risk Engine
Production-ready Python (FastAPI + Paho MQTT + asyncpg) Microservice
"""

import math
import hashlib
import json
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Depends

app = FastAPI(title="CargoGuard AI™ IoT & Risk Engine", version="2.0.0")

class TelemetryPayload(BaseModel):
    container_id: str
    timestamp: datetime
    temperature: float = Field(..., ge=-50.0, le=80.0, description="Internal Reefer Temp °C")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative Humidity % RH")
    shock_g: float = Field(..., ge=0.0, le=25.0, description="Triaxial Dynamic Impact Vector G")
    tilt_deg: float = Field(..., ge=-90.0, le=90.0, description="Container Incline / Pitch °")
    strain_microstrain: float = Field(..., description="Novel Date-Palm Carbon Graphene Strain (με)")
    latitude: float
    longitude: float
    battery_pct: int = Field(..., ge=0, le=100)
    is_offline_sync: bool = False

class RiskScoreBreakdown(BaseModel):
    T: float
    H: float
    S: float
    L: float
    D: float
    total_risk: float
    risk_level: str
    primary_driver: str
    recommendations: List[str]

# ---------------------------------------------------------------------------
# AI Damage Risk Score Engine (Mathematical Model)
# Formula: R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
# ---------------------------------------------------------------------------
def compute_risk_score(telemetry: TelemetryPayload, profile: dict) -> RiskScoreBreakdown:
    # 1. Thermal Exposure Risk T
    temp = telemetry.temperature
    t_min, t_max = profile["temp_min"], profile["temp_max"]
    if t_min <= temp <= t_max:
        T = 10.0
    elif temp > t_max:
        T = min(100.0, round(20.0 + ((temp - t_max) / 6.0) * 80.0, 1))
    else:
        T = min(100.0, round(20.0 + ((t_min - temp) / 5.0) * 80.0, 1))

    # 2. Humidity Risk H
    h_max = profile["humidity_max"]
    hum = telemetry.humidity
    if hum <= h_max * 0.75:
        H = 10.0
    elif hum <= h_max:
        H = round(20.0 + ((hum - h_max * 0.75) / (h_max * 0.25)) * 25.0, 1)
    else:
        H = min(100.0, round(45.0 + ((hum - h_max) / (100.0 - h_max)) * 55.0, 1))

    # 3. Shock & Vibration Risk S
    shock = telemetry.shock_g
    s_limit = profile["shock_threshold_g"]
    if shock <= 0.8:
        S = round(shock * 12.0, 1)
    elif shock <= s_limit:
        S = round(10.0 + ((shock - 0.8) / (s_limit - 0.8)) * 35.0, 1)
    else:
        S = min(100.0, round(45.0 + ((shock - s_limit) / (s_limit * 1.2)) * 55.0, 1))

    # 4. Tilt / Stability Risk L
    tilt = abs(telemetry.tilt_deg)
    l_limit = profile["tilt_threshold_deg"]
    if tilt <= 3.0:
        L = round((tilt / 3.0) * 10.0, 1)
    elif tilt <= l_limit:
        L = round(10.0 + ((tilt - 3.0) / (l_limit - 3.0)) * 35.0, 1)
    else:
        L = min(100.0, round(45.0 + ((tilt - l_limit) / (35.0 - l_limit)) * 55.0, 1))

    # 5. Mechanical Strain D (Date-Palm Pit Carbon + Graphene Sensor)
    strain = abs(telemetry.strain_microstrain)
    d_limit = profile["strain_threshold_ue"]
    if strain <= d_limit * 0.4:
        D = round((strain / (d_limit * 0.4)) * 18.0, 1)
    elif strain <= d_limit:
        D = round(18.0 + ((strain - d_limit * 0.4) / (d_limit * 0.6)) * 30.0, 1)
    else:
        D = min(100.0, round(48.0 + ((strain - d_limit) / (d_limit * 0.8)) * 52.0, 1))

    # EXACT MATHEMATICAL MODEL:
    # R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D)
    raw_R = 0.25 * T + 0.20 * H + 0.25 * S + 0.15 * L + 0.15 * D
    total_risk = round(raw_R, 1)

    level = "high" if total_risk >= 65 else "medium" if total_risk >= 35 else "low"
    
    # Primary risk driver classification
    components = [("Thermal", 0.25 * T), ("Humidity", 0.20 * H), ("Shock", 0.25 * S), ("Tilt", 0.15 * L), ("Strain", 0.15 * D)]
    primary = max(components, key=lambda x: x[1])[0] if total_risk >= 20 else "Optimal"

    recommendations = []
    if T >= 50: recommendations.append("Inspect reefer cooling compressor and verify setpoint.")
    if S >= 50: recommendations.append("Reduce speed on rough road; inspect pallet tie-down tension.")
    if D >= 50: recommendations.append("Graphene sensor detected sidewall strain. Inspect load shift.")

    return RiskScoreBreakdown(
        T=T, H=H, S=S, L=L, D=D,
        total_risk=total_risk,
        risk_level=level,
        primary_driver=primary,
        recommendations=recommendations or ["Maintain standard transport protocol."]
    )

@app.post("/api/v1/telemetry/ingest", response_model=dict)
async def ingest_telemetry_payload(payload: TelemetryPayload):
    # Mock profile lookup
    sample_profile = {
        "temp_min": 2.0, "temp_max": 8.0,
        "humidity_max": 60.0,
        "shock_threshold_g": 1.8,
        "tilt_threshold_deg": 10.0,
        "strain_threshold_ue": 500.0
    }
    
    # 1. Cryptographic hashing for tamper-evident digital evidence
    sha256_hash = hashlib.sha256(payload.model_dump_json().encode()).hexdigest()

    # 2. Compute AI Damage Risk
    risk_evaluation = compute_risk_score(payload, sample_profile)

    return {
        "status": "success",
        "container_id": payload.container_id,
        "risk_evaluation": risk_evaluation,
        "digital_evidence_hash": sha256_hash,
        "offline_sync_processed": payload.is_offline_sync
    }
`;
