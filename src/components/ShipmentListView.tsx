import React from 'react';
import { 
  Search, 
  Truck, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Filter,
  Thermometer,
  Cpu
} from 'lucide-react';
import { ShipmentEntity, ShipmentFilterStatus } from '../types/cargoguard';

interface ShipmentListViewProps {
  shipments: ShipmentEntity[];
  selectedShipmentId: string;
  onSelectShipment: (id: string) => void;
  activeFilter: ShipmentFilterStatus;
  onFilterChange: (filter: ShipmentFilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ShipmentListView: React.FC<ShipmentListViewProps> = ({
  shipments,
  selectedShipmentId,
  onSelectShipment,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  // Counts for tabs
  const counts = {
    all: shipments.length,
    needs_attention: shipments.filter(s => s.status === 'Needs attention').length,
    in_transit: shipments.filter(s => s.status === 'In transit').length,
    completed: shipments.filter(s => s.status === 'Completed').length,
  };

  // Filtered list
  const filtered = shipments.filter(s => {
    // Tab filter
    if (activeFilter === 'needs_attention' && s.status !== 'Needs attention') return false;
    if (activeFilter === 'in_transit' && s.status !== 'In transit') return false;
    if (activeFilter === 'completed' && s.status !== 'Completed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (
        s.id.toLowerCase().includes(q) ||
        s.containerCode.toLowerCase().includes(q) ||
        s.cargoName.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.driverName.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Simple Filter Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('needs_attention')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'needs_attention'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>Needs attention ({counts.needs_attention})</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('in_transit')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeFilter === 'in_transit'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            In transit ({counts.in_transit})
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeFilter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({counts.completed})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shipment, cargo, route..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Compact Shipment List Items */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No shipments match the selected filter or search query.
          </div>
        ) : (
          filtered.map((shipment) => {
            const isSelected = shipment.id === selectedShipmentId;

            return (
              <div
                key={shipment.id}
                onClick={() => onSelectShipment(shipment.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  {/* Left Column: Shipment ID, Status Pill, Cargo */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {shipment.id}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {shipment.containerCode}
                      </span>

                      {/* Status Pill */}
                      {shipment.status === 'Needs attention' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          Needs Attention
                        </span>
                      )}
                      {shipment.status === 'In transit' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          In Transit
                        </span>
                      )}
                      {shipment.status === 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {shipment.cargoName}
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{shipment.origin}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{shipment.destination}</span>
                    </div>
                  </div>

                  {/* Right Column: Concrete Status Summary & Last Update */}
                  <div className="text-left sm:text-right space-y-1 shrink-0">
                    {/* Concrete Human-Readable Status */}
                    <div className={`text-xs font-semibold ${
                      shipment.hasActiveIssue 
                        ? 'text-rose-600 dark:text-rose-400' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {shipment.concreteProblemSummary}
                    </div>

                    <div className="flex sm:justify-end items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Temp: {shipment.currentConditions.temperature}°C</span>
                      <span>Strain: {shipment.currentConditions.strain} με</span>
                      <span>{shipment.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
