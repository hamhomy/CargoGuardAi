import React, { useState } from 'react';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  Monitor, 
  Volume2, 
  VolumeX,
  Filter,
  Check
} from 'lucide-react';
import { AlertNotification } from '../types/cargoguard';

interface LiveAlertPanelProps {
  alerts: AlertNotification[];
  onAcknowledgeAlert: (alertId: string) => void;
  onClearAll?: () => void;
}

export const LiveAlertPanel: React.FC<LiveAlertPanelProps> = ({
  alerts,
  onAcknowledgeAlert,
  onClearAll,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            {criticalCount + warningCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Live Alert Center & Multi-Channel Dispatch
          </h2>
          <div className="flex items-center gap-1.5 ml-1">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {warningCount} Warning
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 transition"
            title={soundEnabled ? 'Mute alert sounds' : 'Unmute alert sounds'}
            aria-label={soundEnabled ? 'Mute alert sounds' : 'Unmute alert sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterSeverity === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('critical')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterSeverity === 'critical'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Critical
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('warning')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterSeverity === 'warning'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Warning
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Channel Protocol Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Dispatched Channels:
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Monitor className="w-3.5 h-3.5" /> Fleet Dashboard UI
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-3.5 h-3.5" /> SMS Driver Broadcast (Unifonic / Twilio)
          </span>
          <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
            <Smartphone className="w-3.5 h-3.5" /> Mobile Push (Firebase FCM)
          </span>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/70 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Zero Active Breaches
            </p>
            <p className="text-xs text-slate-500">
              All monitored container telemetry streams are operating within safe tolerances.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all ${
                alert.acknowledged
                  ? 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                  : alert.severity === 'critical'
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {alert.severity === 'critical' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {alert.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {alert.container_id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                      {alert.message}
                    </p>

                    <div className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold mr-1">
                        Directive:
                      </span>
                      {alert.action_recommended}
                    </div>

                    {/* Dispatched Channels */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Delivered via:</span>
                      {alert.channels.includes('dashboard') && (
                        <span className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                          <Monitor className="w-3 h-3" /> Dashboard
                        </span>
                      )}
                      {alert.channels.includes('sms') && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                          <MessageSquare className="w-3 h-3" /> SMS Sent
                        </span>
                      )}
                      {alert.channels.includes('push') && (
                        <span className="inline-flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
                          <Smartphone className="w-3 h-3" /> Push App
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acknowledge Button */}
                <div className="shrink-0">
                  {alert.acknowledged ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <Check className="w-3.5 h-3.5" /> Ack'd
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-xs"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
