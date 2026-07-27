"use client";

import { useDemoStore } from "@/store/useDemoStore";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

function RiskQueueContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { riskFlags, patients, referrals } = useDemoStore();

  if (!mounted) return null;

  return (
    <div>
      <Header
        title="Risk Queue"
        facilityName="RHU Malanday"
        stationCount={8}
      />
      
      <div className="px-8 pb-12 max-w-5xl mx-auto">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-0">
            {riskFlags.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No active cases in the queue.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {riskFlags.map((flag) => {
                  const patient = patients.find((p) => p.id === flag.patientId);
                  const referral = referrals.find((r) => r.riskFlagId === flag.id);
                  const isNew = flag.id === "RF-LIVE-001-confirmed";
                  
                  return (
                    <Link
                      key={flag.id}
                      href={`/patient/${patient?.id}?risk=${flag.id}`}
                      className={`flex items-center gap-6 p-6 pl-8 hover:bg-muted/50 transition-colors relative ${
                        isNew ? 'bg-risk-elevated/5' : ''
                      }`}
                    >
                      {isNew && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-elevated opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-risk-elevated"></span>
                        </div>
                      )}

                      {/* Risk Category Badge */}
                      <div className="w-[100px] flex-shrink-0">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${flag.category === 'elevated' ? 'border-risk-elevated text-risk-elevated bg-risk-elevated/10' : ''}
                            ${flag.category === 'moderate' ? 'border-risk-moderate text-risk-moderate bg-risk-moderate/10' : ''}
                            ${flag.category === 'low' ? 'border-risk-low text-risk-low bg-risk-low/10' : ''}
                          `}
                        >
                          {flag.category.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          {patient?.name}
                          <span className="text-xs font-mono text-muted-foreground font-normal">
                            {patient?.id}
                          </span>
                        </h4>
                        <p className="text-sm text-foreground mt-1">
                          <span className="font-medium text-primary">AI Recommendation:</span> {flag.recommendedAction}
                        </p>
                      </div>

                      {/* Status / Aging */}
                      <div className="w-[200px] text-right">
                        {referral ? (
                          <div className="flex flex-col items-end">
                            <Badge variant="secondary" className="mb-1">
                              {referral.status.toUpperCase()}
                            </Badge>
                            {referral.stalled && (
                              <span className="text-xs text-destructive flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> Stalled ({referral.agingDays}d)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-destructive flex items-center justify-end">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Needs Review
                          </span>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          Flagged {formatDistanceToNow(new Date(flag.timestamp))} ago
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default function RiskQueuePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <RiskQueueContent /> : null;
}
