import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Printer, 
  Hash, 
  Check, 
  Copy, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText
} from 'lucide-react';
import { ShipmentEntity } from '../types/cargoguard';

interface ReportsEvidenceViewProps {
  completedShipments: ShipmentEntity[];
}

export const ReportsEvidenceView: React.FC<ReportsEvidenceViewProps> = ({
  completedShipments,
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    completedShipments[0]?.id || ''
  );
  const [copiedHash, setCopiedHash] = useState(false);
  const [exportedJson, setExportedJson] = useState(false);

  const activeShipment = completedShipments.find(s => s.id === selectedShipmentId) || completedShipments[0];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportJson = () => {
    if (!activeShipment) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeShipment, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `CargoGuard_TripAudit_${activeShipment.id}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setExportedJson(true);
    setTimeout(() => setExportedJson(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!activeShipment) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        No completed trips available for audit report generation yet.
      </div>
    );
  }

  const audit = activeShipment.tripAudit || {
    id: `audit-${activeShipment.id}`,
    trip_id: `TRIP-KSA-${activeShipment.id}`,
    container_code: activeShipment.containerCode,
    start_time: '2026-10-21T11:00:00Z',
    end_time: '2026-10-22T20:15:00Z',
    origin: activeShipment.origin,
    destination: activeShipment.destination,
    cargo_name: activeShipment.cargoName,
    total_km: 495,
    max_shock_g: activeShipment.currentConditions.shock,
    max_temp_c: activeShipment.currentConditions.temperature,
    min_temp_c: activeShipment.currentConditions.tempMin,
    max_strain_ue: activeShipment.currentConditions.strain,
    peak_risk_score: 18.2,
    breach_count: activeShipment.incidents.length,
    cryptographic_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'Compliant' as const,
    inspector_signoff: 'Tariq Al-Ghamdi (Lloyds Register Quality Assurance #LR-9921)',
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Trip Reports & Digital Evidence Hub ("What happened during the trip?")
          </h2>
          <p className="text-xs text-slate-500">
            Immutable trip audit logs, environmental exposure limits, recorded incident timelines, and tamper-evident SHA-256 certifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportedJson && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Exported JSON
            </span>
          )}
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Audit</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Completed Voyages Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
            Completed Trips ({completedShipments.length})
          </div>

          {completedShipments.map(s => {
            const isSelected = s.id === selectedShipmentId;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedShipmentId(s.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {s.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                    Compliant
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {s.cargoName}
                </div>

                <div className="text-[11px] text-slate-500 mt-1">
                  {s.origin} ➔ {s.destination}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate & Audit Details */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Top Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Verified Cargo Delivery Certification
              </div>
              <h3 className="text-lg font-black tracking-tight mt-1">
                Voyage Audit #{audit.trip_id}
              </h3>
              <p className="text-xs text-slate-400">
                Carrier: {activeShipment.carrier} • Container: {activeShipment.containerCode}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Handover Compliant
            </span>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-500" />
                Tamper-Evident SHA-256 Digital Evidence Seal:
              </span>
              <button
                type="button"
                onClick={() => handleCopyHash(audit.cryptographic_hash)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all select-all">
              {audit.cryptographic_hash}
            </div>
          </div>

          {/* Environmental Extremes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recorded Environmental Extremes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">MAX TEMP</div>
                <div className="text-sm font-bold text-amber-600">{audit.max_temp_c}°C</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">PEAK SHOCK</div>
                <div className="text-sm font-bold text-rose-600">{audit.max_shock_g.toFixed(2)}G</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                <div className="text-[10px] text-purple-600 font-sans font-semibold">MAX GRAPHENE STRAIN</div>
                <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{audit.max_strain_ue} με</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">TOTAL BREACHES</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{audit.breach_count}</div>
              </div>
            </div>
          </div>

          {/* Actions & Interventions Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recorded Trip Actions & Interventions ({activeShipment.actionLogs.length})
            </h4>
            <div className="space-y-1.5 text-xs">
              {activeShipment.actionLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.actionType}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">by {log.actor}</span>
                    <p className="text-slate-500 text-[11px]">{log.notes}</p>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              Inspector Attestation & Insurance Signoff:
            </div>
            <p className="text-slate-500 text-[11px]">
              {audit.inspector_signoff}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
