"use client";

import React from 'react';
import { useAdminStore } from '@/store/useAdminStore';

export default function UsersPage() {
  const users = [
    { id: 'U-01', name: 'Dr. Sarah Jenkins', email: 's.jenkins@aimhotech.com', role: 'Clinical Admin', status: 'Active' },
    { id: 'U-02', name: 'Michael Chen', email: 'm.chen@aimhotech.com', role: 'System Admin', status: 'Active' },
    { id: 'U-03', name: 'Nurse Clara Bates', email: 'c.bates@aimhotech.com', role: 'Viewer', status: 'Active' },
    { id: 'U-04', name: 'David Smith', email: 'd.smith@aimhotech.com', role: 'Data Analyst', status: 'Inactive' },
  ];

  return (
    <div className="p-6 bg-[#F9F8F6] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A2F]">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system access, roles, and permissions.</p>
        </div>
        <button className="bg-[#1E3A2F] text-white px-4 py-2 rounded shadow hover:bg-[#2A4D3F] transition-colors">
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#A3B18B]/30">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F] focus:border-[#1E3A2F] w-64"
          />
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F]">
              <option>All Roles</option>
              <option>System Admin</option>
              <option>Clinical Admin</option>
            </select>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="bg-[#E5ECE9] text-[#1E3A2F] px-2 py-1 rounded text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-[#1E3A2F] hover:text-[#A3B18B] mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
