import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Check, 
  PhoneCall, 
  ShieldAlert, 
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ActionableAlertItem } from '../types/cargoguard';

interface ActionableAlertsListProps {
  alerts: ActionableAlertItem[];
  onSelectShipment: (shipmentId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onQuickAction: (alert: ActionableAlertItem) => void;
}

export const ActionableAlertsList: React.FC<ActionableAlertsListProps> = ({
  alerts,
  onSelectShipment,
  onAcknowledgeAlert,
  onQuickAction,
}) => {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Zero Active Excursions
            </h3>
            <p className="text-xs text-slate-500">
              All monitored shipments are operating within prescribed environmental & mechanical limits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityStyle = (severity: ActionableAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60',
          badge: 'bg-rose-600 text-white font-bold',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
          durationBadge: 'bg-rose-200/80 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200',
        };
      case 'high':
        return {
          cardBg: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60',
          badge: 'bg-amber-600 text-white font-bold',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          durationBadge: 'bg-amber-200/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200',
        };
      case 'medium':
      default:
        return {
          cardBg: 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
          badge: 'bg-slate-700 text-slate-100 font-semibold',
          icon: <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0" />,
          durationBadge: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        };
    }
  };

  return (
    <section aria-labelledby="actionable-alerts-heading" className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <h2 id="actionable-alerts-heading" className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            What Needs Your Attention
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {unacknowledgedAlerts.length} Active Issue{unacknowledgedAlerts.length === 1 ? '' : 's'}
          </span>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Prioritized by duration & excursion delta
        </span>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${style.cardBg} ${
                alert.acknowledged ? 'opacity-70 saturate-50' : 'shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left Problem Info */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{style.icon}</div>
                  <div className="space-y-1">
                    {/* Meta pill badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide ${style.badge}`}>
                        {alert.severity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectShipment(alert.shipmentId)}
                        className="font-mono text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 underline decoration-dotted transition"
                        title="Click to view shipment details"
                      >
                        {alert.shipmentId}
                      </button>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                        {alert.containerCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${style.durationBadge}`}>
                        <Clock className="w-3 h-3" />
                        Active for {alert.durationMinutes} min
                      </span>
                    </div>

                    {/* Specific concrete problem */}
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {alert.problem}
                    </p>

                    {/* Recommended Next Step */}
                    <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 mt-1">
                      <span className="font-bold text-blue-700 dark:text-blue-400 shrink-0">
                        Action Required:
                      </span>
                      <span>{alert.recommendedNextSteps}</span>
                    </div>

                    {alert.actionTaken && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                        ✓ Action recorded: {alert.actionTaken}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  {!alert.acknowledged && (
                    <button
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-2xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onQuickAction(alert)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Contact Driver</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectShipment(alert.shipmentId)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition flex items-center gap-1"
                    title="Open unified single-page details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
