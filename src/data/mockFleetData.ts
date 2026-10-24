import { ContainerEntity, TripAuditRecord } from '../types/cargoguard';
import { calculateOverallRisk } from '../utils/riskEngine';
import { INITIAL_CARGO_PROFILES } from './cargoProfiles';

const pharmaProfile = INITIAL_CARGO_PROFILES[0];
const foodProfile = INITIAL_CARGO_PROFILES[1];
const electronicsProfile = INITIAL_CARGO_PROFILES[2];
const fragileProfile = INITIAL_CARGO_PROFILES[3];
const chemicalsProfile = INITIAL_CARGO_PROFILES[4];

// Baseline mock containers
export const INITIAL_CONTAINERS: ContainerEntity[] = [
  {
    id: 'cont-01',
    container_code: 'CG-SA-9041',
    container_type: 'Reefer 40ft',
    status: 'In Transit',
    origin: 'Jeddah Islamic Port',
    destination: 'Riyadh Dry Port',
    carrier: 'Bahri Logistics KSA',
    cargo_profile_id: foodProfile.id,
    cargo_name: 'Premium Almarai Fresh Dairy & Poultry',
    cargo_value_sar: 480000,
    graphene_sensor_id: 'DPG-SA-8801',
    graphene_sensor_batch: 'KSA-KAUST-DPG-2026-X4',
    current_location_name: 'Highway 40 (Near Taif Escarpment, KSA)',
    latest_telemetry: {
      container_id: 'cont-01',
      timestamp: '2026-10-23T15:20:10Z',
      temperature: 6.8, // breached profile max 4°C
      humidity: 82,     // breached profile max 75%
      shock_g: 2.85,    // breached profile max 2.2G
      tilt_deg: 9.4,    // elevated tilt
      strain_microstrain: 685, // breached graphene strain threshold 600 με
      latitude: 21.4373,
      longitude: 40.5127,
      battery_pct: 92,
      mesh_hops: 1,
      offline_buffered: false,
    },
    latest_risk: null as any, // computed below
  },
  {
    id: 'cont-02',
    container_code: 'CG-SA-8812',
    container_type: 'Reefer 40ft',
    status: 'In Transit',
    origin: 'King Abdulaziz Port Dammam',
    destination: 'King Fahad Medical City, Riyadh',
    carrier: 'Saudi Post SPL Logistics',
    cargo_profile_id: pharmaProfile.id,
    cargo_name: 'Insulin & Pediatric Vaccines (Cold Chain)',
    cargo_value_sar: 1850000,
    graphene_sensor_id: 'DPG-SA-9022',
    graphene_sensor_batch: 'KSA-KAUST-DPG-2026-X1',
    current_location_name: 'Route 80 (Dammam - Hofuf Expressway, KSA)',
    latest_telemetry: {
      container_id: 'cont-02',
      timestamp: '2026-10-23T15:22:45Z',
      temperature: 4.2, // optimal (2°C - 8°C)
      humidity: 46,     // safe (< 55%)
      shock_g: 0.65,    // smooth pavement
      tilt_deg: 1.2,    // flat
      strain_microstrain: 180, // normal elastic tension (< 450 με)
      latitude: 25.8825,
      longitude: 49.5211,
      battery_pct: 98,
      mesh_hops: 0,
      offline_buffered: false,
    },
    latest_risk: null as any,
  },
  {
    id: 'cont-03',
    container_code: 'CG-SA-7734',
    container_type: 'Smart Insulated 20ft',
    status: 'In Transit',
    origin: 'King Abdullah Port, Rabigh',
    destination: 'NEOM Tech City / Sindalah Hub',
    carrier: 'Red Sea Global Express',
    cargo_profile_id: electronicsProfile.id,
    cargo_name: 'AI Edge Server Blades & Optical Transceivers',
    cargo_value_sar: 3200000,
    graphene_sensor_id: 'DPG-SA-7740',
    graphene_sensor_batch: 'KSA-KAUST-DPG-2026-X3',
    current_location_name: 'Highway 5 (Yanbu - Duba Coastal Corridor)',
    latest_telemetry: {
      container_id: 'cont-03',
      timestamp: '2026-10-23T15:21:00Z',
      temperature: 23.4, // optimal (15°C - 28°C)
      humidity: 42,      // safe (< 50%)
      shock_g: 2.15,     // warning! (threshold 1.8G)
      tilt_deg: 4.8,     // minor tilt
      strain_microstrain: 430, // slight stress above 400 με
      latitude: 25.0234,
      longitude: 37.3312,
      battery_pct: 87,
      mesh_hops: 2,
      offline_buffered: true,
    },
    latest_risk: null as any,
  },
  {
    id: 'cont-04',
    container_code: 'CG-SA-6619',
    container_type: 'Standard Dry 40ft',
    status: 'In Transit',
    origin: 'Riyadh 2nd Industrial City',
    destination: 'Jubail Commercial Port',
    carrier: 'Almajdouie Logistics',
    cargo_profile_id: fragileProfile.id,
    cargo_name: 'Specialty Architectural Glazing & Ceramics',
    cargo_value_sar: 620000,
    graphene_sensor_id: 'DPG-SA-6651',
    graphene_sensor_batch: 'KSA-KAUST-DPG-2026-X2',
    current_location_name: 'Highway 65 (Al-Kharj Industrial Loop)',
    latest_telemetry: {
      container_id: 'cont-04',
      timestamp: '2026-10-23T15:19:30Z',
      temperature: 27.5,
      humidity: 38,
      shock_g: 0.85,
      tilt_deg: 2.1,
      strain_microstrain: 210,
      latitude: 24.1554,
      longitude: 47.3112,
      battery_pct: 94,
      mesh_hops: 0,
      offline_buffered: false,
    },
    latest_risk: null as any,
  },
  {
    id: 'cont-05',
    container_code: 'CG-SA-5502',
    container_type: 'High-Cube 45ft',
    status: 'In Transit',
    origin: 'Yanbu Industrial City',
    destination: 'Jazan Economic City Port',
    carrier: 'Hapag-Lloyd Arabian Feeder',
    cargo_profile_id: chemicalsProfile.id,
    cargo_name: 'Specialty Polyethylene Polymer Resins (IBC)',
    cargo_value_sar: 940000,
    graphene_sensor_id: 'DPG-SA-5519',
    graphene_sensor_batch: 'KSA-KAUST-DPG-2026-X5',
    current_location_name: 'Southern Red Sea Maritime Shipping Lane',
    latest_telemetry: {
      container_id: 'cont-05',
      timestamp: '2026-10-23T15:23:02Z',
      temperature: 28.2,
      humidity: 71,      // breached 65% RH
      shock_g: 1.45,
      tilt_deg: 16.2,    // breached 15° threshold due to ocean swells
      strain_microstrain: 820, // breached 750 με
      latitude: 18.2911,
      longitude: 41.5204,
      battery_pct: 79,
      mesh_hops: 1,
      offline_buffered: false,
    },
    latest_risk: null as any,
  },
];

// Compute initial risk scores
INITIAL_CONTAINERS.forEach(container => {
  const profile = INITIAL_CARGO_PROFILES.find(p => p.id === container.cargo_profile_id) || foodProfile;
  container.latest_risk = calculateOverallRisk(container.latest_telemetry, profile);
});

export const INITIAL_TRIP_AUDITS: TripAuditRecord[] = [
  {
    id: 'audit-01',
    trip_id: 'TRIP-KSA-2026-8812',
    container_code: 'CG-SA-8812',
    start_time: '2026-10-22T08:00:00Z',
    end_time: '2026-10-23T14:30:00Z',
    origin: 'King Abdulaziz Port Dammam',
    destination: 'King Fahad Medical City, Riyadh',
    cargo_name: 'Insulin & Pediatric Vaccines (Cold Chain)',
    total_km: 412,
    max_shock_g: 1.15,
    max_temp_c: 5.8,
    min_temp_c: 3.1,
    max_strain_ue: 310,
    peak_risk_score: 18.4,
    breach_count: 0,
    cryptographic_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'Compliant',
    inspector_signoff: 'Eng. Khalid Al-Otaibi (Saudi FDA Certified Inspector #SFDA-772)',
  },
  {
    id: 'audit-02',
    trip_id: 'TRIP-KSA-2026-9041',
    container_code: 'CG-SA-9041',
    start_time: '2026-10-23T04:15:00Z',
    origin: 'Jeddah Islamic Port',
    destination: 'Riyadh Dry Port',
    cargo_name: 'Premium Almarai Fresh Dairy & Poultry',
    total_km: 520,
    max_shock_g: 2.85,
    max_temp_c: 6.8,
    min_temp_c: 1.9,
    max_strain_ue: 685,
    peak_risk_score: 72.8,
    breach_count: 4,
    cryptographic_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Flagged For Review',
    inspector_signoff: 'Pending Port Customs & Cold Chain Verification',
  },
  {
    id: 'audit-03',
    trip_id: 'TRIP-KSA-2026-6619',
    container_code: 'CG-SA-6619',
    start_time: '2026-10-21T11:00:00Z',
    end_time: '2026-10-22T20:15:00Z',
    origin: 'Riyadh 2nd Industrial City',
    destination: 'Jubail Commercial Port',
    cargo_name: 'Specialty Architectural Glazing & Ceramics',
    total_km: 495,
    max_shock_g: 1.05,
    max_temp_c: 32.1,
    min_temp_c: 21.0,
    max_strain_ue: 280,
    peak_risk_score: 22.1,
    breach_count: 0,
    cryptographic_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'Compliant',
    inspector_signoff: 'Tariq Al-Ghamdi (Lloyds Register Quality Assurance)',
  },
];
