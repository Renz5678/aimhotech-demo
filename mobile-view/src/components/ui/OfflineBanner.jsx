import React from 'react';

export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null;
  return (
    <div className="bg-amber-100 text-amber-900 px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold w-full animate-[slideInUp_0.3s_ease-out]">
      <span className="material-symbols-outlined text-[18px]">wifi_off</span>
      Offline — showing cached data
    </div>
  );
}
