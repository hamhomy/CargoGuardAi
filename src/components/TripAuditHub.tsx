import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Hash, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Truck,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { TripAuditRecord } from '../types/cargoguard';
import { INITIAL_TRIP_AUDITS } from '../data/mockFleetData';

export const TripAuditHub: React.FC = () => {
  const [auditRecords, setAuditRecords] = useState<TripAuditRecord[]>(INITIAL_TRIP_AUDITS);
  const [selectedAuditId, setSelectedAuditId] = useState<string>(INITIAL_TRIP_AUDITS[0].id);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedRecord = auditRecords.find(a => a.id === selectedAuditId) || auditRecords[0];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedRecord, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CargoGuard_Audit_${selectedRecord.trip_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Regulatory Compliance & Insurance Handover
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Digital Evidence & Trip Audit Certification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable trip records documenting full environmental exposure, graphene strain spikes, and tamper-evident SHA-256 seals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {downloadSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Exported JSON
            </span>
          )}
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Certificate</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Certificate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Trips List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Completed & Verified Voyages ({auditRecords.length})
          </div>

          <div className="space-y-2">
            {auditRecords.map(record => {
              const isSelected = record.id === selectedAuditId;
              const isCompliant = record.status === 'Compliant';

              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedAuditId(record.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                      {record.trip_id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isCompliant
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {record.cargo_name}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    {record.origin} ➔ {record.destination}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>Peak Risk: {record.peak_risk_score}</span>
                    <span>Breaches: {record.breach_count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Audit Certificate Viewer */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          {/* Certificate Header Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  CargoGuard AI™ Verified Compliance Log
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight mt-1">
                Trip Certificate #{selectedRecord.trip_id}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ISO Container: {selectedRecord.container_code} • {selectedRecord.total_km} km Transit Route
              </p>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                selectedRecord.status === 'Compliant'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {selectedRecord.status}
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Seal Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Hash className="w-3.5 h-3.5 text-blue-500" />
                <span>Tamper-Evident SHA-256 Digital Fingerprint:</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyHash(selectedRecord.cryptographic_hash)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all select-all">
              {selectedRecord.cryptographic_hash}
            </div>
            <div className="text-[10px] text-slate-400">
              * This immutable cryptographic hash verifies that zero environmental data, shock points, or date-palm graphene strain logs were altered in transit.
            </div>
          </div>

          {/* Environmental Conditions Telemetry Extremes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Voyage Environmental Exposure Envelope
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">TEMPERATURE RANGE</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {selectedRecord.min_temp_c}°C – {selectedRecord.max_temp_c}°C
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">PEAK DYNAMIC SHOCK</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  {selectedRecord.max_shock_g.toFixed(2)} G
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-sans font-semibold">MAX GRAPHENE STRAIN</div>
                <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                  {selectedRecord.max_strain_ue} με
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">TOTAL BREACH COUNT</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecord.breach_count} Incidents
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Signoff Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Quality & Insurance Inspector Attestation:
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {selectedRecord.inspector_signoff || 'Pending inspection signoff'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
