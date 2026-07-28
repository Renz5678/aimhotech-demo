// ─────────────────────────────────────────────────────────────────
// @aimhotech/shared — Types
// Single source of truth for all entity interfaces used across
// admin-dashboard and mobile-view.
// ─────────────────────────────────────────────────────────────────

// ── Enum-style Union Types ────────────────────────────────────────

export type RiskCategory = 'low' | 'moderate' | 'elevated';
export type ReferralStatus = 'flagged' | 'referred' | 'seen' | 'resolved';
export type UserRole =
  | 'barangay_health_worker'
  | 'rhu_physician'
  | 'doh_regional_officer'
  | 'super_admin';
export type DeviceStatus = 'online' | 'offline' | 'maintenance_needed';
export type DeviceType = 'microlife_b6_connect' | 'bionime_rightest_ifree' | 'kiosk_terminal';
export type FacilityType = 'barangay_station' | 'RHU' | 'hospital';
export type ConsentStatus = 'given' | 'withdrawn' | 'pending';
export type SyncStatus = 'synced' | 'pending' | 'error' | 'offline';
export type ScreeningGrade = 'screening' | 'diagnostic';
export type AppMode = 'patient' | 'worker';
export type Language = 'en' | 'fil';
export type NotificationType =
  | 'risk_flag'
  | 'referral_created'
  | 'referral_updated'
  | 'appointment_reminder'
  | 'sync_complete'
  | 'device_alert';
export type ReportType =
  | 'monthly_summary'
  | 'quarterly_review'
  | 'cost_per_screening'
  | 'referral_funnel';

// ── Core Entities ─────────────────────────────────────────────────

export interface Patient {
  id: string;
  name: string;
  dob: string;
  sex: 'M' | 'F';
  facilityId: string;
  consentStatus: ConsentStatus;
  consentDate: string;
  phone?: string;
  age?: number;
  barangay?: string;
  risk?: string;
  vitals?: string;
  lastScreening?: string;
  screenCount?: number;
  reason?: string | null;
}

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  address: string;
  lgu: string;
  areaCodePrefix?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  facilityId: string | null;
  region?: string;
  email?: string;
  status?: 'active' | 'deactivated';
  lastLogin?: string;
}

export interface Device {
  id: string;
  type: DeviceType;
  facilityId: string;
  status: DeviceStatus;
  lastMaintenance: string;
  firmwareVersion?: string;
  lastSeen?: string;
  pairingHistory?: DevicePairingEvent[];
}

export interface DevicePairingEvent {
  timestamp: string;
  patientId: string;
  healthWorkerId: string;
  success: boolean;
}

// ── Screening & Risk ──────────────────────────────────────────────

export interface Screening {
  id: string;
  patientId: string;
  healthWorkerId: string;
  facilityId: string;
  timestamp: string;
  bp?: string;           // e.g. "120/80"
  bpSystolic?: number;
  bpDiastolic?: number;
  glucose?: string;      // e.g. "95 mg/dL"
  glucoseValue?: number;
  heartRate?: number;
  bmi?: number;
  height?: number;
  weight?: number;
  afibFlag?: boolean;
  deviceId?: string;
  gradeLevel: ScreeningGrade;
  syncStatus: SyncStatus;
  source: 'kiosk' | 'rhu' | 'hospital';
  notes?: string;
}

export interface VitalsDataPoint {
  timestamp: string;
  bpSystolic?: number;
  bpDiastolic?: number;
  glucoseValue?: number;
  heartRate?: number;
  riskCategory: RiskCategory;
}

export interface RiskFlag {
  id: string;
  patientId: string;
  screeningId: string;
  category: RiskCategory;
  confidence: number;     // 0.0 – 1.0
  source: string;
  recommendedAction: string;
  timestamp: string;
  provisional?: boolean;  // true = on-device AI, false = AI Brain confirmed
  status?: string;
  reviewer?: string | null;
}

// ── Referrals & Clinical Validation ──────────────────────────────

export interface ReferralStatusStep {
  status: ReferralStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Referral {
  id: string;
  patientId: string;
  riskFlagId: string;
  destinationFacilityId: string;
  destinationLabel?: string;
  status: ReferralStatus;
  stage: number;
  statusHistory: ReferralStatusStep[];
  createdAt: string;
  updatedAt: string;
  agingDays?: number;
  stalled?: boolean;
  notes?: string;
}

export interface ClinicalValidation {
  id: string;
  screeningId: string;
  patientId: string;
  validatingClinicianId: string;
  licenseNumber: string;
  qrVerified: boolean;
  status: 'awaiting' | 'verified' | 'submitted';
  submittedAt?: string;
  notes?: string;
}

// ── Appointments ──────────────────────────────────────────────────

export interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  type: 'follow_up' | 'referral' | 'telemedicine' | 'routine';
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  videoConsultUrl?: string;
  notes?: string;
}

// ── Sync & Offline ────────────────────────────────────────────────

export interface SyncQueueItem {
  id: string;
  entityType: 'screening' | 'risk_flag' | 'referral' | 'consent';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  retryCount: number;
  lastAttempt?: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'error';
  errorMessage?: string;
}

// ── Admin-Only Entities ───────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}

export interface Report {
  id: string;
  type: ReportType;
  generatedBy: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  facilityScope?: string;
  exportFormat?: 'csv' | 'pdf';
  createdAt: string;
  status: 'pending' | 'ready' | 'error';
}

// ── Notification ──────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  patientId?: string;
  referralId?: string;
  riskFlagId?: string;
}

// ── Barangay / Dashboard Metrics ─────────────────────────────────

export interface BarangayMetric {
  name: string;
  barangayId: string;
  totalScreened: number;
  elevatedRiskCount: number;
  elevatedRiskPct: number;
  riskLevel: RiskCategory;
}

export interface WeeklyScreeningPoint {
  week: string;
  value: number;
  active?: boolean;
}

export interface HealthTip {
  id: string;
  title: string;
  body: string;
  icon: string;
}

// ── Seed Data Shape ───────────────────────────────────────────────

export interface SeedData {
  _notes: string;
  facilities: Facility[];
  users: User[];
  devices: Device[];
  patients: Patient[];
  screenings: Screening[];
  vitalsHistory: Record<string, VitalsDataPoint[]>;
  riskFlags: RiskFlag[];
  referrals: Referral[];
  clinicalValidations: ClinicalValidation[];
  appointments: Appointment[];
  auditLog: AuditLogEntry[];
  reports: Report[];
  barangayMetrics: BarangayMetric[];
  weeklyScreeningData: WeeklyScreeningPoint[];
  healthTips: HealthTip[];
  liveTriggerScenario: LiveTriggerScenario;
}

export interface LiveTriggerScenario {
  patientId: string;
  description: string;
  steps: LiveTriggerStep[];
}

export interface LiveTriggerStep {
  step: number;
  actor: string;
  action: string;
  resultingRecord?: Record<string, unknown>;
}
