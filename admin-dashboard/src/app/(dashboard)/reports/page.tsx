"use client";

import React from 'react';

export default function ReportsPage() {
  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Generate and view system and clinical reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30 hover:border-[#1E3A2F] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#E5ECE9] flex items-center justify-center text-[#1E3A2F] mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Population Health Summary</h3>
          <p className="text-sm text-gray-500 mb-4">Overview of patient demographics, aggregate risk scores, and trend analysis over the last 30 days.</p>
          <div className="flex items-center text-sm font-medium text-[#1E3A2F]">
            Generate Report <span className="ml-1">→</span>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30 hover:border-[#1E3A2F] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#E5ECE9] flex items-center justify-center text-[#1E3A2F] mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Alert Accuracy</h3>
          <p className="text-sm text-gray-500 mb-4">Detailed breakdown of clinical validation metrics, false positive rates, and model performance.</p>
          <div className="flex items-center text-sm font-medium text-[#1E3A2F]">
            Generate Report <span className="ml-1">→</span>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30 hover:border-[#1E3A2F] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#E5ECE9] flex items-center justify-center text-[#1E3A2F] mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Device Utilization & Uptime</h3>
          <p className="text-sm text-gray-500 mb-4">Metrics on patient adherence, hardware fleet uptime, and connectivity issues.</p>
          <div className="flex items-center text-sm font-medium text-[#1E3A2F]">
            Generate Report <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
