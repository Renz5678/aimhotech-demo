"use client";

import React, { useState, useMemo } from 'react';
import { useDemoStore, formatDateTime } from "@/store/useDemoStore";

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}
import { Brain, Sparkles, MessageSquareHeart } from 'lucide-react';

export default function AIBrainPage() {
  const { riskFlags, patients } = useDemoStore();
  
  // Local state to simulate acknowledging/dismissing flags
  const [localFlags, setLocalFlags] = useState(riskFlags);

  const aiStats = [
    { label: 'Anomalies flagged (30d)', value: '142', color: '#B0523F' },
    { label: 'Clinician true-positive rate', value: '89%', color: '#4C7A5A' },
    { label: 'False positives dismissed', value: '11', color: '#8F6E23' },
    { label: 'Avg time to acknowledge', value: '4.2 hrs', color: '#24291F' }
  ];

  const anomalyRows = useMemo(() => {
    return localFlags
      .filter(f => f.category !== 'low')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(f => {
        const patient = patients.find(p => p.id === f.patientId);
        
        let sev = 'WARNING';
        let sevColor = '#8F6E23';
        let sevBg = '#C79A3C1F';
        let dot = '#C79A3C';
        let anim = 'none';

        if (f.category === 'elevated' || (f.confidence ?? 0) > 0.9) {
          sev = 'CRITICAL';
          sevColor = '#B0523F';
          sevBg = '#B0523F14';
          dot = '#B0523F';
          anim = 'pulse 2.4s infinite';
        }

        const type = f.source === 'aibrain_cloud' ? 'Cross-screening trend' : 'Vitals spike';

        return {
          id: f.id,
          sev, sevColor, sevBg, dot, anim,
          type,
          time: getRelativeTime(f.timestamp),
          title: `Potential ${f.category} risk detected for ${patient?.name ?? 'Unknown'}`,
          detail: `Confidence: ${((f.confidence ?? 0.85) * 100).toFixed(0)}%. ${f.recommendedAction}. Patient has had previous moderate readings.`,
          open: !f.provisional, // using provisional as a toggle flag for demo
          resolved: f.provisional,
          resColor: '#4C7A5A',
          resolution: '✓ Routed to Dr. Reyes for review'
        };
      });
  }, [localFlags, patients]);

  const handleAck = (id: string) => {
    setLocalFlags(prev => prev.map(f => f.id === id ? { ...f, provisional: true } : f));
  };

  const handleDismiss = (id: string) => {
    setLocalFlags(prev => prev.filter(f => f.id !== id));
  };

  const aiModels = [
    { name: 'CardioRisk Edge v2', desc: 'On-device systolic/diastolic trend analyzer', ver: 'v2.3.9' },
    { name: 'Glycemic Insight Mini', desc: 'Kiosk-deployed glucose anomaly detector', ver: 'v1.4.0' },
    { name: 'AImhotech Core Brain', desc: 'Central longitudinal cross-reference engine', ver: 'v4.1.2-cloud' }
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#A3B18B]" />
          AI Brain & IFA
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Intelligent Flagging Agent (IFA) anomaly detection and model status.</p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
        {aiStats.map((s, i) => (
          <div key={i} className="flex-1 bg-white border border-[#E4E1D8] rounded-xl p-4 min-w-[200px]">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#6B7566] font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#E4E1D8] rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">IFA — Intelligent Flagging Agent</h2>
            <div className="text-xs text-[#6B7566]">Scans every synced record for anomalies</div>
          </div>
          <p className="text-[12.5px] text-[#6B7566] mb-6 leading-relaxed">
            Open flags are ordered by severity. Acknowledging routes a flag to the ops/clinical worklist; dismissing records a false-positive for retraining.
          </p>

          <div className="space-y-3">
            {anomalyRows.map((a) => (
              <div 
                key={a.id} 
                className="border rounded-[10px] p-4 flex gap-3.5 items-start transition-opacity"
                style={{ borderColor: a.open ? '#E4E1D8' : '#F1EEE7', backgroundColor: a.open ? '#fff' : '#FDFCFA', opacity: a.open ? 1 : 0.65 }}
              >
                <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full relative flex">
                  {a.anim !== 'none' && (
                    <span 
                      className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping-dot"
                      style={{ backgroundColor: a.dot }}
                    />
                  )}
                  <span className="relative inline-flex rounded-full w-2 h-2" style={{ backgroundColor: a.dot }} />
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-[11px] font-bold tracking-[0.5px] px-2.5 py-0.5 rounded-full" style={{ color: a.sevColor, backgroundColor: a.sevBg }}>
                      {a.sev}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6B7566] bg-[#F1EEE7] px-2.5 py-0.5 rounded-full">
                      {a.type}
                    </span>
                    <span className="text-[11.5px] text-[#9AA394] ml-auto font-mono">{a.time}</span>
                  </div>
                  
                  <div className="text-[13.5px] font-semibold mt-2.5 text-foreground">{a.title}</div>
                  <div className="text-[12.5px] text-[#6B7566] mt-1 leading-relaxed">{a.detail}</div>
                  
                  {a.open && (
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      <button 
                        onClick={() => handleAck(a.id)}
                        className="px-3.5 py-1.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[12px] font-semibold hover:bg-[#2A4A3C] transition-colors"
                      >
                        Acknowledge & route
                      </button>
                      <button 
                        onClick={() => handleDismiss(a.id)}
                        className="px-3.5 py-1.5 rounded-lg border border-[#D8D5CC] bg-white text-[#6B7566] text-[12px] font-semibold hover:border-[#B0523F] hover:text-[#B0523F] transition-colors"
                      >
                        Dismiss as false positive
                      </button>
                      <button 
                        className="px-3.5 py-1.5 rounded-lg border border-[#4C7A5A] bg-white text-[#4C7A5A] text-[12px] font-semibold hover:bg-[#EFF2EA] transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Ask assistant
                      </button>
                    </div>
                  )}

                  {a.resolved && (
                    <div className="text-[12px] font-semibold mt-2.5" style={{ color: a.resColor }}>
                      {a.resolution}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {anomalyRows.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground italic">
                No active anomalies in the queue.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-[#E4E1D8] rounded-xl p-6">
            <h2 className="text-[16px] font-bold text-foreground mb-4">AI Brain — model status</h2>
            
            <div className="space-y-0">
              {aiModels.map((m, i) => (
                <div key={i} className="flex gap-3 items-start py-3 border-b border-[#F1EEE7] last:border-0">
                  <span className="w-2 h-2 rounded-full bg-[#4C7A5A] shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <div className="text-[13.5px] font-semibold text-foreground">{m.name}</div>
                    <div className="text-[12px] text-[#6B7566] mt-1">{m.desc}</div>
                  </div>
                  <span className="text-[11px] font-semibold font-mono text-[#3F4A3A] bg-[#EFF2EA] rounded-full px-2 py-0.5 shrink-0">
                    {m.ver}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[12px] text-[#6B7566] mt-4 leading-relaxed">
              Models run on-device at kiosks (screening-grade) and re-score centrally on sync. Dismissed IFA flags feed the retraining set.
            </div>
          </div>

          <div className="bg-[#1E3A2F] rounded-xl p-6 text-[#DCE3D3] shadow-md">
            <div className="text-[15px] font-semibold text-[#F9F8F6] mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3B18B]" /> Ask the assistant
            </div>
            <div className="text-[12.5px] leading-relaxed text-[#BEC9B2] mb-4">
              The assistant can explain any flag, summarize today's queue, or draft a referral note — grounded in your role's data scope.
            </div>
            <button 
              className="px-4 py-2 rounded-lg border-none bg-[#A3B18B] text-[#1E3A2F] text-[12.5px] font-bold hover:bg-[#B7C49E] transition-colors flex items-center gap-2"
            >
              <MessageSquareHeart className="w-4 h-4" /> Open assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
