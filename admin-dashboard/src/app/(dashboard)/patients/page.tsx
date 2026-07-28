"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, User } from "lucide-react";
import Link from "next/link";
import { useDemoStore, getRiskColor, getRiskLabel, formatDate, calculateAge, exportToCSV } from "@/store/useDemoStore";

export default function PatientsPage() {
  const { patients, riskFlags, facilities } = useDemoStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "id" | "dob" | "risk">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getPatientRisk = (patientId: string) => {
    return riskFlags.find(f => f.patientId === patientId)?.category ?? "low";
  };

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.id.toLowerCase().includes(lowerTerm)
      );
    }

    if (riskFilter !== "all") {
      result = result.filter(p => getPatientRisk(p.id) === riskFilter);
    }

    if (facilityFilter !== "all") {
      result = result.filter(p => p.facilityId === facilityFilter);
    }

    result.sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";
      
      if (sortField === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortField === "id") {
        aVal = a.id;
        bVal = b.id;
      } else if (sortField === "dob") {
        aVal = a.dob;
        bVal = b.dob;
      } else if (sortField === "risk") {
        const riskScore = { elevated: 3, moderate: 2, low: 1 };
        aVal = riskScore[getPatientRisk(a.id) as keyof typeof riskScore] || 1;
        bVal = riskScore[getPatientRisk(b.id) as keyof typeof riskScore] || 1;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [patients, riskFlags, searchTerm, riskFilter, facilityFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const data = filteredAndSortedPatients.map(p => ({
      ID: p.id,
      Name: p.name,
      DOB: p.dob,
      Sex: p.sex,
      Facility: facilities.find(f => f.id === p.facilityId)?.name ?? p.facilityId,
      RiskLevel: getRiskLabel(getPatientRisk(p.id) as any),
      ConsentStatus: p.consentStatus
    }));
    exportToCSV(data, "patients-export");
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Patient Registry</h1>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-[#1E3A2F] rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#A3B18B]"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
            >
              <option value="all">All Facilities</option>
              {facilities.filter(f => f.type.includes('station')).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
            >
              <option value="all">All Risks</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="elevated">Elevated Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground uppercase tracking-wider text-xs cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">Patient Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground uppercase tracking-wider text-xs cursor-pointer hover:text-foreground" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">Patient ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground uppercase tracking-wider text-xs cursor-pointer hover:text-foreground" onClick={() => handleSort("dob")}>
                  <div className="flex items-center gap-1">Date of Birth <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground uppercase tracking-wider text-xs">
                  Facility
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground uppercase tracking-wider text-xs cursor-pointer hover:text-foreground" onClick={() => handleSort("risk")}>
                  <div className="flex items-center gap-1">Risk Level <ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <User className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p>No patients found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                  const riskCategory = getPatientRisk(patient.id) as "low" | "moderate" | "elevated";
                  const riskColor = getRiskColor(riskCategory);
                  const facility = facilities.find(f => f.id === patient.facilityId);

                  return (
                    <tr 
                      key={patient.id} 
                      className="even:bg-[#F1EEE7]/40 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <Link href={`/patient/${patient.id}`} className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: `${riskColor.hex}20`, color: riskColor.hex }}
                          >
                            {patient.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-[#1E3A2F] transition-colors">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.sex === 'F' ? 'Female' : 'Male'} · {calculateAge(patient.dob)} yrs</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {patient.id}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {formatDate(patient.dob)}
                      </td>
                      <td className="px-6 py-4 text-xs truncate max-w-[200px]">
                        {facility?.name ?? patient.facilityId}
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: `${riskColor.hex}18`, color: riskColor.hex }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor.hex }} />
                          {getRiskLabel(riskCategory)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredAndSortedPatients.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredAndSortedPatients.length)}</span> of <span className="font-medium text-foreground">{filteredAndSortedPatients.length}</span> patients
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-border bg-background disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-border bg-background disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
