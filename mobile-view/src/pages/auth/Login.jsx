import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');

  return (
    <div className="flex-1 flex flex-col justify-center px-edge_margin py-xl w-full h-full">
      <div className="mb-xl text-center">
        <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
          <span className="material-symbols-outlined text-primary-fixed text-[40px]">health_and_safety</span>
        </div>
        <h1 className="text-primary font-display-lg text-[28px] mb-xs">AImhotech</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Your intelligent health companion</p>
      </div>

      <div className="bg-surface-container-lowest p-md rounded-xl forest-card-shadow mb-xl">
        <h2 className="text-primary font-headline-sm text-lg mb-md">Login</h2>
        
        <div className="flex flex-col gap-sm mb-lg">
          <label className="text-on-surface-variant font-label-sm uppercase tracking-wider">Patient ID / Phone</label>
          <input 
            type="text" 
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="e.g. 0917-123-4567"
            className="w-full bg-surface-container border border-outline-variant rounded-lg p-sm font-body-md text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-md">
          <Button onClick={() => navigate('/patient/home')}>
            Login as Patient
          </Button>
          
          <Button variant="secondary" onClick={() => navigate('/worker/home')}>
            Login as Health Worker
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-auto">
        <button onClick={() => navigate('/onboarding')} className="text-primary font-label-sm uppercase tracking-wider hover:underline">
          New Here? Register
        </button>
      </div>
    </div>
  );
}
