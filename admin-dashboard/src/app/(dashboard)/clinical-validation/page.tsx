"use client";

import React from 'react';
import { useDemoStore } from '@/store/useDemoStore';

export default function ClinicalValidationPage() {
  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Clinical Validation</h1>
        <p className="text-gray-600 mt-1">Review and validate AI-generated insights and alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 border border-l-4 border-l-[#1E3A2F] border-t-[#A3B18B]/30 border-r-[#A3B18B]/30 border-b-[#A3B18B]/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Arrhythmia Detection Validation</h3>
                <p className="text-sm text-gray-500">Patient: John Doe (ID: P-10293)</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Pending Review
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4 font-mono text-sm">
              AI Insight: Potential atrial fibrillation episode detected between 02:00 AM and 02:15 AM.
              Confidence: 94%
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-[#1E3A2F] text-white px-4 py-2 rounded text-sm hover:bg-[#2A4D3F] transition-colors">
                Validate (True Positive)
              </button>
              <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                Reject (False Positive)
              </button>
              <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                Request More Data
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30">
            <h3 className="text-lg font-medium text-[#1E3A2F] mb-4">Validation Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">True Positive Rate</span>
                  <span className="font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1E3A2F] h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">False Positive Rate</span>
                  <span className="font-medium text-gray-900">8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#A3B18B] h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Pending Validations</span>
                  <span className="font-medium text-gray-900">14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
