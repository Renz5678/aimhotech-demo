"use client";

import React, { useState, useMemo } from 'react';
import { useDemoStore } from "@/store/useDemoStore";
import { UserCog, Plus, Search } from 'lucide-react';
import type { UserRole } from '@/store/useDemoStore';
import { supabase } from '../../../lib/supabase';

export default function UsersPage() {
  const { users, facilities } = useDemoStore();
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [invName, setInvName] = useState('');
  const [invEmail, setInvEmail] = useState('');
  const [invRole, setInvRole] = useState<UserRole>('barangay_health_worker');
  const [invFacility, setInvFacility] = useState('');
  const [invError, setInvError] = useState(false);

  // Local state for user toggles (since useDemoStore users might be readonly in this demo)
  const [localUsers, setLocalUsers] = useState(users);

  const roleLabels: Record<string, string> = {
    'barangay_health_worker': 'Barangay Health Worker',
    'rhu_physician': 'RHU Physician',
    'doh_regional_officer': 'DOH Regional Officer',
    'super_admin': 'Super Admin'
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return localUsers.filter(u => {
      const facilityName = (facilities.find(f => f.id === u.facilityId)?.name ?? '').toLowerCase();
      const roleLabel = roleLabels[u.role].toLowerCase();
      return !q || 
        u.name.toLowerCase().includes(q) || 
        (u.email ?? '').toLowerCase().includes(q) || 
        roleLabel.includes(q) || 
        facilityName.includes(q);
    });
  }, [localUsers, search, facilities]);

  const userRows = filteredUsers.map(u => {
    const active = (u as any).active !== false;
    return {
      ...u,
      roleLabel: roleLabels[u.role] || u.role,
      facilityName: facilities.find(f => f.id === u.facilityId)?.name ?? u.facilityId ?? '—',
      active,
      statusLabel: active ? 'Active' : 'Deactivated',
      stColor: active ? '#4C7A5A' : '#B0523F',
      actionLabel: active ? 'Deactivate' : 'Reactivate'
    };
  });

  const toggleUser = async (userId: string) => {
    setLocalUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, active: !(u as any).active };
      }
      return u;
    }));
    const user = localUsers.find(u => u.id === userId);
    if (user) {
      await supabase.from('users').update({ active: !(user as any).active }).eq('id', userId);
    }
  };

  const sendInvite = async () => {
    if (!invName.trim() || !invEmail.trim()) {
      setInvError(true);
      return;
    }
    setInvError(false);
    
    const newUserId = 'USR-NEW-' + Date.now();
    const newFacilityId = invFacility || facilities[0]?.id || null;
    
    // Add to local list for demo purposes
    setLocalUsers(prev => [{
      id: newUserId,
      name: invName,
      email: invEmail,
      role: invRole,
      facilityId: newFacilityId,
      status: 'active'
    } as any, ...prev]);

    setShowInvite(false);
    setInvName('');
    setInvEmail('');

    await supabase.from('users').insert({ 
      id: newUserId, 
      name: invName, 
      email: invEmail, 
      role: invRole, 
      facilityId: newFacilityId 
    });
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1E3A2F] flex items-center gap-2">
          <UserCog className="w-6 h-6 text-[#A3B18B]" />
          Users & Roles
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage system access and role-based permissions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7566]" />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, role, or facility…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#D8D5CC] rounded-lg text-sm bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
          />
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[13.5px] font-semibold hover:bg-[#2A4A3C] transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Invite user
        </button>
      </div>

      <div className="bg-white border border-[#E4E1D8] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-[#F9F8F6]">
              <tr className="text-left border-b border-[#E4E1D8]">
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Name</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Email</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Role</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Facility</th>
                <th className="px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.4px] text-[#6B7566]">Status</th>
                <th className="px-5 py-3 text-[13px] font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EEE7]">
              {userRows.map((u, i) => (
                <tr key={u.id} className="even:bg-[#F1EEE7]/40 hover:bg-[#EFF2EA]/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-foreground">{u.name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B7566]">{u.email ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-[#3F4A3A] bg-[#EFF2EA]">
                      {u.roleLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-foreground">{u.facilityName}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12.5px] font-semibold" style={{ color: u.stColor }}>
                      {u.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={() => toggleUser(u.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#D8D5CC] bg-white text-[#6B7566] text-xs font-semibold hover:border-[#B0523F] hover:text-[#B0523F] transition-colors"
                    >
                      {u.actionLabel}
                    </button>
                  </td>
                </tr>
              ))}
              {userRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No users found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E3A2F]/40 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-[#F9F8F6] rounded-2xl p-7 w-full max-w-[420px] shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-1">Invite a new user</h2>
            <p className="text-[12.5px] text-[#6B7566] mb-5">They'll receive an activation email scoped to the assigned role and facility.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">Full name</label>
                <input 
                  type="text" 
                  value={invName}
                  onChange={e => { setInvName(e.target.value); setInvError(false); }}
                  placeholder="e.g. Maria Dela Cruz"
                  className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-sm bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-foreground">Email</label>
                <input 
                  type="email" 
                  value={invEmail}
                  onChange={e => { setInvEmail(e.target.value); setInvError(false); }}
                  placeholder="name@rhu.gov.ph"
                  className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-sm bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-foreground">Role</label>
                  <select 
                    value={invRole}
                    onChange={e => setInvRole(e.target.value as UserRole)}
                    className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
                  >
                    {Object.entries(roleLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-foreground">Facility</label>
                  <select 
                    value={invFacility}
                    onChange={e => setInvFacility(e.target.value)}
                    className="w-full p-2.5 border border-[#D8D5CC] rounded-lg text-[13px] bg-white outline-none focus:border-[#4C7A5A] focus:ring-4 focus:ring-[#4C7A5A]/10 transition-all"
                  >
                    {facilities.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {invError && (
                <div className="text-[12.5px] text-[#B0523F] bg-[#B0523F14] border border-[#B0523F33] rounded-lg p-2.5 mt-2">
                  Name and email are required.
                </div>
              )}

              <div className="flex gap-2.5 mt-2 pt-2">
                <button 
                  onClick={sendInvite}
                  className="flex-1 py-2.5 rounded-lg border-none bg-[#1E3A2F] text-[#F9F8F6] text-[13.5px] font-semibold hover:bg-[#2A4A3C] transition-colors"
                >
                  Send invite
                </button>
                <button 
                  onClick={() => setShowInvite(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#D8D5CC] bg-white text-[#6B7566] text-[13.5px] font-semibold hover:bg-[#F1EEE7] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
