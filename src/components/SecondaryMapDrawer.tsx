import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Layers, 
  Minimize2, 
  ExternalLink,
  Truck
} from 'lucide-react';
import { ShipmentEntity } from '../types/cargoguard';

interface SecondaryMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedShipment: ShipmentEntity;
  allShipments: ShipmentEntity[];
}

export const SecondaryMapDrawer: React.FC<SecondaryMapDrawerProps> = ({
  isOpen,
  onClose,
  selectedShipment,
  allShipments,
}) => {
  if (!isOpen) return null;

  // SVG coordinate projection
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 16;
    const maxLat = 32;
    const minLng = 34;
    const maxLng = 55;
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
    return { x, y };
  };

  const ports = [
    { name: 'Jeddah Islamic Port', lat: 21.4858, lng: 39.1925 },
    { name: 'Riyadh Dry Port', lat: 24.7136, lng: 46.6753 },
    { name: 'King Abdulaziz Port Dammam', lat: 26.4344, lng: 50.1033 },
    { name: 'King Abdullah Port Rabigh', lat: 22.5400, lng: 39.0800 },
    { name: 'Yanbu Commercial Port', lat: 24.0889, lng: 38.0637 },
    { name: 'NEOM Port Duba', lat: 27.3489, lng: 35.7196 },
    { name: 'Jazan Economic Port', lat: 16.8892, lng: 42.5511 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold">
              Secondary Location Map: {selectedShipment.id} ({selectedShipment.containerCode})
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              GPS: {selectedShipment.coordinates.lat.toFixed(4)}°N, {selectedShipment.coordinates.lng.toFixed(4)}°E
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close location map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body */}
        <div className="relative w-full h-[400px] bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Peninsula Outline */}
            <path
              d="M 90,30 L 220,25 L 360,35 L 600,50 L 680,95 L 650,190 L 700,250 L 630,360 L 520,390 L 400,380 L 280,360 L 210,310 L 160,230 L 110,130 Z"
              fill="#091124"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Red Sea Corridor */}
            <text x="60" y="240" fill="#1e3a5f" fontSize="11" fontWeight="bold" transform="rotate(-65 60 240)" letterSpacing="3">
              RED SEA CORRIDOR
            </text>

            {/* Ports */}
            {ports.map((port, idx) => {
              const { x, y } = projectCoords(port.lat, port.lng);
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="3" fill="#64748b" />
                  <text x={x + 6} y={y + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {port.name}
                  </text>
                </g>
              );
            })}

            {/* All shipments pins */}
            {allShipments.map((s) => {
              const { x, y } = projectCoords(s.coordinates.lat, s.coordinates.lng);
              const isSelected = s.id === selectedShipment.id;

              return (
                <g key={s.id}>
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 7 : 5}
                    fill={s.status === 'Needs attention' ? '#f43f5e' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {s.containerCode.replace('CG-SA-', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Location info box */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-400" />
                Current Waypoint: {selectedShipment.locationName}
              </span>
              <span className="text-slate-400">ETA: {selectedShipment.eta}</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Route segment: {selectedShipment.origin} ➔ {selectedShipment.destination}. Nearest emergency safe parking bay located 4.2 km ahead.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 flex justify-end bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};
