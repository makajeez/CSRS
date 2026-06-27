import { type FC, type ReactNode } from "react";
import { type SeverityLevel, type IncidentStatus } from "../../types";

// ── Pulsing dot indicator ─────────────────────────────────────────────────────
export const PulsingDot = ({ color = "bg-amber-400", size = "h-[10px] w-[10px]" }) => (
  <span className="relative flex" style={{ width: 10, height: 10 }}>
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full ${size} ${color}`} />
  </span>
);

// ── Section label ─────────────────────────────────────────────────────────────
interface SectionLabelProps {
  children: ReactNode;
}
export const SectionLabel: FC<SectionLabelProps> = ({ children }) => (
  <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-5 pb-3 border-b border-white/8">
    {children}
  </p>
);

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
}
export const Card: FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-[#111110] border border-white/8 rounded-xl p-5 ${className}`}>
    {children}
  </div>
);

// ── Card label ────────────────────────────────────────────────────────────────
interface CardLabelProps {
  children: ReactNode;
  required?: boolean;
}
export const CardLabel: FC<CardLabelProps> = ({ children, required }) => (
  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase text-white/30 mb-4">
    {children}
    {required && (
      <span className="bg-red-500/10 text-red-500 font-mono text-[9px] px-2 py-0.5 rounded-full">
        REQUIRED
      </span>
    )}
  </div>
);

// ── Field ─────────────────────────────────────────────────────────────────────
interface FieldProps {
  label?: string;
  children: ReactNode;
  className?: string;
}
export const Field: FC<FieldProps> = ({ label, children, className = "" }) => (
  <div className={`mb-3 ${className}`}>
    {label && (
      <label className="block text-[12px] font-bold text-white/55 mb-1.25 tracking-[-0.01em]">
        {label}
      </label>
    )}
    {children}
  </div>
);

// ── Input class string (exported for reuse) ───────────────────────────────────
export const inputCls =
  "w-full bg-[#1a1a18] border border-white/[0.08] rounded-lg px-3 py-[9px] text-[13px] text-[#f5f4ef] outline-none focus:border-white/20 transition-colors placeholder:text-white/25";

// ── Toggle ────────────────────────────────────────────────────────────────────
interface ToggleProps {
  on: boolean;
  onToggle: () => void;
}
export const Toggle: FC<ToggleProps> = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 border cursor-pointer ${
      on ? "bg-red-500 border-red-500" : "bg-white/10 border-white/20"
    }`}
  >
    <span
      className={`absolute top-0.75 left-0.75 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        on ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

// ── Severity badge ────────────────────────────────────────────────────────────
const SEV_STYLES: Record<SeverityLevel, string> = {
  low:      "bg-teal-500/10 text-teal-400 border-teal-500/25",
  medium:   "bg-amber-400/10 text-amber-400 border-amber-400/25",
  high:     "bg-red-500/10 text-red-400 border-red-500/25",
  critical: "bg-red-500 text-white border-red-500",
};

interface SeverityBadgeProps {
  level: SeverityLevel;
}
export const SeverityBadge: FC<SeverityBadgeProps> = ({ level }) => (
  <span className={`font-mono text-[9px] px-2 py-0.75 rounded-full border uppercase tracking-[0.06em] ${SEV_STYLES[level]}`}>
    {level}
  </span>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<IncidentStatus, string> = {
  pending:    "bg-amber-400/10 text-amber-400 border-amber-400/25",
  active:     "bg-red-500/10 text-red-400 border-red-500/25",
  dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  resolved:   "bg-teal-500/10 text-teal-400 border-teal-500/25",
};

interface StatusBadgeProps {
  status: IncidentStatus;
}
export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <span className={`font-mono text-[9px] px-2 py-0.75 rounded-full border uppercase tracking-[0.06em] ${STATUS_STYLES[status]}`}>
    {status}
  </span>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string | number;
  sup?: string;
  label: string;
  accent?: string;
}
export const StatCard: FC<StatCardProps> = ({ value, sup, label, accent = "text-red-500" }) => (
  <div className="bg-[#111110] border border-white/8 rounded-xl py-5 px-4 text-center">
    <div className="text-[1.75rem] font-extrabold tracking-[-0.04em] text-[#f5f4ef]">
      {value}
      {sup && <span className={accent}>{sup}</span>}
    </div>
    <div className="font-mono text-[10px] text-white/40 mt-1 tracking-[0.06em]">{label}</div>
  </div>
);
