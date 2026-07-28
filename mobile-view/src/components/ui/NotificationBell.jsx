import React, { useState } from 'react';
import { useMobileStore } from '../../store/useMobileStore';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, markAllNotificationsRead } = useMobileStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative p-2">
        <span className="material-symbols-outlined text-primary">notifications</span>
        {unread > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-surface" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50">
          <div className="bg-surface w-full h-[80vh] rounded-t-3xl bottom-sheet flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-outline-variant">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={() => setOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-bold text-secondary">{unread} Unread</span>
              {unread > 0 && <button onClick={markAllNotificationsRead} className="text-sm font-bold text-primary">Mark all read</button>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 rounded-xl flex gap-3 ${!n.read ? 'bg-primary/5 border border-primary/20' : 'bg-surface-container'}`}>
                  {!n.read && <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0" />}
                  <div>
                    <div className={`font-bold ${!n.read ? 'text-on-surface' : 'text-secondary'}`}>{n.title}</div>
                    <div className="text-sm text-secondary mt-1">{n.body}</div>
                    <div className="text-xs text-secondary/70 mt-2">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
