import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import Button from '../../components/ui/Button';
import ConsentToggle from '../../components/ui/ConsentToggle';

export default function Onboarding() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar title="Welcome" showBack onBack={() => navigate('/login')} />
      
      <main className="flex-1 overflow-y-auto px-edge_margin py-md space-y-stack_gap pb-[100px]">
        <div className="text-center mb-xl">
          <h2 className="text-primary font-headline-md text-xl mb-xs">Join AImhotech</h2>
          <p className="text-on-surface-variant font-body-md text-sm">
            Before we start, please read and agree to our data practices. We take your privacy seriously.
          </p>
        </div>

        <ConsentToggle 
          title="Data Sharing Consent"
          description="I agree to share my health data with AImhotech to improve my care and track my risk over time."
          checked={agreed}
          onChange={setAgreed}
        />
      </main>

      <div className="fixed bottom-0 w-full p-md bg-surface-container-lowest border-t border-outline-variant z-40 max-w-[412px]">
        <Button 
          disabled={!agreed}
          onClick={() => navigate('/patient/home')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
