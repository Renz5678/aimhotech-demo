"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, Filter, Search, ChevronRight, Activity, Clock, MoreVertical, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useDemoStore, getRiskColor, getRiskLabel, formatDate, formatDateTime, calculateAge } from "@/store/useDemoStore";
import { useAdminStore } from "@/store/useAdminStore";

export default function RiskQueuePage() {
  const { patients, riskFlags, referrals, facilities, liveTriggerFired } = useDemoStore();
  const { currentRole } = useAdminStore();
  
  const [filterTab, setFilterTab] = useState<"All" | "Needs Review" | "Referred" | "Resolved">("All");
  const [sortOrder, setSortOrder] = useState<"risk" | "date">("risk");

  const riskQueueItems = useMemo(() => {
    return riskFlags.map(flag => {
      const patient = patients.find(p => p.id === flag.patientId);
      const referral = referrals.find(r => r.riskFlagId === flag.id);
      
      let status: "Needs Review" | "Referred" | "Resolved" = "Needs Review";
      if (referral) {
        status = referral.status === "resolved" ? "Resolved" : "Referred";
      }

      return {
        ...flag,
        patient,
        status,
        referral
      };
    }).filter(item => item.patient); // only valid
  }, [riskFlags, patients, referrals]);

  const filteredAndSortedItems = useMemo(() => {
    let result = riskQueueItems;

    if (filterTab !== "All") {
      result = result.filter(item => item.status === filterTab);
    }

    result.sort((a, b) => {
      if (sortOrder === "risk") {
        const riskScore = { elevated: 3, moderate: 2, low: 1 };
        const scoreA = riskScore[a.category as keyof typeof riskScore] || 1;
        const scoreB = riskScore[b.category as keyof typeof riskScore] || 1;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.confidence - a.confidence;
      } else {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    return result;
  }, [riskQueueItems, filterTab, sortOrder]);

  const stats = {
    needsReview: riskQueueItems.filter(i => i.status === "Needs Review").length,
    elevated: riskQueueItems.filter(i => i.category === "elevated").length,
    referred: riskQueueItems.filter(i => i.status === "Referred").length,
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#B0523F]" />
            Risk Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-flagged cases requiring clinical validation</p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-card border border-border rounded-lg flex p-1">
            <button
              onClick={() => setSortOrder("risk")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${sortOrder === "risk" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Highest Risk First
            </button>
            <button
              onClick={() => setSortOrder("date")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${sortOrder === "date" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Newest First
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.elevated}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Elevated Cases</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.needsReview}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Needs Review</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.referred}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Referred / Handled</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-border">
        {["All", "Needs Review", "Referred", "Resolved"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab as any)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filterTab === tab
                ? "border-[#1E3A2F] text-[#1E3A2F]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "Needs Review" && stats.needsReview > 0 && (
              <span className="ml-2 bg-[#B0523F] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {stats.needsReview}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {filteredAndSortedItems.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Queue is empty</p>
            <p className="text-sm mt-1">No risk flags match the current filters.</p>
          </div>
        ) : (
          filteredAndSortedItems.map((item) => {
            const riskColor = getRiskColor(item.category as any);
            const isLive = item.id.includes("LIVE") || item.provisional;
            const facility = facilities.find(f => f.id === item.patient!.facilityId);

            return (
              <div key={item.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-4 relative overflow-hidden">
                {isLive && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-[#4C7A5A]" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${riskColor.hex}15`, color: riskColor.hex }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor.hex }} />
                      {getRiskLabel(item.category as any)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(item.timestamp)}
                    </span>
                    {isLive && (
                      <span className="px-2 py-0.5 bg-[#4C7A5A] text-white text-[9px] font-bold rounded uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping-dot inline-block" />
                        Live
                      </span>
                    )}
                    {item.id === 'risk-2' && ( // Hardcoded demo concurrency
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" /> In Review by Dr. Cruz
                      </span>
                    )}
                  </div>

                  <div className="flex items-end gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground">{item.patient!.name}</h3>
                    <p className="text-sm text-muted-foreground mb-0.5 font-mono">{item.patient!.id}</p>
                    <p className="text-sm text-muted-foreground mb-0.5">· {calculateAge(item.patient!.dob)} yrs, {item.patient!.sex === 'M' ? 'Male' : 'Female'}</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                    <p className="text-sm font-medium text-[#1E3A2F] mb-1">AI Recommendation ({Math.round(item.confidence * 100)}% Confidence)</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.recommendedAction}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end min-w-[200px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Needs Review' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'Referred' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[150px] truncate" title={facility?.name}>
                      {facility?.name}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full mt-4 md:mt-0">
                    <Link 
                      href={`/patient/${item.patientId}`}
                      className="flex-1 text-center px-4 py-2 bg-white border border-border text-[#1E3A2F] rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                    >
                      View Profile
                    </Link>
                    {item.status === 'Needs Review' && currentRole !== 'barangay_health_worker' && (
                      <Link 
                        href={`/patient/${item.patientId}`}
                        className="flex-1 text-center px-4 py-2 bg-[#1E3A2F] text-white rounded-lg text-sm font-medium hover:bg-[#1E3A2F]/90 transition-colors shadow-sm"
                      >
                        Action
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
