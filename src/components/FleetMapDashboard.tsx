import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Zap, 
  Activity, 
  Thermometer, 
  Cpu, 
  RefreshCw, 
  Maximize2,
  Compass,
  Radio,
  Layers,
  Sparkles,
  Truck,
  RotateCcw
} from 'lucide-react';
import { ContainerEntity } from '../types/cargoguard';

interface FleetMapDashboardProps {
  containers: ContainerEntity[];
  selectedContainerId: string;
  onSelectContainer: (containerId: string) => void;
  onInjectStress: (type: 'shock' | 'temp' | 'strain' | 'tilt' | 'reset') => void;
}

export const FleetMapDashboard: React.FC<FleetMapDashboardProps> = ({
  containers,
  selectedContainerId,
  onSelectContainer,
  onInjectStress,
}) => {
  const [mapLayer, setMapLayer] = useState<'corridors' | 'satellite' | 'terrain'>('corridors');

  // Bounding box for Saudi Arabia projection (approximate SVG viewport mapping)
  // Lat: 16°N to 32°N, Lng: 34°E to 55°E
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 16;
    const maxLat = 32;
    const minLng = 34;
    const maxLng = 55;

    // SVG dimensions: 900 x 500
    const x = ((lng - minLng) / (maxLng - minLng)) * 820 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 440 + 30;
    return { x, y };
  };

  // Saudi Ports and Dry Port Waypoints
  const hubs = [
    { name: 'Jeddah Islamic Port', lat: 21.4858, lng: 39.1925, code: 'JIP' },
    { name: 'Riyadh Dry Port', lat: 24.7136, lng: 46.6753, code: 'RDP' },
    { name: 'King Abdulaziz Port Dammam', lat: 26.4344, lng: 50.1033, code: 'KAP' },
    { name: 'King Abdullah Port Rabigh', lat: 22.5400, lng: 39.0800, code: 'KAB' },
    { name: 'Yanbu Commercial Port', lat: 24.0889, lng: 38.0637, code: 'YCP' },
    { name: 'NEOM Port Duba', lat: 27.3489, lng: 35.7196, code: 'NEOM' },
    { name: 'Jazan Economic Port', lat: 16.8892, lng: 42.5511, code: 'JAZ' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation & Stress-Testing Quick Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4 border border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Interactive Telemetry Injector
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-400/20 text-blue-200">
                Real-Time Testbed
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Trigger real-time physical telemetry stresses to observe instant AI risk recalculation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onInjectStress('shock')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Inject Shock (3.2G)</span>
          </button>

          <button
            type="button"
            onClick={() => onInjectStress('temp')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 transition flex items-center gap-1.5"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Failure (+12°C)</span>
          </button>

          <button
            type="button"
            onClick={() => onInjectStress('strain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Graphene Strain (850 με)</span>
          </button>

          <button
            type="button"
            onClick={() => onInjectStress('tilt')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tilt Spike (18°)</span>
          </button>

          <button
            type="button"
            onClick={() => onInjectStress('reset')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Map Top Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Fleet Telemetry & Risk Corridor Tracking (Saudi Arabian Logistics Corridors)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({containers.length} Smart Containers Monitored)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-3 mr-3 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk (R &lt; 35)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Risk (35–64)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk (R &ge; 65)
              </span>
            </div>

            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMapLayer('corridors')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  mapLayer === 'corridors'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Logistics Corridors
              </button>
              <button
                type="button"
                onClick={() => setMapLayer('terrain')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  mapLayer === 'terrain'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Topographic
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Map */}
        <div className="relative w-full h-[460px] bg-slate-950 overflow-hidden select-none">
          {/* Radar scan aesthetic line */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <svg className="w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Saudi Arabian & Arabian Peninsula Coastline / Territory outline */}
            <path
              d="M 120,40 L 260,35 L 420,45 L 680,60 L 760,110 L 730,220 L 780,290 L 710,420 L 590,470 L 460,460 L 320,440 L 250,380 L 190,280 L 140,160 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Red Sea Corridor Water Body */}
            <path
              d="M 50,40 Q 150,220 280,480 L 180,500 L 30,50 Z"
              fill="#091428"
              opacity="0.8"
            />
            <text x="80" y="280" fill="#1e3a5f" fontSize="13" fontWeight="bold" transform="rotate(-65 80 280)" letterSpacing="4">
              RED SEA MARITIME CORRIDOR
            </text>

            <text x="730" y="160" fill="#1e3a5f" fontSize="13" fontWeight="bold" transform="rotate(45 730 160)" letterSpacing="4">
              ARABIAN GULF
            </text>

            {/* Key Highway / Railway Corridors */}
            {/* Highway 40 (Jeddah to Riyadh) */}
            <path
              d={`M ${projectCoords(21.4858, 39.1925).x},${projectCoords(21.4858, 39.1925).y} 
                  Q ${(projectCoords(21.4858, 39.1925).x + projectCoords(24.7136, 46.6753).x)/2},${projectCoords(21.4858, 39.1925).y - 20} 
                  ${projectCoords(24.7136, 46.6753).x},${projectCoords(24.7136, 46.6753).y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Dammam to Riyadh Landbridge */}
            <path
              d={`M ${projectCoords(26.4344, 50.1033).x},${projectCoords(26.4344, 50.1033).y} 
                  L ${projectCoords(24.7136, 46.6753).x},${projectCoords(24.7136, 46.6753).y}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            {/* Red Sea Highway 5 (Yanbu to NEOM) */}
            <path
              d={`M ${projectCoords(22.54, 39.08).x},${projectCoords(22.54, 39.08).y} 
                  L ${projectCoords(24.0889, 38.0637).x},${projectCoords(24.0889, 38.0637).y}
                  L ${projectCoords(27.3489, 35.7196).x},${projectCoords(27.3489, 35.7196).y}`}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.5"
            />

            {/* Hubs / Major Ports */}
            {hubs.map((hub, idx) => {
              const { x, y } = projectCoords(hub.lat, hub.lng);
              return (
                <g key={idx} className="cursor-default">
                  <circle cx={x} cy={y} r="5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="10" fill="transparent" stroke="#475569" strokeWidth="0.8" strokeDasharray="2 2" />
                  <text
                    x={x + 8}
                    y={y + 3}
                    fill="#cbd5e1"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}

            {/* Active Moving Containers */}
            {containers.map((cont) => {
              const { x, y } = projectCoords(
                cont.latest_telemetry.latitude,
                cont.latest_telemetry.longitude
              );
              const isSelected = cont.id === selectedContainerId;
              const risk = cont.latest_risk.total_risk;
              const color = risk >= 65 ? '#f43f5e' : risk >= 35 ? '#f59e0b' : '#10b981';

              return (
                <g
                  key={cont.id}
                  onClick={() => onSelectContainer(cont.id)}
                  className="cursor-pointer group"
                >
                  {/* Ping Animation for High/Medium risk */}
                  {risk >= 35 && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  )}

                  {/* Core Container Marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 8}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />

                  {/* Label Pill */}
                  <g transform={`translate(${x - 35}, ${y - 30})`}>
                    <rect
                      width="70"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                    <text
                      x="35"
                      y="13"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {cont.container_code.replace('CG-SA-', '')} ({risk.toFixed(0)})
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Overlay Card: Selected Container Quick Telemetry Snapshot */}
          {selectedContainerId && (
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 text-white shadow-xl">
              {(() => {
                const active = containers.find(c => c.id === selectedContainerId);
                if (!active) return null;
                const risk = active.latest_risk;
                const riskColor = risk.total_risk >= 65 ? 'text-rose-400' : risk.total_risk >= 35 ? 'text-amber-400' : 'text-emerald-400';

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-xs tracking-wide">
                          {active.container_code} • {active.container_type}
                        </span>
                      </div>
                      <span className={`text-xs font-extrabold ${riskColor}`}>
                        Risk: {risk.total_risk.toFixed(1)}/100
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400">Route:</span> {active.origin} ➔ {active.destination}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <span>Loc:</span> {active.current_location_name}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
                      <div className="bg-slate-800/80 p-1.5 rounded">
                        <div className="text-[9px] text-slate-400">TEMP</div>
                        <div className="text-xs font-bold text-amber-300">
                          {active.latest_telemetry.temperature}°C
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded">
                        <div className="text-[9px] text-slate-400">SHOCK</div>
                        <div className="text-xs font-bold text-rose-300">
                          {active.latest_telemetry.shock_g.toFixed(2)}G
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded">
                        <div className="text-[9px] text-slate-400">TILT</div>
                        <div className="text-xs font-bold text-indigo-300">
                          {Math.abs(active.latest_telemetry.tilt_deg).toFixed(1)}°
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded border border-purple-500/30">
                        <div className="text-[9px] text-purple-300">STRAIN</div>
                        <div className="text-xs font-bold text-purple-200">
                          {active.latest_telemetry.strain_microstrain}με
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Container Cards Stream Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Fleet Container Telemetry Stream</span>
            <span className="text-xs font-normal text-slate-500">
              (Click to select for detailed risk formula breakdown)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.map((container) => {
            const isSelected = container.id === selectedContainerId;
            const risk = container.latest_risk.total_risk;
            const badgeColor = risk >= 65 ? 'bg-rose-500/10 text-rose-600 border-rose-500/30' : risk >= 35 ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';

            return (
              <div
                key={container.id}
                onClick={() => onSelectContainer(container.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-600 bg-blue-50/20 dark:bg-blue-950/20 border-blue-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {container.container_code}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {container.container_type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {container.cargo_name}
                    </div>
                  </div>

                  <div className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${badgeColor}`}>
                    {risk.toFixed(1)} / 100
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="truncate">
                    <span className="text-slate-400">Origin:</span> {container.origin}
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400">Dest:</span> {container.destination}
                  </div>
                </div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center font-mono">
                  <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">TEMP</div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {container.latest_telemetry.temperature}°C
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">HUM</div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {container.latest_telemetry.humidity}%
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">SHOCK</div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {container.latest_telemetry.shock_g.toFixed(1)}G
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">TILT</div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {Math.abs(container.latest_telemetry.tilt_deg).toFixed(0)}°
                    </div>
                  </div>
                  <div className="p-1 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
                    <div className="text-[9px] text-purple-600 dark:text-purple-400">STRAIN</div>
                    <div className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      {container.latest_telemetry.strain_microstrain}με
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
