"use client";

import { useState, useEffect } from "react";
import { useDemoStore } from "@/store/useDemoStore";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function PatientsContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { patients, riskFlags } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (!mounted) return null;

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header
        title="Patient Registry"
        facilityName="RHU Malanday"
        stationCount={8}
      />
      
      <div className="px-8 pb-12 max-w-5xl mx-auto">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search by name, ID, or QR..." 
            className="pl-10 py-6 text-lg bg-card border-border shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredPatients.map((patient) => {
                const activeRisk = riskFlags.find(rf => rf.patientId === patient.id);
                return (
                  <Link
                    key={patient.id}
                    href={`/patient/${patient.id}`}
                    className="flex items-center gap-6 p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                      {patient.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        {patient.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        ID: {patient.id} • DOB: {patient.dob} • {patient.sex}
                      </p>
                    </div>

                    <div className="w-[150px] text-right flex justify-end">
                      {activeRisk ? (
                        <Badge 
                          variant="outline" 
                          className={`
                            ${activeRisk.category === 'elevated' ? 'border-risk-elevated text-risk-elevated bg-risk-elevated/10' : ''}
                            ${activeRisk.category === 'moderate' ? 'border-risk-moderate text-risk-moderate bg-risk-moderate/10' : ''}
                            ${activeRisk.category === 'low' ? 'border-risk-low text-risk-low bg-risk-low/10' : ''}
                          `}
                        >
                          {activeRisk.category.toUpperCase()} RISK
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No active risks</span>
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                );
              })}
              
              {filteredPatients.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No patients found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PatientsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <PatientsContent /> : null;
}
