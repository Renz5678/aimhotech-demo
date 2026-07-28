import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { useMobileStore } from '../../store/useMobileStore';

export default function PatientSettings() {
  const { language, setLanguage } = useMobileStore();
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);

  return (
    <div className="flex flex-col h-full bg-surface">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 page-enter">
        
        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Language</h3>
          <div className="bg-surface-container rounded-xl flex overflow-hidden">
            <button onClick={() => setLanguage('en')} className={`flex-1 py-3 font-bold ${language === 'en' ? 'bg-primary text-white' : ''}`}>English</button>
            <button onClick={() => setLanguage('fil')} className={`flex-1 py-3 font-bold ${language === 'fil' ? 'bg-primary text-white' : ''}`}>Filipino</button>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Notifications</h3>
          <div className="bg-surface-container rounded-xl p-2 space-y-2">
            {['Risk Alerts', 'Appointment Reminders', 'Referral Updates'].map(item => (
              <div key={item} className="flex justify-between items-center p-2">
                <span className="font-semibold">{item}</span>
                <input type="checkbox" defaultChecked className="toggle w-10 h-6" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Your Data & Consent</h3>
          <div className="bg-surface-container rounded-xl p-4">
            <p className="text-on-surface-variant font-body-md text-sm mb-4">
              You agreed to health data recording on Mar 3, 2026. You can review or withdraw this anytime — data capture stops immediately.
            </p>
            <button 
              onClick={() => navigate('/onboarding')} 
              className="w-full py-3 border border-primary text-primary rounded-xl font-bold bg-white"
            >
              Review my consent
            </button>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-primary mb-3 text-sm tracking-widest uppercase">Account</h3>
          <div className="bg-surface-container rounded-xl p-4 space-y-3">
            <div className="flex justify-between"><span className="text-secondary">Name</span><span className="font-bold">Rosalinda Buenaventura</span></div>
            <div className="flex justify-between"><span className="text-secondary">ID</span><span className="font-mono bg-surface px-2 py-1 rounded">QC-097-00214</span></div>
            <div className="flex justify-between"><span className="text-secondary">Barangay</span><span className="font-bold">San Isidro</span></div>
            <div className="flex justify-between"><span className="text-secondary">Member Since</span><span className="font-bold">Oct 2023</span></div>
          </div>
        </section>

        <div className="text-center text-sm text-secondary pt-4">
          <p>AImhotech v1.0.0</p>
          <a href="#" className="text-primary font-bold">Privacy Policy</a>
        </div>
      </div>

      {showConsent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Withdraw Consent?</h2>
            <p className="text-secondary mb-6">This will stop syncing your health data. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold">Cancel</button>
              <button onClick={() => setShowConsent(false)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
