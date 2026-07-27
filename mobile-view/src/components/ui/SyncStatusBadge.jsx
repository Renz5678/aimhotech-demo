import React from 'react';

export default function SyncStatusBadge({ status = 'synced', pendingCount = 0 }) {
  const config = {
    synced: {
      color: "bg-surface-container-low text-on-surface-variant border-outline-variant",
      icon: "cloud_done",
      label: "All Synced"
    },
    pending: {
      color: "bg-secondary-container text-on-secondary-container border-secondary",
      icon: "sync",
      label: `${pendingCount} Pending Sync`
    },
    offline: {
      color: "bg-surface-container-highest text-on-surface border-outline",
      icon: "cloud_off",
      label: "Offline"
    }
  };

  const current = config[status] || config.synced;

  return (
    <div className={`flex items-center gap-xs px-sm py-1 border rounded-full text-label-sm font-label-sm ${current.color}`}>
      <span className="material-symbols-outlined text-[16px]">{current.icon}</span>
      <span>{current.label}</span>
    </div>
  );
}
