import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  MapPin, 
  FileCheck2, 
  Activity, 
  Search, 
  Bell, 
  Truck, 
  Map, 
  RotateCcw,
  Plus,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

import { 
  ShipmentEntity, 
  ShipmentFilterStatus, 
  ActionableAlertItem, 
  CargoProfile, 
  UserRole,
  RecordedAction
} from './types/cargoguard';

import { INITIAL_CARGO_PROFILES } from './data/cargoProfiles';
import { INITIAL_SHIPMENTS, INITIAL_ACTIONABLE_ALERTS } from './data/mockShipmentsData';

import { ActionableAlertsList } from './components/ActionableAlertsList';
import { ShipmentListView } from './components/ShipmentListView';
import { UnifiedShipmentDetail } from './components/UnifiedShipmentDetail';
import { SecondaryMapDrawer } from './components/SecondaryMapDrawer';
import { ReportsEvidenceView } from './components/ReportsEvidenceView';
import { DiscreetSettingsModal } from './components/DiscreetSettingsModal';

export default function App() {
  const [activeMainView, setActiveMainView] = useState<'shipments' | 'reports'>('shipments');
  const [shipments, setShipments] = useState<ShipmentEntity[]>(INITIAL_SHIPMENTS);
  const [alerts, setAlerts] = useState<ActionableAlertItem[]>(INITIAL_ACTIONABLE_ALERTS);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(INITIAL_SHIPMENTS[0].id);
  const [activeFilter, setActiveFilter] = useState<ShipmentFilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Secondary Map state (minimized footprint by default)
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);

  // Discreet Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cargoProfiles, setCargoProfiles] = useState<CargoProfile[]>(INITIAL_CARGO_PROFILES);
  const [currentRole, setCurrentRole] = useState<UserRole>('fleet_manager');

  // Currently selected shipment object
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  // Quick action from alert card (e.g. Call Driver / Log Directive)
  const handleQuickAction = (alert: ActionableAlertItem) => {
    setSelectedShipmentId(alert.shipmentId);
    // Add intervention log entry
    const newLog: RecordedAction = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Fleet Ops Controller',
      actionType: 'Driver Contacted',
      notes: `Initiated emergency voice call to driver regarding: ${alert.problem}. Recommended: ${alert.recommendedNextSteps}`,
    };

    setShipments(prev => prev.map(s => {
      if (s.id !== alert.shipmentId) return s;
      return {
        ...s,
        actionLogs: [newLog, ...s.actionLogs],
      };
    }));

    // Update alert
    setAlerts(prev => prev.map(a => a.id === alert.id ? {
      ...a,
      acknowledged: true,
      actionTaken: 'Emergency voice call dispatched to driver.',
    } : a));
  };

  // Record an action / intervention on a shipment
  const handleRecordAction = (shipmentId: string, action: Omit<RecordedAction, 'id' | 'timestamp'>) => {
    const newLog: RecordedAction = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...action,
    };

    setShipments(prev => prev.map(s => {
      if (s.id !== shipmentId) return s;
      return {
        ...s,
        actionLogs: [newLog, ...s.actionLogs],
      };
    }));
  };

  // Background subtle telemetry micro-updates (simulating live edge updates)
  useEffect(() => {
    const timer = setInterval(() => {
      setShipments(prev => prev.map(s => {
        if (s.status === 'Completed') return s;
        // Minor natural sensor micro-noise
        const deltaTemp = (Math.random() - 0.5) * 0.1;
        const deltaStrain = Math.round((Math.random() - 0.5) * 4);

        return {
          ...s,
          lastUpdate: 'Just now',
          currentConditions: {
            ...s.currentConditions,
            temperature: Number((s.currentConditions.temperature + deltaTemp).toFixed(1)),
            strain: Math.max(50, s.currentConditions.strain + deltaStrain),
          },
        };
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const completedShipments = shipments.filter(s => s.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col">
      {/* Discreet, Clean Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 gap-4">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                    CargoGuard AI™
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Logistics Fleet Operations
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Smart Container Protection • Actionable Risk Mitigation
                </p>
              </div>
            </div>

            {/* Center: View Switcher (Shipments vs Reports) */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMainView('shipments')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeMainView === 'shipments'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>Active Shipments</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMainView('reports')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeMainView === 'reports'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Reports & Evidence</span>
              </button>
            </div>

            {/* Right: Map Quick Toggle & Discreet Settings Gear */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMapDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Open secondary location map"
              >
                <Map className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Corridor Map</span>
              </button>

              {/* Discreet Settings Gear Icon */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="System Settings (Cargo Profiles, Devices, Notifications, Roles)"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {activeMainView === 'shipments' ? (
          <>
            {/* 1. Actionable Alerts First ("What needs my attention?") */}
            <ActionableAlertsList
              alerts={alerts}
              onSelectShipment={(shipmentId) => setSelectedShipmentId(shipmentId)}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onQuickAction={handleQuickAction}
            />

            {/* 2. Compact Shipment List & Unified Single-Page Details ("What's happening to this cargo?") */}
            <div className="space-y-6">
              {/* Compact Shipment List */}
              <section aria-labelledby="shipment-list-heading" className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 id="shipment-list-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Fleet Shipments ({shipments.length})
                  </h2>
                  <span className="text-xs text-slate-400">
                    Click any shipment to inspect unified live conditions
                  </span>
                </div>

                <ShipmentListView
                  shipments={shipments}
                  selectedShipmentId={selectedShipmentId}
                  onSelectShipment={(id) => setSelectedShipmentId(id)}
                  activeFilter={activeFilter}
                  onFilterChange={(filter) => setActiveFilter(filter)}
                  searchQuery={searchQuery}
                  onSearchChange={(query) => setSearchQuery(query)}
                />
              </section>

              {/* Unified Single-Page Detail View */}
              {selectedShipment && (
                <section aria-labelledby="selected-cargo-heading" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 id="selected-cargo-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Cargo Status & Environmental Limits: {selectedShipment.id}
                    </h2>
                  </div>

                  <UnifiedShipmentDetail
                    shipment={selectedShipment}
                    onRecordAction={handleRecordAction}
                    onOpenMap={() => setIsMapDrawerOpen(true)}
                  />
                </section>
              )}
            </div>
          </>
        ) : (
          /* 3. Reports & Evidence View ("What happened during the trip?") */
          <ReportsEvidenceView
            completedShipments={completedShipments}
          />
        )}
      </main>

      {/* Secondary Map Drawer / Modal (Minimizes Footprint; appears on demand) */}
      <SecondaryMapDrawer
        isOpen={isMapDrawerOpen}
        onClose={() => setIsMapDrawerOpen(false)}
        selectedShipment={selectedShipment}
        allShipments={shipments}
      />

      {/* Discreet Settings Modal (Hidden behind gear icon) */}
      <DiscreetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        cargoProfiles={cargoProfiles}
        onUpdateCargoProfile={(updated) => {
          setCargoProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
        }}
      />

      {/* Discreet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">CargoGuard AI™</span>
            <span>• Human-Centric Cargo Protection & Predictive Mitigation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Date-Palm Carbon-Graphene Piezoresistive Sensing</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:underline flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>System Settings</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
