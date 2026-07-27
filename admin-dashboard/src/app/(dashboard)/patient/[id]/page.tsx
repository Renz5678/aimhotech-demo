"use client";

import { use } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, User as UserIcon, Calendar, Hospital } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

function PatientDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { id } = use(params);
  const router = useRouter();
  const { patients, screenings, riskFlags, referrals, createReferral } = useDemoStore();

  const [referralDestination, setReferralDestination] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!mounted) return null;

  const patient = patients.find((p) => p.id === id);
  const patientScreenings = screenings.filter((s) => s.patientId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const activeRiskFlag = riskFlags.find((rf) => rf.patientId === id && !referrals.find((r) => r.riskFlagId === rf.id));
  const activeReferral = referrals.find((r) => r.patientId === id);

  if (!patient) return <div>Patient not found</div>;

  const handleCreateReferral = () => {
    if (activeRiskFlag && referralDestination) {
      createReferral(patient.id, activeRiskFlag.id, referralDestination);
      setIsDialogOpen(false);
      // Let the UI update naturally via Zustand state
    }
  };

  return (
    <div>
      <Header
        title="Patient Record"
        facilityName="RHU Malanday"
        stationCount={8}
      />

      <div className="px-8 pb-12 max-w-5xl mx-auto space-y-6">
        <Link href="/risk-queue" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Queue
        </Link>

        {/* Patient Header */}
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-8 flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{patient.name}</h2>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground font-mono">
                  <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1"/> ID: {patient.id}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> DOB: {patient.dob} ({patient.sex})</span>
                  <span className="flex items-center"><Hospital className="w-4 h-4 mr-1"/> {patient.facilityId}</span>
                </div>
              </div>
            </div>

            {activeRiskFlag && !activeReferral && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger
                  render={
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      Create Referral
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Refer Patient to Partner Facility</DialogTitle>
                    <DialogDescription>
                      Assign this case to a higher-level facility for specialized care.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Select value={referralDestination} onValueChange={(val) => setReferralDestination(val || "")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOSP-QC-STLUKES">St. Luke's Medical Center - QC</SelectItem>
                          <SelectItem value="HOSP-QC-EASTAVENUE">East Avenue Medical Center</SelectItem>
                          <SelectItem value="HOSP-QC-GENERAL">Quezon City General Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateReferral} disabled={!referralDestination}>Confirm Referral</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {activeReferral && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Referral Status</p>
                <Badge variant="secondary" className="text-lg py-1 px-4 border-primary text-primary">
                  {activeReferral.status.toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Brain Assessment */}
        {activeRiskFlag && (
          <Card className="shadow-sm border-risk-elevated bg-risk-elevated/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-risk-elevated text-lg">
                  <Activity className="w-5 h-5 mr-2" />
                  AI Brain Assessment
                </CardTitle>
                <Badge variant="destructive" className="bg-risk-elevated">{Math.round(activeRiskFlag.confidence * 100)}% Confidence</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">{activeRiskFlag.recommendedAction}</p>
              <p className="text-sm text-muted-foreground mt-2">Triggered by recent screening from {activeRiskFlag.source}</p>
            </CardContent>
          </Card>
        )}

        {/* Screening History */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Screening History</h3>
        <div className="space-y-4">
          {patientScreenings.map((screening) => (
            <Card key={screening.id} className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-mono text-sm text-muted-foreground">{new Date(screening.timestamp).toLocaleString()}</div>
                  <Badge variant="outline">{screening.gradeLevel}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Pressure</p>
                    <p className="text-2xl font-mono font-semibold">{screening.bp || '--'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Glucose</p>
                    <p className="text-2xl font-mono font-semibold">{screening.glucose || '--'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AFIB Flag</p>
                    {screening.afibFlag ? (
                      <Badge variant="destructive" className="mt-1 bg-risk-elevated">Detected</Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1">Normal</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {patientScreenings.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No screenings recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <PatientDetailContent params={params} /> : null;
}
