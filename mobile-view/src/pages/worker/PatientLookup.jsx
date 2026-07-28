import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';
import { useLiveDemoStore } from '../../../../packages/shared/src/store/useLiveDemoStore.ts';
import QRScanModal from '../../components/ui/QRScanModal';
import PatientCard from '../../components/ui/PatientCard';
import OfflineBanner from '../../components/ui/OfflineBanner';

export default function PatientLookup() {
  const [search, setSearch] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const { selectPatient, isOnline } = useMobileStore();
  const allPatients = useLiveDemoStore(s => s.patients);
  const riskFlags = useLiveDemoStore(s => s.riskFlags);

  const handleScan = (id) => {
    setShowQR(false);
    setSearch('Maria Dela Cruz');
  };

  const onSelect = (id) => {
    selectPatient(id);
    navigate('/worker/screening/device');
  };

  const filtered = search ? allPatients.filter(p => (p.firstName + ' ' + p.lastName).toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())) : allPatients.slice(0,3);

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Patient Lookup" showBack onBack={() => navigate('/worker/home')} />
      <OfflineBanner isOnline={isOnline} />
      
      <div className="p-4 bg-surface z-10 sticky top-0 border-b border-outline-variant/30 shadow-sm">
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-container rounded-xl flex items-center px-3 border border-outline-variant focus-within:border-primary">
            <span className="material-symbols-outlined text-secondary">search</span>
            <input type="text" placeholder="Search name or ID" className="w-full bg-transparent p-3 focus:outline-none" value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')}><span className="material-symbols-outlined text-secondary">close</span></button>}
          </div>
          <button onClick={() => setShowQR(true)} className="bg-primary text-white p-3 rounded-xl card-shadow-1">
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 page-enter">
        {!search && <h3 className="font-bold text-secondary text-sm uppercase px-1 mb-2">Recent Patients</h3>}
        {filtered.length > 0 ? (
          filtered.map(p => {
            const risk = riskFlags.find(r => r.patientId === p.id && r.status === 'confirmed');
            return (
              <PatientCard key={p.id} patient={p} riskCategory={risk?.riskCategory} lastScreeningDate="Oct 14, 2023" onSelect={() => onSelect(p.id)} />
            );
          })
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-secondary/30 mb-4">person_search</span>
            <p className="text-secondary font-bold mb-6">No patient found</p>
            <button className="bg-primary/10 text-primary border-2 border-primary px-6 py-3 rounded-xl font-bold">Enroll New Patient</button>
          </div>
        )}
      </div>

      {showQR && <QRScanModal isOpen={showQR} onClose={() => setShowQR(false)} onScan={handleScan} />}
    </div>
  );
}
