"use client";

import React, { useState } from 'react';

export default function SettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState('7');

  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A2F]">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure global application parameters and security policies.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Security Section */}
        <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30">
          <h2 className="text-lg font-medium text-[#1E3A2F] mb-4 pb-2 border-b border-gray-200">Security & Authentication</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Require Multi-Factor Authentication</h4>
                <p className="text-xs text-gray-500">Enforce MFA for all administrative users.</p>
              </div>
              <button 
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${mfaEnabled ? 'bg-[#1E3A2F]' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">Session Timeout (Minutes)</label>
              <input type="number" defaultValue={15} className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]" />
              <p className="text-xs text-gray-500 mt-1">Auto-logout after period of inactivity.</p>
            </div>
          </div>
        </div>

        {/* Data & Compliance */}
        <div className="bg-white rounded-lg shadow p-6 border border-[#A3B18B]/30">
          <h2 className="text-lg font-medium text-[#1E3A2F] mb-4 pb-2 border-b border-gray-200">Data & Compliance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Audit Log Retention (Years)</label>
              <select 
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]"
              >
                <option value="5">5 Years</option>
                <option value="7">7 Years (HIPAA Default)</option>
                <option value="10">10 Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A2F] rounded-md hover:bg-[#2A4D3F] shadow">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
