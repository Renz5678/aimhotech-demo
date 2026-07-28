"use client";

import React, { useState } from 'react';
import { useDemoStore } from '@/store/useDemoStore';

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('outgoing');

  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Specialist Referrals</h1>
        <button className="bg-[#1E3A2F] text-white px-4 py-2 rounded shadow hover:bg-[#2A4D3F] transition-colors">
          New Referral
        </button>
      </div>

      <div className="flex space-x-1 mb-6 border-b border-[#A3B18B]/30">
        <button 
          onClick={() => setActiveTab('outgoing')}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'outgoing' 
              ? 'border-[#1E3A2F] text-[#1E3A2F]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Outgoing Referrals
        </button>
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'incoming' 
              ? 'border-[#1E3A2F] text-[#1E3A2F]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Incoming Referrals
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center border border-[#A3B18B]/30">
        <svg className="mx-auto h-12 w-12 text-[#A3B18B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} referrals</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are currently no {activeTab} referrals to display in this environment.
        </p>
      </div>
    </div>
  );
}
