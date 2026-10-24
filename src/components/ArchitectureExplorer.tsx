import React, { useState } from 'react';
import { 
  Server, 
  Workflow, 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Cpu, 
  Radio, 
  WifiOff, 
  Layers, 
  Send
} from 'lucide-react';
import { 
  ASCII_SYSTEM_ARCHITECTURE, 
  NODEJS_BACKEND_SERVICE_CODE, 
  PYTHON_BACKEND_SERVICE_CODE 
} from '../data/architectureSpec';

export const ArchitectureExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ascii' | 'pipeline' | 'nodejs' | 'python' | 'offline_sync'>('pipeline');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Technical Specification & Implementation Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Cloud, IoT & AI System Architecture Specification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end data flow from date-palm carbon-graphene edge strain sensors to TimescaleDB time-series storage, mathematical risk scoring, and ERP webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'nodejs' && (
            <button
              type="button"
              onClick={() => handleDownload(NODEJS_BACKEND_SERVICE_CODE, 'cargoguard_iot_service.ts')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TS Service</span>
            </button>
          )}
          {activeTab === 'python' && (
            <button
              type="button"
              onClick={() => handleDownload(PYTHON_BACKEND_SERVICE_CODE, 'cargoguard_iot_service.py')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Python Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'pipeline'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Interactive Pipeline Flow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ascii')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'ascii'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>ASCII System Diagram</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offline_sync')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'offline_sync'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Edge Sync Protocol (TR-1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nodejs')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'nodejs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Node.js / TS Ingest Logic</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('python')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'python'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Python Microservice Logic</span>
        </button>
      </div>

      {/* Tab 1: Interactive Pipeline Flow */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                Edge Sensing Layer
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Flexible date-palm carbon-graphene patch on container wall + PT100 temp probe + 3-axis accelerometer sample continuously at 100Hz.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                IoT Edge Gateway
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                ESP32-S3 microcontroller computes local peak shock and checks for cellular connectivity. Dead-zone data caches to internal Flash SQLite.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                MQTT Broker & Queue
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                EMQX cluster ingests payloads over mutual TLS (Port 8883) with QoS 1, streaming directly into Apache Kafka partitioned topics.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                AI Risk Score Engine
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Applies exact formula R = 0.25(T) + 0.20(H) + 0.25(S) + 0.15(L) + 0.15(D). Generates automated preventive actions.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                Storage & Dispatch
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Persists time-series into TimescaleDB, writes immutable SHA-256 audit block, and dispatches SMS/Push alerts to driver and fleet manager.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ASCII Architecture Diagram */}
      {activeTab === 'ascii' && (
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-3 font-mono text-xs overflow-x-auto relative">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>CargoGuard AI™ Architecture Model (ASCII Specification)</span>
            <button
              type="button"
              onClick={() => handleCopy(ASCII_SYSTEM_ARCHITECTURE)}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="leading-relaxed">{ASCII_SYSTEM_ARCHITECTURE}</pre>
        </div>
      )}

      {/* Tab 3: Offline Edge Sync Protocol */}
      {activeTab === 'offline_sync' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Edge Offline Caching & Automatic Bulk Synchronization Protocol (TR-1)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Long-haul transit corridors in the Arabian Peninsula (e.g. Empty Quarter, remote segments of Highway 40 between Taif and Riyadh) frequently experience complete 4G/LTE cellular blackout periods spanning several hours. The CargoGuard AI™ edge gateway employs an autonomous, zero-data-loss synchronization protocol:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                1. Local Flash Ring Buffer
              </div>
              <p className="text-[11px] text-slate-500">
                When MQTT ACK fails after 3 retries, edge firmware automatically redirects telemetry writes to an on-chip SPI Flash SQLite circular buffer (up to 30 days of 1-second interval readings).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                2. Cellular Handshake Recovery
              </div>
              <p className="text-[11px] text-slate-500">
                Upon re-entering cellular range, the gateway validates signal stability (&gt;15 seconds uninterrupted RSRP &gt; -105 dBm) before initiating the bulk transmission session.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                3. Chunked Bulk Ingestion
              </div>
              <p className="text-[11px] text-slate-500">
                Cached packets are compressed with Gzip and sent in 100-reading batch payloads with <span className="font-mono text-blue-500">is_offline_sync: true</span>. TimescaleDB ingests without blocking real-time queues.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Node.js / TypeScript Service */}
      {activeTab === 'nodejs' && (
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>Node.js / TypeScript Ingestion & AI Risk Score Service</span>
            <button
              type="button"
              onClick={() => handleCopy(NODEJS_BACKEND_SERVICE_CODE)}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="leading-relaxed text-blue-300">{NODEJS_BACKEND_SERVICE_CODE}</pre>
        </div>
      )}

      {/* Tab 5: Python Service */}
      {activeTab === 'python' && (
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>Python FastAPI & Paho MQTT Microservice Implementation</span>
            <button
              type="button"
              onClick={() => handleCopy(PYTHON_BACKEND_SERVICE_CODE)}
              className="hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="leading-relaxed text-emerald-300">{PYTHON_BACKEND_SERVICE_CODE}</pre>
        </div>
      )}
    </div>
  );
};
