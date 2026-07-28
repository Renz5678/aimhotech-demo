"use client";

import React from 'react';

export default function DevicesPage() {
  const devices = [
    { id: 'DEV-001', type: 'Wearable ECG', patient: 'Alice Smith', status: 'active', battery: '85%' },
    { id: 'DEV-002', type: 'Gateway Hub', patient: 'Alice Smith', status: 'active', battery: 'AC' },
    { id: 'DEV-003', type: 'Wearable ECG', patient: 'Bob Jones', status: 'offline', battery: '12%' },
    { id: 'DEV-004', type: 'Smart Scale', patient: 'Carol Williams', status: 'active', battery: '60%' },
  ];

  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F]">Device Fleet Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage connected patient devices.</p>
        </div>
        <button className="bg-[#1E3A2F] text-white px-4 py-2 rounded shadow hover:bg-[#2A4D3F] transition-colors">
          Register New Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-[#A3B18B]/20">
          <div className="text-sm text-gray-500 font-medium">Total Devices</div>
          <div className="text-2xl font-bold text-[#1E3A2F] mt-1">1,248</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-[#A3B18B]/20">
          <div className="text-sm text-gray-500 font-medium">Active Online</div>
          <div className="text-2xl font-bold text-green-600 mt-1">1,102</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-[#A3B18B]/20">
          <div className="text-sm text-gray-500 font-medium">Offline/Needs Attention</div>
          <div className="text-2xl font-bold text-red-600 mt-1">146</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-[#A3B18B]/20">
          <div className="text-sm text-gray-500 font-medium">Low Battery Warnings</div>
          <div className="text-2xl font-bold text-orange-500 mt-1">32</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#A3B18B]/30">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1E3A2F]">{device.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.patient}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.battery}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#1E3A2F] hover:text-[#A3B18B] mr-3">Diagnostics</button>
                  <button className="text-gray-500 hover:text-gray-700">Unpair</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
