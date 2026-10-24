import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Compass, 
  Cpu, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Send, 
  Map, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  AlertOctagon,
  X
} from 'lucide-react';
import { ShipmentEntity, RecordedAction } from '../types/cargoguard';

interface UnifiedShipmentDetailProps {
  shipment: ShipmentEntity;
  onRecordAction: (shipmentId: string, action: Omit<RecordedAction, 'id' | 'timestamp'>) => void;
  onOpenMap: () => void;
  onClose?: () => void;
}

export const UnifiedShipmentDetail: React.FC<UnifiedShipmentDetailProps> = ({
  shipment,
  onRecordAction,
  onOpenMap,
  onClose,
}) => {
  const [newActionType, setNewActionType] = useState<RecordedAction['actionType']>('Driver Contacted');
  const [newActionNotes, setNewActionNotes] = useState('');
  const [showAddActionForm, setShowAddActionForm] = useState(false);

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionNotes.trim()) return;

    onRecordAction(shipment.id, {
      actor: 'Fleet Operations Lead',
      actionType: newActionType,
      notes: newActionNotes.trim(),
    });

    setNewActionNotes('');
    setShowAddActionForm(false);
  };

  const { currentConditions } = shipment;

  // Condition evaluation helpers
  const tempBreached = currentConditions.temperature < currentConditions.tempMin || currentConditions.temperature > currentConditions.tempMax;
  const tempDelta = currentConditions.temperature > currentConditions.tempMax
    ? `+${(currentConditions.temperature - currentConditions.tempMax).toFixed(1)}°C above max`
    : currentConditions.temperature < currentConditions.tempMin
    ? `-${(currentConditions.tempMin - currentConditions.temperature).toFixed(1)}°C below min`
    : 'Within safety envelope';

  const humBreached = currentConditions.humidity > currentConditions.humidityMax;
  const shockBreached = currentConditions.shock > currentConditions.shockLimit;
  const tiltBreached = currentConditions.tilt > currentConditions.tiltLimit;
  const strainBreached = currentConditions.strain > currentConditions.strainLimit;
  const strainDelta = strainBreached ? `+${currentConditions.strain - currentConditions.strainLimit} με excess load` : 'Normal structural tension';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {shipment.id}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {shipment.containerCode} ({shipment.containerType})
              </span>

              {shipment.status === 'Needs attention' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Needs Attention
                </span>
              ) : shipment.status === 'In transit' ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  In Transit
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600">
                  Completed
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {shipment.cargoName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{shipment.origin} ➔ {shipment.destination}</span>
              <span>•</span>
              <span>Carrier: <strong className="text-slate-700 dark:text-slate-300">{shipment.carrier}</strong></span>
              <span>•</span>
              <span>Value: <strong className="text-slate-700 dark:text-slate-300">{shipment.cargoValueSar.toLocaleString()} SAR</strong></span>
              <span>•</span>
              <span className="font-mono">Last update: {shipment.lastUpdate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${shipment.driverPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Driver ({shipment.driverName})</span>
            </a>

            <button
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition shadow-2xs"
            >
              <Map className="w-3.5 h-3.5 text-blue-500" />
              <span>View Map</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Environmental & Mechanical Conditions vs Safety Limits */}
        <section aria-labelledby="conditions-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="conditions-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Sensor Conditions vs Cargo Safety Limits
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Sampling frequency: 100Hz • IoT Gateway Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Condition 1: Temperature */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              tempBreached 
                ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Temperature
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  tempBreached ? 'bg-rose-600 text-white' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {tempBreached ? 'EXCEEDED' : 'OK'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentConditions.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Safe: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentConditions.tempMin}°C to {currentConditions.tempMax}°C</span>
              </div>
              <div className={`text-[11px] font-medium ${tempBreached ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                {tempDelta}
              </div>
            </div>

            {/* Condition 2: Humidity */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              humBreached 
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  Humidity
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  humBreached ? 'bg-amber-600 text-white' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {humBreached ? 'HIGH' : 'OK'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentConditions.humidity}%
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Safe Limit: <span className="font-semibold text-slate-700 dark:text-slate-300">&lt; {currentConditions.humidityMax}% RH</span>
              </div>
              <div className={`text-[11px] font-medium ${humBreached ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                {humBreached ? `+${currentConditions.humidity - currentConditions.humidityMax}% RH excess` : 'Moisture safe'}
              </div>
            </div>

            {/* Condition 3: Dynamic Shock */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              shockBreached 
                ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  Dynamic Impact
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  shockBreached ? 'bg-rose-600 text-white' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {shockBreached ? 'IMPACT' : 'OK'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentConditions.shock.toFixed(2)} G
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Safe Limit: <span className="font-semibold text-slate-700 dark:text-slate-300">&lt; {currentConditions.shockLimit} G</span>
              </div>
              <div className={`text-[11px] font-medium ${shockBreached ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                {shockBreached ? `+${(currentConditions.shock - currentConditions.shockLimit).toFixed(2)} G spike` : 'Vibration dampened'}
              </div>
            </div>

            {/* Condition 4: Tilt Angle */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              tiltBreached 
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60' 
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                  Tilt / List
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  tiltBreached ? 'bg-amber-600 text-white' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {tiltBreached ? 'TILTED' : 'OK'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {currentConditions.tilt.toFixed(1)}°
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Safe Limit: <span className="font-semibold text-slate-700 dark:text-slate-300">&lt; {currentConditions.tiltLimit}°</span>
              </div>
              <div className={`text-[11px] font-medium ${tiltBreached ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                {tiltBreached ? 'Cargo shift risk' : 'Chassis level'}
              </div>
            </div>

            {/* Condition 5: Date-Palm Graphene Strain */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              strainBreached 
                ? 'bg-purple-50/80 dark:bg-purple-950/20 border-purple-300 dark:border-purple-900/60' 
                : 'bg-purple-50/30 dark:bg-purple-950/10 border-purple-200/60 dark:border-purple-900/30'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  Graphene Strain
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  strainBreached ? 'bg-purple-700 text-white' : 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                }`}>
                  {strainBreached ? 'EXCESS LOAD' : 'OK'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-950 dark:text-purple-200 font-mono">
                  {currentConditions.strain} με
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Wall Limit: <span className="font-semibold text-slate-700 dark:text-slate-300">&lt; {currentConditions.strainLimit} με</span>
              </div>
              <div className={`text-[11px] font-medium ${strainBreached ? 'text-purple-700 dark:text-purple-300 font-semibold' : 'text-slate-500'}`}>
                {strainDelta}
              </div>
            </div>
          </div>
        </section>

        {/* Telemetry 2-Hour Trends */}
        <section aria-labelledby="trends-heading" className="space-y-2 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <h4 id="trends-heading" className="font-bold text-slate-800 dark:text-slate-200">
              Recent 2-Hour Telemetry Excursion Trend (5 Samples)
            </h4>
            <span className="text-slate-400 text-[11px]">Interval: 30 min</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs pt-1">
            {shipment.telemetryHistory.map((pt, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-sans">{pt.time}</div>
                <div className={`font-bold ${pt.temperature > shipment.currentConditions.tempMax ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                  {pt.temperature}°C
                </div>
                <div className="text-[10px] text-slate-500">{pt.shock}G</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{pt.strain}με</div>
              </div>
            ))}
          </div>
        </section>

        {/* Split Grid: Incident Timeline (Left) & Recorded Actions Log (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Incident Timeline */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Incident Timeline & Excursion Duration ({shipment.incidents.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {shipment.incidents.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 text-center">
                  Zero incidents recorded on this voyage.
                </div>
              ) : (
                shipment.incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      inc.status === 'active'
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-400 text-[11px]">{inc.timestamp}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{inc.title}</span>
                      </div>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                        inc.status === 'active'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {inc.status}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {inc.detail}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Duration: {inc.duration}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recorded Actions & Interventions Log */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Action Log & Interventions ({shipment.actionLogs.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowAddActionForm(!showAddActionForm)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Action</span>
              </button>
            </div>

            {/* Quick Add Action Form */}
            {showAddActionForm && (
              <form onSubmit={handleAddAction} className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  Record Operator / Driver Intervention
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Action Type</label>
                    <select
                      value={newActionType}
                      onChange={(e) => setNewActionType(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                    >
                      <option value="Driver Contacted">Driver Contacted</option>
                      <option value="Genset Restarted">Genset Restarted</option>
                      <option value="Speed Reduced">Speed Reduced</option>
                      <option value="Straps Tightened">Straps Tightened</option>
                      <option value="Checkpoint Verified">Checkpoint Verified</option>
                      <option value="Note Added">Note Added</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Operator</label>
                    <input
                      type="text"
                      disabled
                      value="Fleet Operations Lead"
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Intervention Notes / Directives Given</label>
                  <textarea
                    rows={2}
                    value={newActionNotes}
                    onChange={(e) => setNewActionNotes(e.target.value)}
                    placeholder="Enter details of action taken (e.g. driver instructed to reset breaker at rest bay)..."
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddActionForm(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-2xs"
                  >
                    Save Action
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {shipment.actionLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 text-center">
                  No actions logged yet.
                </div>
              ) : (
                shipment.actionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 dark:text-white">{log.actionType}</span>
                        <span className="text-slate-400 text-[11px]">by {log.actor}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {log.notes}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
