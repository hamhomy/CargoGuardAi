import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Table, 
  Key, 
  Clock, 
  FileJson
} from 'lucide-react';
import { SQL_SCHEMA_DDL, JSON_SCHEMA_TELEMETRY_INGEST } from '../data/dbSchema';

export const DatabaseSchemaViewer: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<'sql' | 'json' | 'erd'>('sql');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", filename);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Data Modeling & Storage Architecture (TR-2)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Production Database Schema & Telemetry Modeling
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hybrid storage: PostgreSQL 16 for relational entities combined with TimescaleDB hypertables for multi-million row IoT telemetry ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFormat === 'sql' && (
            <button
              type="button"
              onClick={() => handleDownload(SQL_SCHEMA_DDL, 'cargoguard_schema.sql')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SQL DDL</span>
            </button>
          )}

          {activeFormat === 'json' && (
            <button
              type="button"
              onClick={() => handleDownload(JSON.stringify(JSON_SCHEMA_TELEMETRY_INGEST, null, 2), 'telemetry_ingest_schema.json')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Schema</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveFormat('sql')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeFormat === 'sql'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>PostgreSQL + TimescaleDB (SQL DDL)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFormat('json')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeFormat === 'json'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>IoT Ingest JSON Schema</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFormat('erd')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeFormat === 'erd'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ER Structure Overview</span>
        </button>
      </div>

      {/* SQL DDL Tab */}
      {activeFormat === 'sql' && (
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>PostgreSQL 16 & TimescaleDB Hypertable DDL</span>
            <button
              type="button"
              onClick={() => handleCopy(SQL_SCHEMA_DDL)}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="leading-relaxed text-indigo-300">{SQL_SCHEMA_DDL}</pre>
        </div>
      )}

      {/* JSON Schema Tab */}
      {activeFormat === 'json' && (
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>JSON Schema for IoT Telemetry & Graphene Strain Ingest</span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(JSON_SCHEMA_TELEMETRY_INGEST, null, 2))}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="leading-relaxed text-emerald-300">{JSON.stringify(JSON_SCHEMA_TELEMETRY_INGEST, null, 2)}</pre>
        </div>
      )}

      {/* ER Structure Overview */}
      {activeFormat === 'erd' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-600 dark:text-blue-400">
              <Table className="w-4 h-4" />
              <span>containers</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">PK</strong> container_id (UUID)</li>
              <li>container_code (ISO 6346)</li>
              <li>container_type (Reefer, Dry, High-Cube)</li>
              <li>FK graphene_sensor_id</li>
              <li>FK primary_driver_id</li>
              <li>status (in_transit, customs)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-600 dark:text-purple-400">
              <Table className="w-4 h-4" />
              <span>sensors (Date-Palm Graphene)</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">PK</strong> sensor_id (UUID)</li>
              <li>sensor_modality (strain, temp, accel)</li>
              <li>gauge_factor (142.5 GF)</li>
              <li>base_resistance_ohms (12.5kΩ)</li>
              <li>batch_number (KSA-KAUST-DPG)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
              <span>container_telemetry (TimescaleDB)</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">TIME</strong> recorded_at (TIMESTAMPTZ)</li>
              <li>FK container_id</li>
              <li>temperature_c, humidity_pct</li>
              <li>shock_g, tilt_deg</li>
              <li>strain_microstrain (με)</li>
              <li>raw_payload_hash (SHA-256)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-600 dark:text-rose-400">
              <Table className="w-4 h-4" />
              <span>risk_assessments</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">PK</strong> assessment_id (UUID)</li>
              <li>thermal_risk_t, humidity_risk_h</li>
              <li>shock_risk_s, tilt_risk_l</li>
              <li>strain_risk_d (graphene)</li>
              <li>total_risk_r = 0.25T+0.20H...</li>
              <li>recommendations[]</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-600 dark:text-amber-400">
              <Key className="w-4 h-4" />
              <span>incident_logs (Immutable Chain)</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">PK</strong> incident_id (UUID)</li>
              <li>breached_parameter (strain, temp)</li>
              <li>calculated_risk_r</li>
              <li>previous_block_hash (SHA-256)</li>
              <li>tamper_evident_hash (SHA-256)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
              <Table className="w-4 h-4" />
              <span>cargo_profiles & shipments</span>
            </div>
            <ul className="text-[11px] text-slate-500 font-mono space-y-1">
              <li><strong className="text-slate-800 dark:text-slate-200">PK</strong> profile_id & shipment_id</li>
              <li>temp_min_c, temp_max_c</li>
              <li>shock_threshold_g</li>
              <li>strain_threshold_ue</li>
              <li>declared_value_sar</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
