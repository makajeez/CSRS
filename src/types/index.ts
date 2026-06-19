// ── Enums ─────────────────────────────────────────────────────────────────────
export type ThreatCategory =
  | "armed_robbery"
  | "suspicious_activity"
  | "civil_unrest"
  | "infrastructure"
  | "missing_person"
  | "preemptive_intel";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "pending" | "active" | "dispatched" | "resolved";

export type UserRole = "citizen" | "officer" | "commander";

// ── Core Models ───────────────────────────────────────────────────────────────
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Outpost {
  id: string;
  name: string;
  location: Coordinates;
  units: number;
  available: number;
  contact: string;
}

export interface Incident {
  id: string;
  refNo: string;
  category: ThreatCategory;
  severity: SeverityLevel;
  status: IncidentStatus;
  address: string;
  state: string;
  lga: string;
  coordinates: Coordinates;
  description: string;
  suspectDescription?: string;
  anonymous: boolean;
  allowCorroboration: boolean;
  corroborations: number;
  mediaUrls: string[];
  reportedAt: string;
  updatedAt: string;
  assignedOutpost?: Outpost;
  distanceKm?: number;
}

export interface ReportFormState {
  category: ThreatCategory;
  severity: SeverityLevel;
  address: string;
  state: string;
  lga: string;
  datetime: string;
  description: string;
  suspectDescription: string;
  anonymous: boolean;
  allowCorroboration: boolean;
  receiveUpdates: boolean;
}

// ── API Response wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  activeIncidents: number;
  resolvedToday: number;
  dispatchedUnits: number;
  avgResponseMinutes: number;
  criticalCount: number;
  pendingCount: number;
}
