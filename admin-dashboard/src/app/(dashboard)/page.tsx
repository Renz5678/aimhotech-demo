"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight, User } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";
import Link from "next/link";
import { useDemoStore } from "@/store/useDemoStore";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

const screeningData = [
  { name: "W1", value: 40 },
  { name: "W2", value: 55 },
  { name: "W3", value: 50 },
  { name: "W4", value: 70 },
  { name: "W5", value: 65 },
  { name: "W6", value: 80 },
  { name: "W7", value: 75 },
  { name: "W8", value: 90 },
  { name: "W9", value: 85 },
  { name: "W10", value: 92 },
  { name: "W11", value: 95 },
  { name: "W12", value: 100, active: true },
];

function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { screenings, riskFlags, liveTriggerFired, patients } = useDemoStore();
  
  if (!mounted) return null;
  
  // Calculate dynamic KPIs from store
  const totalScreenings = screenings.length;
  const elevatedRiskShare = Math.round((riskFlags.filter(r => r.category === 'elevated').length / totalScreenings) * 100) || 0;

  const kpiData = {
    screeningsThisMonth: { value: totalScreenings + 1154, trend: "+12%", vsLabel: "vs last month", isPositive: true },
    elevatedRiskShare: { value: `${elevatedRiskShare}%`, trend: "+1.8 pts", vsLabel: "vs last month", isPositive: false },
    referralCompletion: { value: "78%", trend: "+6 pts", vsLabel: "vs last month", isPositive: true },
    stationsOnline: { value: "7 / 8", trend: "-1 kiosk", vsLabel: "vs last month", isPositive: false },
  };
  return (
    <div>
      <Header
        title="Population Health Dashboard"
        facilityName="RHU Malanday"
        stationCount={8}
      />
      
      <div className="px-8 pb-12">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {Object.entries(kpiData).map(([key, data], index) => {
            const labels = [
              "SCREENINGS THIS MONTH",
              "ELEVATED-RISK SHARE",
              "REFERRAL COMPLETION",
              "STATIONS ONLINE",
            ];
            return (
              <Card key={key} className="shadow-sm border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                    {labels[index]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-mono font-semibold text-foreground">
                      {data.value}
                    </span>
                    <div
                      className={`flex items-center text-xs font-bold font-mono ${
                        data.isPositive
                          ? "text-risk-low"
                          : "text-risk-elevated" // Note: Some logic inverted based on context (e.g. elevated risk is bad if it goes up)
                      }`}
                    >
                      {data.trend.includes("+") ? (
                        <ArrowUp className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 mr-1" />
                      )}
                      {data.trend}
                      <span className="font-sans font-normal text-muted-foreground ml-1">
                        {data.vsLabel}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Bento Section */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            {/* Heatmap Placeholder */}
            <Card className="shadow-sm border-border bg-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-primary">Barangay risk heatmap</h3>
                <p className="text-sm text-muted-foreground italic">% elevated-risk of screened, this month</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "San Isidro", risk: "18%", count: 214, type: "risk-elevated" },
                  { name: "Poblacion", risk: "22%", count: 189, type: "risk-elevated" },
                  { name: "Malanday", risk: "15%", count: 176, type: "risk-moderate" },
                  { name: "Bagong Silang", risk: "9%", count: 142, type: "risk-low" },
                ].map((item) => (
                  <div key={item.name} className={`p-4 rounded-lg bg-muted border-l-4 ${
                    item.type === 'risk-elevated' ? 'border-risk-elevated' :
                    item.type === 'risk-moderate' ? 'border-risk-moderate' : 'border-risk-low'
                  }`}>
                    <p className="font-bold text-sm text-foreground">{item.name}</p>
                    <p className={`text-[22px] font-mono font-semibold mt-1 ${
                      item.type === 'risk-elevated' ? 'text-risk-elevated' :
                      item.type === 'risk-moderate' ? 'text-risk-moderate' : 'text-risk-low'
                    }`}>{item.risk}</p>
                    <p className="text-[11px] text-muted-foreground mt-2 tracking-wide uppercase">{item.count} screened</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Screening Volume Chart */}
            <Card className="shadow-sm border-border bg-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-primary">Screening volume</h3>
                <p className="text-sm text-muted-foreground italic">last 12 weeks</p>
              </div>
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={screeningData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} 
                      dy={10}
                    />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                      {screeningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.active ? "var(--primary)" : "var(--secondary)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Activity Feed Sidebar Content */}
          <div className="col-span-4">
            <Card className="shadow-sm border-border bg-card p-6 h-full">
              <h3 className="text-lg font-semibold text-primary mb-8">Recent activity</h3>
              <div className="space-y-8 relative">
                {/* Connector line */}
                <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-muted -z-0"></div>
                
                {riskFlags.slice(0, 5).map((activity, index) => {
                  const p = patients.find(pat => pat.id === activity.patientId);
                  const isLive = activity.id.includes("LIVE");
                  return (
                  <div key={activity.id} className={`flex gap-4 relative z-10 transition-all ${isLive ? 'animate-pulse' : ''}`}>
                    <div className={`w-4 h-4 rounded-full mt-1.5 flex-shrink-0 border-4 border-card shadow-sm ${
                      activity.category === 'elevated' ? 'bg-risk-elevated' :
                      activity.category === 'moderate' ? 'bg-risk-moderate' : 'bg-risk-low'
                    }`}></div>
                    <div>
                      <p className="text-sm text-foreground leading-tight">
                        AI Brain flagged <span className="font-bold">{p?.name}</span>
                        {isLive && <span className="ml-2 text-xs font-bold text-primary">NEW</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(activity.timestamp))} ago</p>
                    </div>
                  </div>
                )})}
              </div>

              <Link href="/risk-queue" className="mt-12 group flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors">
                Open today's risk queue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <DashboardContent /> : null;
}
