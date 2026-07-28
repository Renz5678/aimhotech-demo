// @aimhotech/shared — Utilities
// Shared helper functions used by both admin-dashboard and mobile-view.

import type { RiskCategory, ReferralStatus } from '../types/index';

// ── Risk Helpers ─────────────────────────────────────────────────

export const RISK_COLORS: Record<RiskCategory, { hex: string; text: string; bg: string; border: string }> = {
  low:      { hex: '#4C7A5A', text: 'text-[#4C7A5A]', bg: 'bg-[#4C7A5A]/10', border: 'border-[#4C7A5A]' },
  moderate: { hex: '#C79A3C', text: 'text-[#C79A3C]', bg: 'bg-[#C79A3C]/10', border: 'border-[#C79A3C]' },
  elevated: { hex: '#B0523F', text: 'text-[#B0523F]', bg: 'bg-[#B0523F]/10', border: 'border-[#B0523F]' },
};

export function getRiskColor(category: RiskCategory) {
  return RISK_COLORS[category] ?? RISK_COLORS.low;
}

export function getRiskLabel(category: RiskCategory): string {
  return { low: 'Low Risk', moderate: 'Moderate Risk', elevated: 'Elevated Risk' }[category];
}

export function getRiskIcon(category: RiskCategory): string {
  return { low: 'check_circle', moderate: 'warning', elevated: 'error' }[category];
}

// ── Referral Helpers ─────────────────────────────────────────────

export const REFERRAL_STEPS: ReferralStatus[] = ['flagged', 'referred', 'seen', 'resolved'];

export function getReferralStepIndex(status: ReferralStatus): number {
  return REFERRAL_STEPS.indexOf(status);
}

export function getReferralAgingDays(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function isReferralStalled(agingDays: number, threshold = 7): boolean {
  return agingDays >= threshold;
}

export function isReferralAtRisk(agingDays: number, threshold = 3): boolean {
  return agingDays >= threshold;
}

// ── Patient Helpers ──────────────────────────────────────────────

export function getPatientInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function formatPatientId(id: string): string {
  return id.toUpperCase();
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// ── Date/Time Helpers ────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ── CSV Export ───────────────────────────────────────────────────

export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── BP / Vitals Helpers ──────────────────────────────────────────

export function parseBP(bp: string): { systolic: number; diastolic: number } | null {
  const match = bp.match(/(\d+)\/(\d+)/);
  if (!match) return null;
  return { systolic: parseInt(match[1]), diastolic: parseInt(match[2]) };
}

export function getBPStatus(systolic: number, diastolic: number): 'normal' | 'elevated' | 'hypertension' {
  if (systolic >= 140 || diastolic >= 90) return 'hypertension';
  if (systolic >= 120 || diastolic >= 80) return 'elevated';
  return 'normal';
}

export function getGlucoseStatus(value: number): 'normal' | 'prediabetic' | 'diabetic' {
  if (value >= 126) return 'diabetic';
  if (value >= 100) return 'prediabetic';
  return 'normal';
}
