"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, Activity, AlertTriangle, Wifi, MapPin, Clock, ArrowUpRight,
  CheckCircle2, Circle, Zap, RefreshCw,
} from "lucide-react";
import { useDemoStore } from "@/store/useDemoStore";
import { useAdminStore } from "@/store/useAdminStore";
import { getRiskColor, getRiskLabel, formatDateTime, getReferralAgingDays } from "@/store/useDemoStore";

const RISK_COLORS_HEX: Record<string, string> = {
  low: "#4C7A5A",
  moderate: "#C79A3C",
  elevated: "#B0523F",
};

const DATE_FILTERS = ["This Week", "This Month", "Last 3 Months"] as const;

export default function DashboardPage() {
  const {
    patients,
    screenings,
    riskFlags,
    referrals,
    devices,
    facilities,
    barangayMetrics,
    triggerLiveSync,
    liveTriggerFired,
  } = useDemoStore();
  const { currentRole } = useAdminStore();

  const [activeFilter, setActiveFilter] = useState<string>("This Month");

  const weeklyScreeningData = [
    { week: "W1", value: 450, active: false },
    { week: "W2", value: 520, active: false },
    { week: "W3", value: 480, active: false },
    { week: "W4", value: 610, active: true },
  ];

  // ── KPIs ──────────────────────────────────────────────────────────
  const totalScreenings = screenings.length + 1150;
  const elevatedCount = riskFlags.filter((f) => f.category === "elevated").length;
  const resolvedReferrals = referrals.filter((r) => r.status === "resolved").length;
  const referralRate = referrals.length > 0
    ? Math.round((resolvedReferrals / referrals.length) * 100)
    : 78;
  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const totalDevices = devices.length;

  // ── Top 3 Urgent ─────────────────────────────────────────────────
  const urgentCases = [...riskFlags]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map((flag) => {
      const patient = patients.find((p) => p.id === flag.patientId);
      return { ...flag, patientName: patient?.name ?? "Unknown Patient" };
    });

  // ── Activity feed ─────────────────────────────────────────────────
  const activityFeed = [...riskFlags]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  // ── Referral funnel ───────────────────────────────────────────────
  const statusCounts = ["flagged", "referred", "seen", "resolved"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: referrals.filter((r) => r.status === s).length || (s === "flagged" ? riskFlags.length : 0),
  }));

  // ── Stations table ────────────────────────────────────────────────
  const stationDevices = devices.map((d) => ({
    ...d,
    facilityName: facilities.find((f) => f.id === d.facilityId)?.name ?? d.facilityId,
  }));

  const kpis = [
    {
      label: "Total Screenings",
      value: totalScreenings.toLocaleString(),
      trend: "+12% vs last month",
      up: true,
      icon: Users,
      color: "#1E3A2F",
      bg: "bg-[#1E3A2F]/8",
    },
    {
      label: "Elevated Risk Cases",
      value: String(elevatedCount),
      trend: "+3 new this week",
      up: false,
      icon: AlertTriangle,
      color: "#B0523F",
      bg: "bg-[#B0523F]/8",
    },
    {
      label: "Referral Completion",
      value: `${referralRate}%`,
      trend: "Stable",
      up: true,
      icon: Activity,
      color: "#4C7A5A",
      bg: "bg-[#4C7A5A]/8",
    },
    {
      label: "Stations Online",
      value: `${onlineDevices} / ${totalDevices}`,
      trend: `${totalDevices - onlineDevices} need attention`,
      up: onlineDevices === totalDevices,
      icon: Wifi,
      color: "#1E3A2F",
      bg: "bg-[#A3B18B]/20",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F] tracking-tight">Population Health Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">NCR Region · Quezon City LGU · Real-time AI Brain data</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date filter tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {DATE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeFilter === f
                    ? "bg-white text-[#1E3A2F] shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Live demo trigger */}
          {!liveTriggerFired && (
            <button
              onClick={() => triggerLiveSync()}
              title="Run Live Demo"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A2F] text-[#A3B18B] rounded-lg text-xs font-medium hover:bg-[#2d5544] transition-colors"
            >
              <Zap className="w-3 h-3" />
              Live Demo
            </button>
          )}
          {liveTriggerFired && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4C7A5A]/10 text-[#4C7A5A] rounded-lg text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Demo Active
            </span>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card rounded-xl border border-border p-5 animate-fade-in-up"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <ArrowUpRight
                className={`w-4 h-4 ${kpi.up ? "text-[#4C7A5A]" : "text-[#B0523F]"}`}
                style={{ transform: kpi.up ? "none" : "rotate(90deg)" }}
              />
            </div>
            <div className="animate-count-up">
              <p className="text-3xl font-bold text-[#1E3A2F] tracking-tight">{kpi.value}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{kpi.label}</p>
            <p className={`text-xs mt-1 font-medium ${kpi.up ? "text-[#4C7A5A]" : "text-[#C79A3C]"}`}>
              {kpi.trend}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: 2/3 width */}
        <div className="col-span-2 space-y-6">
          {/* Barangay Heatmap */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1E3A2F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A3B18B]" />
                Barangay Risk Heatmap
              </h2>
              <span className="text-xs text-muted-foreground">{barangayMetrics.length} stations</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {barangayMetrics.map((b) => {
                const color = RISK_COLORS_HEX[b.riskLevel] ?? "#4C7A5A";
                return (
                  <div
                    key={b.barangayId}
                    className="relative rounded-lg border p-4 overflow-hidden"
                    style={{ borderColor: `${color}30`, borderLeftWidth: 4, borderLeftColor: color }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{b.name}</p>
                        <p className="text-3xl font-bold mt-1" style={{ color }}>
                          {b.elevatedRiskPct}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{b.totalScreened} screened</p>
                      </div>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ color, backgroundColor: `${color}18` }}
                      >
                        {getRiskLabel(b.riskLevel as "low" | "moderate" | "elevated")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Screening Volume */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4">Screening Volume</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyScreeningData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {weeklyScreeningData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.active ? "#1E3A2F" : "#A3B18B66"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Referral Funnel */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4">Referral Funnel</h3>
              <div className="space-y-3 mt-2">
                {statusCounts.map((s) => {
                  const maxCount = Math.max(...statusCounts.map((x) => x.count), 1);
                  const pct = Math.round((s.count / maxCount) * 100);
                  const colorMap: Record<string, string> = {
                    Flagged: "#B0523F",
                    Referred: "#C79A3C",
                    Seen: "#4C7A5A",
                    Resolved: "#1E3A2F",
                  };
                  return (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{s.name}</span>
                        <span className="font-semibold text-foreground">{s.count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: colorMap[s.name] ?? "#A3B18B" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stations Overview */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-[#1E3A2F] text-sm mb-4">Kiosk Stations Overview</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left pb-2 font-medium">Device ID</th>
                  <th className="text-left pb-2 font-medium">Facility</th>
                  <th className="text-left pb-2 font-medium">Type</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stationDevices.map((d) => {
                  const statusColor =
                    d.status === "online" ? "#4C7A5A"
                    : d.status === "maintenance_needed" ? "#C79A3C"
                    : "#B0523F";
                  const statusLabel =
                    d.status === "online" ? "Online"
                    : d.status === "maintenance_needed" ? "Attention"
                    : "Offline";
                  return (
                    <tr key={d.id} className="even:bg-[#F1EEE7]/50">
                      <td className="py-2 font-mono text-xs text-muted-foreground">{d.id}</td>
                      <td className="py-2 text-xs max-w-[160px] truncate">{d.facilityName}</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {d.type === "microlife_b6_connect" ? "Microlife B6" : "Bionime iFree"}
                      </td>
                      <td className="py-2">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                          style={{ color: statusColor, backgroundColor: `${statusColor}18` }}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full inline-block ${d.status === "online" ? "animate-ping-dot" : ""}`}
                            style={{ backgroundColor: statusColor }}
                          />
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {d.lastSeen ? formatDateTime(d.lastSeen) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar: 1/3 */}
        <div className="space-y-4">
          {/* Top 3 Urgent Cases */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-[#1E3A2F] text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B0523F]" />
              Top Urgent Cases
            </h3>
            <div className="space-y-3">
              {urgentCases.map((c, i) => {
                const col = RISK_COLORS_HEX[c.category] ?? "#B0523F";
                return (
                  <div key={c.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: col }}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{c.patientName}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Confidence: {Math.round(c.confidence * 100)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{c.recommendedAction}</p>
                    </div>
                  </div>
                );
              })}
              {urgentCases.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No urgent cases</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1E3A2F] text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A3B18B]" />
                Recent Activity
              </h3>
              {liveTriggerFired && (
                <span className="flex items-center gap-1 text-[10px] text-[#4C7A5A] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4C7A5A] animate-ping-dot inline-block" />
                  LIVE
                </span>
              )}
            </div>
            <div className="space-y-0 relative">
              <div className="absolute left-[14px] top-4 bottom-4 w-px bg-border" />
              {activityFeed.map((flag, i) => {
                const patient = patients.find((p) => p.id === flag.patientId);
                const isLive = flag.id.includes("LIVE") || flag.id.includes("provisional");
                const col = RISK_COLORS_HEX[flag.category] ?? "#A3B18B";
                return (
                  <div key={flag.id} className="flex gap-3 pb-3 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isLive ? "ring-2 ring-offset-1" : ""}`}
                      style={{
                        backgroundColor: `${col}20`,
                        ["--tw-ring-color" as any]: col,
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" style={{ color: col }} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium truncate">{patient?.name ?? "Patient"}</p>
                        {isLive && (
                          <span className="px-1.5 py-0.5 bg-[#4C7A5A] text-white text-[9px] font-bold rounded uppercase">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {getRiskLabel(flag.category)} · {Math.round(flag.confidence * 100)}% confidence
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDateTime(flag.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {activityFeed.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 pl-6">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
